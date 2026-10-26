import request from './request'

// 发送邮箱验证码：POST /api/v1/user/send_code
export function sendCode(email) {
  return request.post('/api/v1/user/send_code', { email })
}

// 邮箱注册：POST /api/v1/auth/register
// 采用「邮箱 + 验证码」流程；若后端要求密码，可补 password 字段。
export function register(payload) {
  return request.post('/api/v1/auth/register', payload)
}

// 邮箱登录：POST /api/v1/auth/login
// 返回 token，调用方负责写入 localStorage。
export function login(payload) {
  return request.post('/api/v1/auth/login', payload)
}
