import axios from 'axios'
import { Toast } from '@/utils/toast'
import router from '@/router' // 引入 router 以支持平滑跳转

export const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.lynli.me'

const request = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

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
    // 🚨 修正：对齐我们真正存的 key 叫 'token'
    const token = localStorage.getItem('token')
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

    if (data && typeof data === 'object' && 'code' in data && 'data' in data) {
      return data.data
    }
    return data
  },
  (error) => {
    const status = error.response?.status
    let msg = '网络异常，请稍后重试'

    if (status === 401) {
      msg = '登录已失效，请重新登录'
      // 🚨 修正：清理正确的 Key
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      
      // 🚨 修正：使用 vue-router 平滑跳转，绝对不刷新页面
      if (router.currentRoute.value.path !== '/auth') {
        router.push('/auth')
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
