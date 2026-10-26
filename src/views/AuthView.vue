<template>
  <div class="container auth">
    <div class="card panel">
      <h2 class="title gold-text">LYNLI 泠礼</h2>
      <p class="sub">邮箱验证码快捷登录 / 注册</p>

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
          <button type="button" class="btn-ghost sm" :disabled="sending || countdown > 0" @click="onSend">
            {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
          </button>
        </div>

        <button type="submit" class="btn-gold" :disabled="submitting">
          {{ submitting ? '处理中...' : '立即登录 / 注册' }}
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
    // 逻辑合并：先尝试登录，如果失败（未注册），则自动注册
    let res
    try {
      res = await login({ email: form.email, code: form.code })
    } catch (e) {
      // 如果后端返回未注册，则去注册
      res = await register({ email: form.email, code: form.code })
    }
    
    const token = res?.token || res?.access_token
    if (!token) {
      Toast.error('操作失败：未返回登录凭证')
      return
    }
    const info = res?.user || res?.info || { email: form.email }
    setSession(token, info)
    Toast.success('操作成功')
    const redirect = route.query.redirect || '/'
    router.replace(redirect)
  } catch {
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
.title {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #3b82f6;
}
.sub {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-2);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 24px;
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
  background: #3b82f6;
  color: white;
  border-radius: 12px;
  border: none;
}
.tip {
  margin-top: 18px;
  font-size: 12px;
  color: var(--text-3);
}
</style>
