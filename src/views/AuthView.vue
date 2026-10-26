<template>
  <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg,#e0f2fe,#f8fafc);">
    
    <!-- 登录/注册卡片 -->
    <div style="width: 90%; max-width: 380px; background: #fff; padding: 40px 30px 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      
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

        <button type="submit" style="background:#3b82f6;color:#fff;border:none;padding:15px;border-radius:10px;font-size:16px;font-weight:bold;margin-top:10px;">
          {{ mode === 'login' ? '立即登录' : mode === 'register' ? '注册并登录' : '重置密码' }}
        </button>
      </form>

      <!-- 底部操作区：左边忘记密码，右边立即注册 -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; font-size:14px;">
        <!-- 左边 -->
        <span v-if="mode === 'login'" @click="mode='forget'" style="cursor:pointer; color:#64748b;">忘记密码？</span>
        <span v-if="mode === 'forget'" @click="mode='login'" style="cursor:pointer; color:#3b82f6;">返回登录</span>
        
        <!-- 右边 -->
        <span v-if="mode === 'login'" @click="mode='register'" style="cursor:pointer; color:#3b82f6; font-weight:bold;">还没有账号？立即注册</span>
        <span v-if="mode === 'register'" @click="mode='login'" style="cursor:pointer; color:#3b82f6; font-weight:bold;">已有账号？去登录</span>
      </div>

    </div>

    <div style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
      登录即代表同意 <a href="#" style="color:#3b82f6; text-decoration:none;">《用户隐私协议》</a> 和 <a href="#" style="color:#3b82f6; text-decoration:none;">《服务条款》</a>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mode = ref('login')
const form = reactive({ email: '', password: '', rePassword: '', emailCode: '', captcha: '' })

const API = 'https://api.lynli.me'
const counting = ref(false)
const countdown = ref(60)
const captchaText = ref('')

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZ23456789'
  let res = ''
  for (let i = 0; i < 4; i++) {
    res += chars[Math.floor(Math.random() * chars.length)]
  }
  captchaText.value = res
}
onMounted(() => generateCaptcha())

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
      
      const token = data?.data?.token || data?.token || data?.access_token
      if (token) { 
        localStorage.setItem('token', token)
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
