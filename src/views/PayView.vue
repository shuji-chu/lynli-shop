<template>
  <div class="container pay">
    <div class="waiting panel">
      <div class="spinner"></div>
      <h2>正在等待支付</h2>
      <p>订单号：{{ tradeNo }}</p>
      <p class="hint">请完成支付，系统将自动跳转</p>
      <button class="btn-ghost sm" @click="cancel">放弃支付</button>
    </div>

    <PayModal
      v-model="showModal"
      :pay="pay"
      :amount="amount"
      @expired="onExpired"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PayModal from '@/components/PayModal.vue'
import { payOrder, queryOrder } from '@/api/order'
import { Toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const tradeNo = ref(route.query.trade_no || '')
const method = ref(route.query.method || 'alipay')
const pay = ref(null)
const amount = ref(0)
const showModal = ref(false)
let pollTimer = null

function stopPoll() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

async function init() {
  if (!tradeNo.value) {
    Toast.error('缺少订单号')
    router.replace('/')
    return
  }
  try {
    const res = await payOrder({ trade_no: tradeNo.value, method: method.value })
    pay.value = res || {}
    amount.value = Number(res?.amount) || 0
    showModal.value = true
    startPoll()
  } catch {
    /* 拦截器已提示 */
  }
}

function startPoll() {
  stopPoll()
  pollTimer = setInterval(async () => {
    try {
      const r = await queryOrder(tradeNo.value)
      const status = r?.status || r?.state
      const paid = r?.paid || status === 'paid' || status === 'success'
      if (paid) {
        stopPoll()
        Toast.success('支付成功')
        router.replace({ name: 'success', query: { trade_no: tradeNo.value } })
      } else if (status === 'closed' || status === 'expired') {
        stopPoll()
        Toast.error('订单已关闭，请重新下单')
      }
    } catch {
      /* 网络抖动忽略，下次继续轮询 */
    }
  }, 2500)
}

function onExpired() {
  stopPoll()
  Toast.error('支付凭证已过期，请返回重新发起支付')
}

function cancel() {
  stopPoll()
  router.replace('/orders')
}

onMounted(init)
onBeforeUnmount(stopPoll)
</script>

<style scoped>
.pay {
  display: flex;
  justify-content: center;
  padding-top: 50px;
}
.waiting {
  width: 100%;
  max-width: 360px;
  text-align: center;
  padding: 36px 24px;
}
.waiting h2 {
  font-size: 20px;
  margin: 18px 0 10px;
}
.waiting p {
  font-size: 13px;
  color: var(--text-3);
}
.waiting .hint {
  margin-top: 6px;
  color: var(--text-2);
}
.waiting .btn-ghost {
  margin-top: 20px;
}
.spinner {
  width: 42px;
  height: 42px;
  margin: 0 auto;
  border: 3px solid rgba(212, 175, 107, 0.2);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
