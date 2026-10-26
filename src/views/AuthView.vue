<template>
  <div class="login-container">
    <canvas id="canvas" resize></canvas>
    
    <div class="login-card">
      <h2 style="text-align: center; font-size: 26px; font-weight: 900; color: #1e3a8a; margin-bottom: 20px;">
        LYNLI <span style="color: #3b82f6; font-size: 20px;">泠礼</span>
      </h2>
      
      <div v-if="mode !== 'forget'" class="tab-header">
        <div @click="mode='login'" :class="['tab-item', mode === 'login' ? 'active' : '']">登录</div>
        <div @click="mode='register'" :class="['tab-item', mode === 'register' ? 'active' : '']">注册</div>
      </div>
      
      <h3 v-else style="text-align: center; color: #3b82f6; margin-bottom: 20px;">重置密码</h3>

      <form @submit.prevent="submit" class="form-body">
        <input v-model="form.email" type="email" placeholder="请输入邮箱" required class="input-field" />
        
        <div v-if="mode !== 'login'" class="code-group">
          <input v-model="form.emailCode" placeholder="6位邮箱验证码" maxlength="6" required class="input-field code-input" />
          <button type="button" @click="sendEmailCode" :disabled="counting" class="code-btn">
            {{ counting ? countdown + 's' : '获取验证码' }}
          </button>
        </div>

        <input v-model="form.password" type="password" :placeholder="mode === 'forget' ? '请输入新密码' : '密码'" required class="input-field" />

        <input v-if="mode === 'register'" v-model="form.rePassword" type="password" placeholder="确认密码" required class="input-field" />

        <div v-if="mode === 'login'" class="code-group">
          <input v-model="form.captcha" placeholder="4位图形码" maxlength="4" required class="input-field code-input" />
          <div @click="generateCaptcha" class="captcha-box">
            {{ captchaText }}
          </div>
        </div>

        <div v-if="mode === 'login'" class="remember-box">
          <input type="checkbox" v-model="rememberMe" id="remember" />
          <label for="remember">记住密码</label>
        </div>

        <button type="submit" class="submit-btn">
          {{ mode === 'login' ? '立即登录' : mode === 'register' ? '注册并登录' : '重置密码' }}
        </button>
      </form>

      <div class="bottom-links">
        <span v-if="mode === 'login'" @click="mode='forget'" class="forget-link">忘记密码？</span>
        <span v-if="mode === 'forget'" @click="mode='login'" class="return-link">返回登录</span>
        
        <span v-if="mode === 'login'" @click="mode='register'" class="register-link">还没有账号？立即注册</span>
        <span v-if="mode === 'register'" @click="mode='login'" class="login-link">已有账号？去登录</span>
      </div>
    </div>

    <div class="privacy-footer">
      登录即代表同意 
      <a @click.prevent="openModal('privacy')" href="#">《用户隐私协议》</a> 和 
      <a @click.prevent="openModal('terms')" href="#">《服务条款》</a>
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
const form = reactive({ email: '', password: '', rePassword: '', emailCode: '', captcha: '' })
const rememberMe = ref(false)

const API = 'https://api.lynli.me'
const counting = ref(false)
const countdown = ref(60)
const captchaText = ref('')

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
  
  const token = localStorage.getItem('token')
  if (token && token !== 'undefined' && token !== 'null') {
    router.replace('/shop')
  }
  
  const savedEmail = localStorage.getItem('saved_email')
  const savedPwd = localStorage.getItem('saved_pwd')
  if (savedEmail && savedPwd) {
    form.email = savedEmail
    form.password = savedPwd
    rememberMe.value = true
  }

  const canvas = document.getElementById('canvas')
  paperScope = new paper.PaperScope()
  paperScope.setup(canvas)
  
  const shapeGroup = new paper.Group()
  const positionArray = []
  
  const getCanvasBounds = () => {
    const canvasWidth = paperScope.view.size.width
    const canvasHeight = paperScope.view.size.height
    const canvasMiddleX = canvasWidth / 2
    const canvasMiddleY = canvasHeight / 2
    
    const position1 = { x: (canvasMiddleX / 2) + 100, y: 100 }
    const position2 = { x: 200, y: canvasMiddleY }
    const position3 = { x: (canvasMiddleX - 50) + (canvasMiddleX / 2), y: 150 }
    const position4 = { x: 0, y: canvasMiddleY + 100 }
    const position5 = { x: canvasWidth - 130, y: canvasHeight - 75 }
    const position6 = { x: canvasMiddleX + 80, y: canvasHeight - 50 }
    const position7 = { x: canvasWidth + 60, y: canvasMiddleY - 50 }
    const position8 = { x: canvasMiddleX + 100, y: canvasMiddleY + 100 }
    
    positionArray.push(position3, position2, position5, position4, position1, position6, position7, position8)
  }
  
  const initializeShapes = () => {
    getCanvasBounds()
    const shapePathData = [
      'M231,352l445-156L600,0L452,54L331,3L0,48L231,352',
      'M0,0l64,219L29,343l535,30L478,37l-133,4L0,0z',
      'M0,65l16,138l96,107l270-2L470,0L337,4L0,65z',
      'M333,0L0,94l64,219L29,437l570-151l-196-42L333,0',
      'M331.9,3.6l-331,45l231,304l445-156l-76-196l-148,54L331.9,3.6z',
      'M389,352l92-113l195-43l0,0l0,0L445,48l-80,1L122.7,0L0,275.2L162,297L389,352',
      'M 50 100 L 300 150 L 550 50 L 750 300 L 500 250 L 300 450 L 50 100',
      'M 700 350 L 500 350 L 700 500 L 400 400 L 200 450 L 250 350 L 100 300 L 150 50 L 350 100 L 250 150 L 450 150 L 400 50 L 550 150 L 350 250 L 650 150 L 650 50 L 700 150 L 600 250 L 750 250 L 650 300 L 700 350'
    ]
    
    for (let i = 0; i < shapePathData.length; i++) {
      const headerShape = new paper.Path({
        strokeColor: 'rgba(59, 130, 246, 0.3)',
        strokeWidth: 2,
        parent: shapeGroup
      })
      headerShape.pathData = shapePathData[i]
      headerShape.fullySelected = true
    }
  }
  
  initializeShapes()
  
  paperScope.view.onFrame = (event) => {
    for (let i = 0; i < shapeGroup.children.length; i++) {
      const item = shapeGroup.children[i]
      const position = positionArray[i]
      if (position) {
        item.position.x += (position.x - item.position.x) * 0.05
        item.position.y += (position.y - item.position.y) * 0.05
      }
    }
  }
})

onBeforeUnmount(() => {
  if (paperScope) {
    paperScope.remove()
  }
})

const sendEmailCode = async () => {
  if (!form.email) return alert('请先输入邮箱')
  counting.value = true
  countdown.value = 60
  
  try {
    const res = await fetch(API + '/api/v1/auth/send_code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email })
    })
    if (res.ok) {
      alert('验证码已发送，请查收邮箱')
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) { clearInterval(timer); counting.value = false }
      }, 1000)
    } else {
      counting.value = false
      alert('发送失败，请检查邮箱')
    }
  } catch (e) {
    counting.value = false
    alert('网络错误')
  }
}

const submit = async () => {
  if (mode.value === 'login' && form.captcha.toUpperCase() !== captchaText.value) {
    alert('图形验证码错误'); generateCaptcha(); form.captcha = ''; return
  }
  if (mode.value === 'register' && form.password !== form.rePassword) {
    return alert('两次输入的密码不一致')
  }

  try {
    let url = ''
    let body = {}

    if (mode.value === 'login') {
      url = API + '/api/v1/auth/login'
      body = { email: form.email, password: form.password }
    } else if (mode.value === 'register') {
      url = API + '/api/v1/auth/register'
      body = { email: form.email, password: form.password, code: form.emailCode }
    } else if (mode.value === 'forget') {
      url = API + '/api/v1/auth/reset_password'
      body = { email: form.email, password: form.password, code: form.emailCode }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    const data = await res.json()
    
    if (res.ok) {
      if (mode.value === 'forget') {
        alert('密码重置成功，请重新登录')
        mode.value = 'login'
        form.password = ''
        return
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

      const token = data?.data?.token || data?.token || data?.access_token
      const userInfo = data?.data?.user || data?.data?.userInfo || data?.user
      
      if (token) { 
        localStorage.setItem('token', token)
        if (userInfo) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
        router.push('/shop') 
      } else { 
        alert('接口未返回 Token') 
      }
    } else {
      alert(data.message || '操作失败，请检查输入')
    }
  } catch (e) { 
    alert('请求失败，请检查网络') 
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

#canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.login-card {
  width: 90%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  padding: 40px 30px 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(30, 58, 138, 0.1);
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.6);
  position: relative;
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 25px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding-bottom: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-item.active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
  font-weight: bold;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-field {
  width: 100%;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  background: #f8fafc;
  box-sizing: border-box;
}

.code-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.code-input {
  flex: 1;
}

.code-btn {
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 0 15px;
  font-size: 14px;
  height: 46px;
  cursor: pointer;
  white-space: nowrap;
}

.captcha-box {
  cursor: pointer;
  user-select: none;
  background: #e2e8f0;
  color: #1e3a8a;
  font-weight: bold;
  letter-spacing: 3px;
  padding: 12px 15px;
  border-radius: 10px;
  font-family: monospace;
  font-size: 18px;
  height: 46px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remember-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.submit-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: opacity 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}

.bottom-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
}

.forget-link, .return-link {
  color: #64748b;
  cursor: pointer;
}

.register-link, .login-link {
  color: #3b82f6;
  font-weight: bold;
  cursor: pointer;
}

.privacy-footer {
  margin-top: 30px;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  z-index: 10;
  position: relative;
}

.privacy-footer a {
  color: #3b82f6;
  text-decoration: none;
}
</style>
