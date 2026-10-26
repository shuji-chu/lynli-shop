<template>
  <div style="padding: 20px; max-width: 400px; margin: 0 auto; background: #fff; min-height: 100vh;">
    <h2 style="text-align: center; color: #3b82f6;">{{ isLogin ? 'LYNLI 泠礼 - 登录' : 'LYNLI 泠礼 - 注册' }}</h2>
    
    <div style="margin-top: 20px;">
      <input v-model="email" type="email" placeholder="请输入邮箱" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;" />
      
      <input v-model="password" type="password" placeholder="请输入密码" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;" />
      
      <button @click="submit" style="width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 5px; font-size: 16px;">
        {{ isLogin ? '登 录' : '注 册' }}
      </button>
    </div>

    <div style="text-align: center; margin-top: 15px; color: #3b82f6; cursor: pointer;" @click="isLogin = !isLogin">
      {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// 直接用原生 fetch，避免 axios 导致环境报错
// import axios from 'axios'

const router = useRouter()
const isLogin = ref(true)
const email = ref('')
const password = ref('')

const submit = async () => {
  if (!email.value || !password.value) return alert('请填写邮箱和密码')
  
  try {
    const url = isLogin.value 
      ? 'https://api.lynli.me/api/v1/auth/login' 
      : 'https://api.lynli.me/api/v1/auth/register'
      
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    
    const data = await res.json()
    
    if (res.ok) {
      const token = data?.data?.token || data?.token || data?.access_token
      if (token) {
        localStorage.setItem('token', token)
        alert('成功！')
        router.push('/')
      } else {
        alert('接口没返回 token')
      }
    } else {
      alert(data.message || '请求失败')
    }
  } catch (e) {
    alert('网络错误，请检查控制台')
  }
}
</script>
