<template>
  <div class="auth-page">
    <div class="auth-box">
      <h2 class="logo-title">LYNLI <span>泠礼</span></h2>
      
      <div class="tab-header">
        <div class="tab-item" :class="{ active: mode === 'login' }" @click="mode = 'login'">登录</div>
        <div class="tab-item" :class="{ active: mode === 'register' }" @click="mode = 'register'">注册</div>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <input v-model="form.email" type="email" placeholder="请输入邮箱地址" class="input-field" required />
        
        <!-- 登录时：可选密码登录/验证码登录，这里做最简单的密码登录 -->
        <input v-if="mode === 'login'" v-model="form.password" type="password" placeholder="请输入密码" class="input-field" required />

        <!-- 注册/找回密码时：验证码 + 密码 -->
        <template v-if="mode !== 'login'">
          <div class="code-box">
            <input v-model="form.code" type="text" placeholder="邮箱验证码" class="input-field code-input" required />
            <button type="button" class="btn-code" :disabled="counting" @click="sendCode">
              {{ counting ? countdown + 's' : '获取验证码' }}
            </button>
          </div>
          <input v-model="form.password" type="password" placeholder="设置密码" class="input-field" required />
          <input v-model="form.rePassword" type="password" placeholder="确认密码" class="input-field" required />
        </template>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? '处理中...' : (mode === 'login' ? '立即登录' : (mode === 'register' ? '注册并登录' : '重置密码')) }}
        </button>
      </form>

      <div class="auth-footer">
        <span v-if="mode === 'login'" class="link" @click="mode = 'reset'">忘记密码？</span>
        <span v-if="mode === 'reset'" class="link" @click="mode = 'login'">返回登录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()
const mode = ref('login') // login | register | reset
const loading = ref(false)
const counting = ref(false)
const countdown = ref(60)
let timer = null

const form = reactive({
  email: '',
  password: '',
  rePassword: '',
  code: ''
})

// 获取验证码
async function sendCode() {
  if (!form.email) return alert('请输入邮箱')
  counting.value = true
  try {
    await request.post('/api/v1/user/send_code', { email: form.email })
    alert('验证码已发送')
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        counting.value = false
      }
    }, 1000)
  } catch (e) {
    counting.value = false
    alert('发送失败，请稍后再试')
  }
}

// 提交表单
async function handleSubmit() {
  if (mode.value !== 'login' && form.password !== form.rePassword) {
    return alert('两次密码不一致')
  }

  loading.value = true
  try {
    let res
    if (mode.value === 'login') {
      res = await request.post('/api/v1/auth/login', { email: form.email, password: form.password })
    } else if (mode.value === 'register') {
      res = await request.post('/api/v1/auth/register', { email: form.email, password: form.password, code: form.code })
    } else if (mode.value === 'reset') {
      res = await request.post('/api/v1/auth/reset_password', { email: form.email, password: form.password, code: form.code })
      alert('密码重置成功，请重新登录')
      mode.value = 'login'
      return
    }

    // 登录/注册成功，保存 Token
    const token = res?.data?.token || res?.token
    if (token) {
      localStorage.setItem('token', token)
      router.push('/')
    } else {
      alert('未获取到凭证，请联系客服')
    }
  } catch (e) {
    alert(e.response?.data?.message || '操作失败，请检查账号密码')
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
  background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
}
.auth-box {
  width: 90%;
  max-width: 380px;
  background: #fff;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
.logo-title {
  text-align: center;
  font-size: 26px;
  font-weight: 900;
  color: #1e3a8a;
  margin-bottom: 30px;
}
.logo-title span { color: #3b82f6; font-size: 20px; }
.tab-header {
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 25px;
}
.tab-item {
  flex: 1;
  text-align: center;
  padding-bottom: 12px;
  font-size: 16px;
  color: #64748b;
  cursor: pointer;
}
.tab-item.active {
  color: #3b82f6;
  font-weight: bold;
  border-bottom: 2px solid #3b82f6;
}
.auth-form { display: flex; flex-direction: column; gap: 16px; }
.input-field {
  width: 100%;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
}
.input-field:focus { border-color: #3b82f6; }
.code-box { display: flex; gap: 10px; }
.code-input { flex: 1; }
.btn-code {
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 0 15px;
  white-space: nowrap;
}
.btn-submit {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}
.auth-footer {
  text-align: right;
  margin-top: 15px;
  font-size: 13px;
  color: #94a3b8;
}
.link { cursor: pointer; }
</style>
