import { reactive, computed } from 'vue'

const TOKEN_KEY = 'lynli_token'
const USER_KEY = 'lynli_user'

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

// 用户会话：token + 基础信息，纯前端无感持久化
export const user = reactive({
  token: localStorage.getItem(TOKEN_KEY) || '',
  info: loadUser()
})

export const isLoggedIn = computed(() => !!user.token)

export function setSession(token, info) {
  user.token = token || ''
  user.info = info || null
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
  if (info) localStorage.setItem(USER_KEY, JSON.stringify(info))
  else localStorage.removeItem(USER_KEY)
}

export function logout() {
  user.token = ''
  user.info = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
