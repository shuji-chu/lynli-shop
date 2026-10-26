<template>
  <div class="container auth">
    <div class="card panel">
      <router-link to="/" class="back">← 返回</router-link>
      <h2 class="title gold-text">LYNLI 微澜</h2>
      <p class="sub">邮箱验证码登录 / 注册</p>

      <div class="tabs">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">
          登录
        </button>
        <button :class="{ active: mode === 'register' }" @click="mode = 'register'">
          注册
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="form">
        <input
          v-model.trim="form.email"
          class="field"
          type="email"
          placeholder="请输入邮箱"
          autocomplete="email"
        />
        <div class="code-row">
          <input
            v-model.trim="form.code"
            class="field"
            placeholder="邮箱验证码"
            inputmode="numeric"
          />
          <button
            type="button"
            class="btn-ghost sm"
            :disabled="sending || countdown > 0"
            @click="onSend"
          >
            {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
          </button>
        </div>
        <button class="btn-gold" type="submit" :disabled="submitting">
          {{ submitting ? '处理中…' : mode === 'login' ? '登录' : '注册并登录' }}
        </button>
      </form>

      <p class="tip">登录即表示同意《用户协议》与《隐私政策》</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sendCode, login, register } from '@/api/auth'
import { setSession } from '@/store/user'
import { Toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const mode = ref('login')
const form = reactive({ email: '', code: '' })
const sending = ref(false)
const submitting = ref(false)
const countdown = ref(0)
let timer = null

const emailValid = computed(() => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))

function startCountdown() {
  clearInterval(timer)
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function onSend() {
  if (!emailValid.value) {
    Toast.error('请输入正确的邮箱地址')
    return
  }
  sending.value = true
  try {
    await sendCode(form.email)
    Toast.success('验证码已发送，请查收邮箱')
    startCountdown()
  } catch {
    /* 拦截器已提示 */
  } finally {
    sending.value = false
  }
}

async function onSubmit() {
  if (!emailValid.value) {
    Toast.error('请输入正确的邮箱地址')
    return
  }
  if (!form.code) {
    Toast.error('请输入验证码')
    return
  }
  submitting.value = true
  try {
    const api = mode.value === 'login' ? login : register
    const res = await api({ email: form.email, code: form.code })
    const token = res?.token || res?.access_token
    if (!token) {
      Toast.error('操作失败：未返回登录凭证')
      return
    }
    const info = res?.user || res?.info || { email: form.email }
    setSession(token, info)
    Toast.success('登录成功')
    const redirect = route.query.redirect || '/'
    router.replace(redirect)
  } catch {
    /* 拦截器已提示 */
  } finally {
    submitting.value = false
  }
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.auth {
  display: flex;
  justify-content: center;
  padding-top: 40px;
}
.card {
  width: 100%;
  max-width: 400px;
  padding: 32px 26px;
  text-align: center;
}
.back {
  display: inline-block;
  font-size: 13px;
  color: var(--text-3);
  margin-bottom: 14px;
}
.back:hover {
  color: var(--gold);
}
.title {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 1px;
}
.sub {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-2);
}
.tabs {
  display: flex;
  gap: 8px;
  margin: 24px 0 20px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 4px;
}
.tabs button {
  flex: 1;
  padding: 10px;
  border-radius: 9px;
  font-size: 15px;
  color: var(--text-2);
  transition: all 0.2s;
}
.tabs button.active {
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  color: #1a1206;
  font-weight: 600;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.code-row {
  display: flex;
  gap: 10px;
}
.code-row .field {
  flex: 1;
}
.btn-ghost.sm {
  padding: 0 14px;
  font-size: 13px;
  white-space: nowrap;
}
.btn-gold {
  margin-top: 6px;
  padding: 14px;
}
.tip {
  margin-top: 18px;
  font-size: 12px;
  color: var(--text-3);
}
</style>
