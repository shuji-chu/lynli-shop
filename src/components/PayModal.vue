<template>
  <transition name="modal">
    <div v-if="modelValue" class="mask" @click.self="close">
      <div class="dialog panel">
        <button class="x" @click="close" aria-label="关闭">×</button>

        <template v-if="pay && pay.method === 'alipay'">
          <h3 class="mt">支付宝扫码支付</h3>
          <div class="qr">
            <img v-if="pay.qr_url" :src="pay.qr_url" alt="支付宝二维码" />
            <img v-else-if="qrData" :src="qrData" alt="支付宝二维码" />
            <div v-else class="skeleton qr-skel"></div>
          </div>
          <p class="hint">请使用支付宝「扫一扫」完成支付</p>
        </template>

        <template v-else-if="pay && pay.method === 'usdt'">
          <h3 class="mt">USDT 加密货币支付</h3>
          <p class="net">网络：{{ pay.network || 'TRC20' }}</p>
          <div class="addr">
            <code>{{ pay.address }}</code>
            <button class="copy" @click="copy(pay.address)">复制</button>
          </div>
          <p class="hint">请向以上地址充值 <b>{{ formatPrice(amount) }}</b> 对应金额，到账后自动确认</p>
        </template>

        <template v-else-if="pay && pay.method === 'wechat'">
          <h3 class="mt">微信支付</h3>
          <div class="coming">
            <p class="coming-title">即将开通</p>
            <p class="hint">微信支付通道正在接入中，当前可使用支付宝或 USDT 完成支付。</p>
          </div>
        </template>

        <p v-if="amount" class="amount">{{ formatPrice(amount) }}</p>
        <p v-if="countdown > 0" class="expire">支付凭证有效期 {{ countdown }}s</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import QRCode from 'qrcode'
import { formatPrice } from '@/utils/format'
import { Toast } from '@/utils/toast'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  pay: { type: Object, default: null },
  amount: { type: Number, default: 0 }
})
const emit = defineEmits(['update:modelValue', 'expired'])

const qrData = ref('')
const countdown = ref(0)
let timer = null

watch(
  () => props.pay,
  async (p) => {
    qrData.value = ''
    if (p && p.method === 'alipay' && p.pay_url && !p.qr_url) {
      try {
        qrData.value = await QRCode.toDataURL(p.pay_url, { width: 240, margin: 1 })
      } catch {
        qrData.value = ''
      }
    }
    startCountdown(p?.expire_at)
  },
  { immediate: true }
)

function startCountdown(expireAt) {
  clearInterval(timer)
  if (!expireAt) {
    countdown.value = 0
    return
  }
  const tick = () => {
    const left = Math.max(0, Math.floor((expireAt * 1000 - Date.now()) / 1000))
    countdown.value = left
    if (left <= 0) {
      clearInterval(timer)
      emit('expired')
    }
  }
  tick()
  timer = setInterval(tick, 1000)
}

function close() {
  emit('update:modelValue', false)
}

async function copy(text) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    Toast.success('已复制充值地址')
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      Toast.success('已复制充值地址')
    } catch {
      Toast.error('复制失败，请长按手动复制')
    }
    document.body.removeChild(ta)
  }
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 20px;
}
.dialog {
  position: relative;
  width: 100%;
  max-width: 340px;
  padding: 28px 24px 24px;
  text-align: center;
  border-color: var(--border-strong);
}
.x {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 24px;
  line-height: 1;
  color: var(--text-3);
}
.x:hover {
  color: var(--text-1);
}
.mt {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 18px;
}
.qr {
  width: 220px;
  height: 220px;
  margin: 0 auto 16px;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.qr-skel {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
.hint {
  font-size: 13px;
  color: var(--text-2);
  margin-bottom: 8px;
}
.net {
  font-size: 13px;
  color: var(--gold);
  margin-bottom: 12px;
}
.addr {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 14px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
}
.addr code {
  flex: 1;
  font-size: 12px;
  word-break: break-all;
  text-align: left;
  color: var(--gold-bright);
}
.copy {
  flex: 0 0 auto;
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 13px;
  color: #fff;
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  font-weight: 600;
}
.amount {
  font-size: 22px;
  font-weight: 700;
  color: var(--gold-bright);
  margin-top: 6px;
}
.coming {
  padding: 18px 0 6px;
}
.coming-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 10px;
}
.expire {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-3);
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.28s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .dialog,
.modal-leave-active .dialog {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from .dialog,
.modal-leave-to .dialog {
  transform: scale(0.92) translateY(10px);
}
</style>
