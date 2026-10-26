<template>
  <div class="login-container">
    <canvas id="canvas" resize></canvas>
    
    <div class="login-card">
      <h2 style="text-align: center; font-size: 26px; font-weight: 900; color: #1e3a8a; margin-bottom: 30px;">
        LYNLI <span style="color: #3b82f6; font-size: 20px;">泠礼</span>
      </h2>
      
      <!-- ================= 登录模式 ================= -->
      <form v-if="mode === 'login'" @submit.prevent="submit" class="form-body">
        <input v-model="form.email" type="email" placeholder="请输入邮箱" required class="input-field" />
        <input v-model="form.password" type="password" placeholder="请输入密码" required class="input-field" />

        <div class="code-group">
          <input v-model="form.captcha" placeholder="4位图形码" maxlength="4" required class="input-field code-input" />
          <div @click="generateCaptcha" class="captcha-box">{{ captchaText }}</div>
        </div>

        <div class="remember-box">
          <input type="checkbox" v-model="rememberMe" id="remember" />
          <label for="remember">记住密码</label>
        </div>

        <button type="submit" class="submit-btn">立即登录</button>

        <div class="bottom-links">
          <span @click="mode = 'forget'" class="link-gray">忘记密码？</span>
          <span @click="mode = 'register'" class="link-blue">没有账号？立即注册</span>
        </div>
      </form>

      <!-- ================= 注册模式 ================= -->
      <form v-else-if="mode === 'register'" @submit.prevent="submit" class="form-body">
        <input v-model="form.email" type="email" placeholder="请输入邮箱" required class="input-field" />
        
        <div class="code-group">
          <input v-model="form.emailCode" placeholder="6位邮箱验证码" maxlength="6" required class="input-field code-input" />
          <button type="button" @click="sendEmailCode" :disabled="counting" class="code-btn">
            {{ counting ? countdown + 's' : '获取验证码' }}
          </button>
        </div>

        <input v-model="form.nickname" placeholder="请输入昵称" required class="input-field" />
        <input v-model="form.password" type="password" placeholder="设置密码" required class="input-field" />
        <input v-model="form.rePassword" type="password" placeholder="确认密码" required class="input-field" />

        <div class="remember-box" style="margin-bottom: 5px;">
          <input type="checkbox" v-model="agreePrivacy" id="agree" />
          <label for="agree">
            我已阅读并同意 <a @click.prevent="openModal('privacy')" href="#">《隐私协议》</a> 和 <a @click.prevent="openModal('terms')" href="#">《服务条款》</a>
          </label>
        </div>

        <button type="submit" class="submit-btn">注册并登录</button>

        <div class="bottom-links" style="justify-content: flex-end;">
          <span @click="mode = 'login'" class="link-blue">已有账号？去登录</span>
        </div>
      </form>

      <div class="privacy-footer">
        登录即代表同意 <a @click.prevent="openModal('privacy')" href="#">《用户隐私协议》</a> 和 <a @click.prevent="openModal('terms')" href="#">《服务条款》</a>
      </div>

    </div>

    <div v-if="toast.show" class="custom-toast" :class="toast.type">
      {{ toast.message }}
    </div>

    <PrivacyModal :show="showModal" :type="modalType" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import PrivacyModal from '@/components/PrivacyModal.vue'
import paper from 'paper'

const router = useRouter()
const mode = ref('login') 

const form = reactive({ email: '', password: '', rePassword: '', nickname: '', emailCode: '', captcha: '' })
const rememberMe = ref(false)
const agreePrivacy = ref(false)

const API = 'https://api.lynli.me'
const counting = ref(false)
const countdown = ref(60)
const captchaText = ref('')

const toast = reactive({ show: false, message: '', type: 'error' })
let toastTimer = null
const showToast = (msg, type = 'error') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.show = false }, 3000)
}

const showModal = ref(false)
const modalType = ref('privacy')
const openModal = (type) => {
  modalType.value = type
  showModal.value = true
}

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZ23456789'
  let res = ''
  for (let i = 0; i < 4; i++) {
    res += chars[Math.floor(Math.random() * chars.length)]
  }
  captchaText.value = res
}

let paperScope = null
onMounted(() => {
  generateCaptcha()
  
  // 自动登录判断
  const token = localStorage.getItem('token')
  if (token && token !== 'undefined' && token !== 'null') {
    router.replace('/shop')
  }
  
  // 记住密码回填
  const savedEmail = localStorage.getItem('saved_email')
  const savedPwd = localStorage.getItem('saved_pwd')
  if (savedEmail && savedPwd) {
    form.email = savedEmail
    form.password = savedPwd
    rememberMe.value = true
  }

  // 动画初始化...
  const canvas = document.getElementById('canvas')
  if(canvas) {
    paperScope = new paper.PaperScope()
    paperScope.setup(canvas)
    // 简化动画代码防报错
    paperScope.view.onFrame = () => {}
  }
})

onBeforeUnmount(() => {
  if (paperScope) paperScope.remove()
  clearTimeout(toastTimer)
})

const sendEmailCode = async () => {
  if (!form.email) return showToast('请先输入邮箱')
  counting.value = true
  countdown.value = 60
  
  try {
    const res = await fetch(API + '/api/v1/passport/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email })
    })
    if (res.ok) {
      showToast('验证码已发送，请查收邮箱', 'success')
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) { clearInterval(timer); counting.value = false }
      }, 1000)
    } else {
      counting.value = false
      showToast('发送失败，请检查邮箱')
    }
  } catch (e) {
    counting.value = false
    showToast('网络错误')
  }
}

const submit = async () => {
  if (mode.value === 'login' && form.captcha.toUpperCase() !== captchaText.value) {
    showToast('图形验证码错误'); generateCaptcha(); form.captcha = ''; return
  }
  
  if (mode.value === 'register') {
    if (form.password !== form.rePassword) return showToast('两次输入的密码不一致')
    if (!agreePrivacy.value) return showToast('请先阅读并勾选用户隐私协议')
  }

  try {
    let url = ''
    let body = {}

    if (mode.value === 'login') {
      url = API + '/api/v1/passport/auth/login'
      body = { email: form.email, password: form.password }
    } else if (mode.value === 'register') {
      url = API + '/api/v1/passport/auth/register'
      body = { email: form.email, password: form.password, nickname: form.nickname, code: form.emailCode }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    const data = await res.json()
    
    if (res.ok) {
      const token = data?.data?.token || data?.token || data?.access_token
      const userInfo = data?.data?.user || data?.user || data?.data?.userInfo
      
      if (token) { 
        localStorage.setItem('token', token)
        if (userInfo) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
        
        if (mode.value === 'login') {
          if (rememberMe.value) {
            localStorage.setItem('saved_email', form.email)
            localStorage.setItem('saved_pwd', form.password)
          } else {
            localStorage.removeItem('saved_email')
            localStorage.removeItem('saved_pwd')
          }
        }
        
        showToast('登录成功，正在跳转...', 'success')
        
        // 🚨 核心大招：强制整页刷新，彻底消灭状态不同步！
        window.location.href = '/shop'
        
      } else { 
        showToast('接口未返回 Token') 
      }
    } else {
      showToast(data.message || '操作失败，请检查输入')
    }
  } catch (e) { 
    showToast('请求失败，请检查网络') 
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f7ff;
  overflow: hidden;
}
#canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
.login-card {
  width: 90%; max-width: 380px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px);
  padding: 40px 30px 20px; border-radius: 20px; box-shadow: 0 20px 40px rgba(30, 58, 138, 0.1);
  z-index: 10; border: 1px solid rgba(255, 255, 255, 0.6); position: relative;
}
.form-body { display: flex; flex-direction: column; gap: 16px; }
.input-field { width: 100%; padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; background: #f8fafc; box-sizing: border-box; font-size: 15px; }
.code-group { display: flex; gap: 10px; align-items: center; }
.code-input { flex: 1; }
.code-btn { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; border-radius: 10px; padding: 0 15px; font-size: 14px; height: 48px; cursor: pointer; white-space: nowrap; }
.captcha-box { cursor: pointer; user-select: none; background: #e2e8f0; color: #1e3a8a; font-weight: bold; letter-spacing: 3px; padding: 12px 15px; border-radius: 10px; font-family: monospace; font-size: 18px; height: 48px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
.remember-box { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #64748b; }
.remember-box a { color: #3b82f6; text-decoration: none; }
.submit-btn { background: #3b82f6; color: #fff; border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: bold; margin-top: 10px; cursor: pointer; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
.bottom-links { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 14px; }
.link-gray { color: #64748b; cursor: pointer; }
.link-blue { color: #3b82f6; font-weight: bold; cursor: pointer; }
.privacy-footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 25px; padding-top: 15px; border-top: 1px dashed #e2e8f0; }
.privacy-footer a { color: #3b82f6; text-decoration: none; }
.custom-toast { position: fixed; top: 40px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 8px; font-size: 14px; color: #fff; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 80%; text-align: center; word-break: break-all; animation: slideDown 0.3s ease-out; }
.custom-toast.error { background: rgba(239, 68, 68, 0.95); }
.custom-toast.success { background: rgba(34, 197, 94, 0.95); }
@keyframes slideDown { from { top: -50px; opacity: 0; } to { top: 40px; opacity: 1; } }
</style>
