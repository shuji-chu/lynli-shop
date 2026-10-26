import axios from 'axios'
import { Toast } from '@/utils/toast'

// 线上 API 域名固定为 https://api.lynli.me（后端已配置 CORS 白名单）。
// 本地联调可新建 .env 设置 VITE_API_BASE=''（走 vite.config 的相对路径代理）。
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.lynli.me'

const request = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

// 后端返回结构可能为以下之一，拦截器统一处理：
//   1) 业务信封  { code: 1, data, msg }  -> 返回 data
//   2) 裸数据    (数组 / 对象，无 code)   -> 原样返回
//   3) 失败信封  { code: 0, msg }         -> Toast 报错并 reject
// 若后端实际信封的成功码 / 字段名不同，只需调整下面两处。
const SUCCESS_CODES = [1, 200]

function isExplicitError(payload) {
  if (payload && typeof payload === 'object' && 'code' in payload) {
    const c = payload.code
    if (!SUCCESS_CODES.includes(c)) return true
  }
  return false
}

// 请求拦截器：自动携带 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lynli_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：拆信封 + 全局错误提示 + 401 清登
request.interceptors.response.use(
  (response) => {
    const data = response.data

    if (isExplicitError(data)) {
      const msg = data.msg || data.message || '请求失败，请稍后重试'
      Toast.error(msg)
      return Promise.reject(new Error(msg))
    }

    // 带信封（同时存在 code 与 data 字段）-> 拆出 data
    if (data && typeof data === 'object' && 'code' in data && 'data' in data) {
      return data.data
    }
    // 否则原样返回（裸数组 / 裸对象）
    return data
  },
  (error) => {
    const status = error.response?.status
    let msg = '网络异常，请稍后重试'

    if (status === 401) {
      msg = '登录已失效，请重新登录'
      localStorage.removeItem('lynli_token')
      localStorage.removeItem('lynli_user')
      if (location.pathname !== '/auth') {
        location.href = '/auth'
      }
    } else if (status === 429) {
      msg = '操作过于频繁，请稍后再试'
    } else if (error.response?.data?.msg) {
      msg = error.response.data.msg
    } else if (error.code === 'ECONNABORTED') {
      msg = '请求超时，请检查网络'
    }

    Toast.error(msg)
    return Promise.reject(error)
  }
)

export default request
