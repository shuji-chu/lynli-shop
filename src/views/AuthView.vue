<template>
  <!-- 纯代码生成的动态曲线背景 -->
  <div class="login-wrapper">
    
    <!-- 🎨 底层：模拟女性曼妙曲线的流动光影（纯CSS，0秒加载） -->
    <div class="dynamic-curves">
      <div class="curve waist-curve"></div>
      <div class="curve hip-curve"></div>
      <div class="light-glow"></div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <h2 style="text-align: center; font-size: 26px; font-weight: 900; color: #1e3a8a; margin-bottom: 20px;">LYNLI <span style="color: #3b82f6; font-size: 20px;">泠礼</span></h2>
      
      <!-- 顶部 Tab -->
      <div v-if="mode !== 'forget'" style="display: flex; border-bottom: 1px solid #f1f5f9; margin-bottom: 25px;">
        <div @click="mode='login'" :style="{flex:1,textAlign:'center',paddingBottom:'12px',color: mode==='login' ? '#3b82f6' : '#64748b', borderBottom: mode==='login' ? '2px solid #3b82f6' : 'none', cursor:'pointer', fontWeight: mode==='login'?'bold':'normal'}">登录</div>
        <div @click="mode='register'" :style="{flex:1,textAlign:'center',paddingBottom:'12px',color: mode==='register' ? '#3b82f6' : '#64748b', borderBottom: mode==='register' ? '2px solid #3b82f6' : 'none', cursor:'pointer', fontWeight: mode==='register'?'bold':'normal'}">注册</div>
      </div>
      
      <h3 v-else style="text-align: center; color: #3b82f6; margin-bottom: 20px;">重置密码</h3>

      <form @submit.prevent="submit" style="display:flex;flex-direction:column;gap:16px;">
        <input v-model="form.email" type="email" placeholder="请输入邮箱" required style="width:100%;padding:14px;border:1px solid #e2e8f0;border-radius:10px;outline:none; background:#f8fafc;" />
        
        <div v-if="mode !== 'login'" style="display: flex; gap: 10px;">
          <input v-model="form.emailCode" placeholder="6位邮箱验证码" maxlength="6" required style="flex:1;padding:14px;border:1px solid #e2e8f0;border-radius:10px;outline:none; background:#f8fafc;" />
          <button type="button" @click="sendEmailCode" :disabled="counting" style="background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;border-radius:10px;padding:0 15px; font-size:14px;">
            {{ counting ? countdown + 's' : '获取验证码' }}
          </button>
        </div>

        <input v-model="form.password" type="password" :placeholder="mode === 'forget' ? '请输入新密码' : '密码'" required style="width:100%;padding:14px;border:1px solid #e2e8f0;border-radius:10px;outline:none; background:#f8fafc;" />

        <input v-if="mode === 'register'" v-model="form.rePassword" type="password" placeholder="确认密码" required style="width:100%;padding:14px;border:1px solid #e2e8f0;border-radius:10px;outline:none; background:#f8fafc;" />

        <div v-if="mode === 'login'" style="display: flex; gap: 10px; align-items: center;">
          <input v-model="form.captcha" placeholder="4位图形码" maxlength="4" required style="flex:1;padding:14px;border:1px solid #e2e8f0;border-radius:10px;outline:none; background:#f8fafc;" />
          <div @click="generateCaptcha" style="cursor:pointer; user-select:none; background:#e2e8f0; color:#1e3a8a; font-weight:bold; letter-spacing:3px; padding:12px 15px; border-radius:10px; font-family:monospace; font-size:18px;">
            {{ captchaText }}
          </div>
        </div>

        <!-- 记住密码 -->
        <div v-if="mode === 'login'" style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #64748b;">
          <input type="checkbox" v-model="rememberMe" id="remember" style="cursor: pointer;" />
          <label for="remember" style="cursor: pointer;">记住密码</label>
        </div>

        <button type="submit" style="background:#3b82f6;color:#fff;border:none;padding:15px;border-radius:10px;font-size:16px;font-weight:bold;margin-top:10px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
          {{ mode === 'login' ? '立即登录' : mode === 'register' ? '注册并登录' : '重置密码' }}
        </button>
      </form>

      <!-- 底部操作区 -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; font-size:14px;">
        <span v-if="mode === 'login'" @click="mode='forget'" style="cursor:pointer; color:#64748b;">忘记密码？</span>
        <span v-if="mode === 'forget'" @click="mode='login'" style="cursor:pointer; color:#3b82f6;">返回登录</span>
        
        <span v-if="mode === 'login'" @click="mode='register'" style="cursor:pointer; color:#3b82f6; font-weight:bold;">还没有账号？立即注册</span>
        <span v-if="mode === 'register'" @click="mode='login'" style="cursor:pointer; color:#3b82f6; font-weight:bold;">已有账号？去登录</span>
      </div>
    </div>

    <!-- 底部隐私协议 -->
    <div style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center; z-index: 10; position: relative;">
      登录即代表同意 
      <a @click.prevent="openModal('privacy')" href="#" style="color:#3b82f6; text-decoration:none;">《用户隐私协议》</a> 和 
      <a @click.prevent="openModal('terms')" href="#" style="color:#3b82f6; text-decoration:none;">《服务条款》</a>
    </div>

    <!-- 引入弹窗组件 -->
    <PrivacyModal :show="showModal" :type="modalType" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PrivacyModal from '@/components/PrivacyModal.vue'

const router = useRouter()
const mode = ref('login')
const form = reactive({ email: '', password: '', rePassword: '', emailCode: '', captcha: '' })
const rememberMe = ref(false)

const API = 'https://api.lynli.me'
const counting = ref(false)
const countdown = ref(60)
const captchaText = ref('')

// 弹窗控制
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
/* 整体背景：高端蓝白渐变 */
.login-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
  overflow: hidden;
}

/* 动态曲线容器 */
.dynamic-curves {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

/* 核心曲线光效 */
.curve {
  position: absolute;
  filter: blur(60px);
  opacity: 0.7;
}

/* 模拟女性腰部的优美曲线 */
.waist-curve {
  width: 800px;
  height: 600px;
  background: linear-gradient(120deg, #93c5fd 0%, #3b82f6 100%);
  top: -10%;
  left: -20%;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  animation: dance 8s infinite alternate ease-in-out;
}

/* 模拟女性胯部/腿部的圆润曲线 */
.hip-curve {
  width: 700px;
  height: 800px;
  background: linear-gradient(300deg, #bfdbfe 0%, #1e3a8a 100%);
  bottom: -20%;
  right: -10%;
  border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
  animation: dance 10s infinite alternate-reverse ease-in-out;
}

/* 呼吸感的高光点 */
.light-glow {
  position: absolute;
  width: 400px;
  height: 400px;
  background: #ffffff;
  border-radius: 50%;
  filter: blur(80px);
  top: 20%;
  left: 30%;
  opacity: 0.6;
  animation: float 6s infinite alternate ease-in-out;
}

/* 登录卡片：高级毛玻璃 */
.login-card {
  width: 90%;
  max-width: 380px;
  background: rgba(255, 255, 255, 0.85); 
  backdrop-filter: blur(20px); 
  padding: 40px 30px 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(30, 58, 138, 0.1);
  z-index: 10;
  border: 1px solid rgba(255,255,255,0.9);
}

/* 动画：呼吸与舞动 */
@keyframes dance {
  0% { transform: translate(0, 0) scale(1) rotate(0deg); }
  100% { transform: translate(30px, 20px) scale(1.1) rotate(10deg); }
}

@keyframes float {
  0% { transform: translateY(0); }
  100% { transform: translateY(30px); }
}
</style>
