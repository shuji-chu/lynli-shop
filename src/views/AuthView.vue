<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="title">LYNLI <span>泠礼</span></h2>
      
      <!-- 核心切换 Tab -->
      <div class="tabs">
        <div class="tab" :class="{ active: mode === 'login' }" @click="switchMode('login')">登录</div>
        <div class="tab" :class="{ active: mode === 'register' }" @click="switchMode('register')">注册</div>
      </div>

      <form @submit.prevent="onSubmit" class="form">
        <input v-model="form.email" type="email" placeholder="请输入邮箱" class="field" required />
        
        <!-- 只有注册和找回密码才需要验证码 -->
        <div class="code-row" v-if="mode !== 'login'">
          <input v-model="form.code" type="text" placeholder="邮箱验证码" class="field" required />
          <button type="button" class="btn-code" :disabled="counting" @click="onSend">
            {{ counting ? countdown + 's' : '获取验证码' }}
          </button>
        </div>

        <input v-model="form.password" type="password" placeholder="请输入密码" class="field" required />
        
        <!-- 只有注册和找回密码才需要确认密码 -->
        <input v-if="mode !== 'login'" v-model="form.confirmPassword" type="password" placeholder="请确认密码" class="field" required />

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? '处理中...' : (mode === 'login' ? '立即登录' : (mode === 'register' ? '注册新账户' : '重置密码')) }}
        </button>
      </form>

      <div class="footer-links">
        <span v-if="mode === 'login'" @click="switchMode('reset')">忘记密码？</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
// 这里假设你的 api 里有这些方法，如果没有请让后端智能体补全
import { sendCode, login, register, resetPassword } from '@/api/auth' 
import { setSession } from '@/store/user'
import { Toast } from '@/utils/toast'

const router = useRouter()
const mode = ref('login') // login, register, reset
const form = reactive({ email: '', password: '', confirmPassword: '', code: '' })
const loading = ref(false)
const counting = ref(false)
const countdown = ref(60)
let timer = null

function switchMode(newMode) {
  mode.value = newMode
  form.code = ''
  form.password = ''
  form.confirmPassword = ''
}

async function onSend() {
  if (!form.email) return Toast.error('请先输入邮箱')
  counting.value = true
  try {
    await sendCode(form.email, mode.value) // 传 type 给后端区分场景
    Toast.success('验证码已发送')
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        counting.value = false
      }
    }, 1000)
  } catch (e) {
    counting.value = false
  }
}

async function onSubmit() {
  if (mode.value !== 'login' && form.password !== form.confirmPassword) {
    return Toast.error('两次输入的密码不一致')
  }
  
  loading.value = true
  try {
    let res
    if (mode.value === 'login') {
      res = await login({ email: form.email, password: form.password })
    } else if (mode.value === 'register') {
      res = await register({ email: form.email, password: form.password, code: form.code })
    } else {
      res = await resetPassword({ email: form.email, password: form.password, code: form.code })
      Toast.success('密码重置成功，请登录')
      switchMode('login')
      return
    }
    
    // 登录成功
    const token = res?.token || res?.access_token
    if (token) {
      setSession(token, res.user || { email: form.email })
      Toast.success('欢迎回来')
      router.replace('/')
    }
  } catch (e) {
    // 拦截器已提示
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f2fe 0%, #f3f4f6 100%);
  padding: 20px;
}
.auth-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}
.title {
  text-align: center;
  font-size: 28px;
  font-weight: 900;
  color: #1e3a8a;
  margin-bottom: 30px;
}
.title span { color: #3b82f6; font-size: 22px; }
.tabs {
  display: flex;
  margin-bottom: 30px;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 15px;
  font-weight: bold;
  color: #64748b;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.tab.active {
  background: #fff;
  color: #3b82f6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  background: #fff;
}
.field:focus { border-color: #3b82f6; }
.code-row { display: flex; gap: 10px; }
.btn-code {
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  white-space: nowrap;
}
.btn-submit {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  cursor: pointer;
}
.footer-links {
  margin-top: 20px;
  text-align: right;
  font-size: 13px;
  color: #64748b;
}
.footer-links span { cursor: pointer; }
</style>
