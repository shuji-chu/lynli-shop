<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg,#e0f2fe,#f8fafc);">
    <div style="width: 90%; max-width: 380px; background: #fff; padding: 40px 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <h2 style="text-align: center; font-size: 26px; font-weight: 900; color: #1e3a8a; margin-bottom: 30px;">LYNLI <span style="color: #3b82f6; font-size: 20px;">泠礼</span></h2>
      
      <div style="display: flex; border-bottom: 1px solid #f1f5f9; margin-bottom: 25px;">
        <div @click="mode='login'" :style="{flex:1,textAlign:'center',paddingBottom:'12px',color: mode==='login' ? '#3b82f6' : '#64748b', borderBottom: mode==='login' ? '2px solid #3b82f6' : 'none', cursor:'pointer', fontWeight: mode==='login'?'bold':'normal'}">登录</div>
        <div @click="mode='register'" :style="{flex:1,textAlign:'center',paddingBottom:'12px',color: mode==='register' ? '#3b82f6' : '#64748b', borderBottom: mode==='register' ? '2px solid #3b82f6' : 'none', cursor:'pointer', fontWeight: mode==='register'?'bold':'normal'}">注册</div>
      </div>

      <form @submit.prevent="submit" style="display:flex;flex-direction:column;gap:16px;">
        <input v-model="form.email" type="email" placeholder="请输入邮箱" required style="width:100%;padding:14px;border:1px solid #e2e8f0;border-radius:10px;outline:none;" />
        
        <input v-model="form.password" type="password" placeholder="密码" required style="width:100%;padding:14px;border:1px solid #e2e8f0;border-radius:10px;outline:none;" />

        <button type="submit" style="background:#3b82f6;color:#fff;border:none;padding:15px;border-radius:10px;font-size:16px;font-weight:bold;margin-top:10px;">
          {{ mode === 'login' ? '立即登录' : '注册并登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mode = ref('login')
const form = reactive({ email: '', password: '' })
const API = 'https://api.lynli.me'

async function submit() {
  try {
    let res
    if (mode.value === 'login') res = await fetch(API + '/api/v1/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    if (mode.value === 'register') res = await fetch(API + '/api/v1/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    })
    
    const data = await res.json()
    const token = data?.data?.token || data?.token || data?.access_token
    
    if (token) { 
      localStorage.setItem('token', token)
      // 🔥 核心：登录成功，直接去商城！ 
      router.push('/shop') 
    } else { 
      alert('登录失败，未获取到 token') 
    }
  } catch(e) { 
    alert('操作失败') 
  }
}
</script>
