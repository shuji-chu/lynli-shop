import axios from 'axios'
import { useRouter } from 'vue-router'

const request = axios.create({
  baseURL: 'https://api.lynli.me',
  timeout: 10000,
})

// 请求拦截器：每次请求自动带上 Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：遇到 401 自动踢回登录页
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth' // 强制跳转
    }
    return Promise.reject(error)
  }
)

export default request
