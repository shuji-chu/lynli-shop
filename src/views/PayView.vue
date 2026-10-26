<template>
  <div class="pay-page">
    <div class="header"><button @click="$router.push('/orders')">←</button><h2>收银台</h2><div></div></div>
    
    <div class="content">
      <div class="amount-card">
        <p>需支付金额</p>
        <div class="price">¥{{ amount }}</div>
        <p class="trade-no">订单号：{{ tradeNo }}</p>
      </div>

      <div v-if="loading" class="loading-box">正在获取支付信息...</div>
      <div v-else-if="errorMsg" class="loading-box" style="color: #ef4444;">{{ errorMsg }}</div>

      <!-- 支付宝 -->
      <div class="pay-box" v-else-if="method === 'alipay' && payInfo">
        <h3>请使用支付宝扫码支付</h3>
        <div class="qr-placeholder">
          <!-- 后端如果返回了二维码或者支付链接，渲染在这里 -->
          <img v-if="payInfo.qrcode" :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${payInfo.qrcode}`" alt="支付宝二维码" />
          <div v-else style="padding: 20px;">请点击下方按钮跳转支付</div>
        </div>
        <a v-if="payInfo.payurl" :href="payInfo.payurl" class="done-btn" style="display:block; text-decoration:none; text-align:center; margin-bottom:10px;">跳转支付宝</a>
        <p class="tip">支付完成后请勿关闭页面，系统自动检测...</p>
      </div>

      <!-- USDT -->
      <div class="pay-box" v-else-if="method === 'usdt' && payInfo">
        <h3>USDT ({{ payInfo.network || 'TRC20' }}) 转账</h3>
        <div class="usdt-info">
          <p>需支付：<strong>{{ payInfo.usdt_amount }} USDT</strong></p>
          <p class="addr-text">{{ payInfo.address }}</p>
          <button class="copy-btn" @click="copyAddr(payInfo.address)">复制地址</button>
        </div>
        <div class="qr-placeholder">
          <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${payInfo.qrcode}`" alt="USDT二维码" />
        </div>
        <p class="tip">请务必使用 TRC20 网络转账，转账后请勿关闭页面，链上确认后自动发货...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from '@/utils/toast'
import request from '@/api/request'

const route = useRoute()
const router = useRouter()
const tradeNo = ref(route.query.trade_no)
const amount = ref(route.query.amount)
const method = ref(route.query.method || 'alipay')

const loading = ref(true)
const errorMsg = ref('')
const payInfo = ref(null)
let pollTimer = null

// 1. 发起支付请求
const fetchPayInfo = async () => {
  try {
    const res = await request.post('/api/v1/user/order/pay', {
      trade_no: tradeNo.value,
      method: method.value
    })
    
    // 后端格式：{ code: 1, data: { payurl, qrcode, usdt_amount, address... } }
    if (res.code === 1 && res.data) {
      payInfo.value = res.data
      startPolling() // 拿到支付参数后，开始轮询
    } else {
      errorMsg.value = res.msg || '获取支付信息失败'
    }
  } catch (e) {
    errorMsg.value = '网络异常，请刷新重试'
  } finally {
    loading.value = false
  }
}

// 2. 轮询查单
const checkStatus = async () => {
  if (!tradeNo.value) return
  try {
    const res = await request.get('/api/v1/user/order/query', {
      params: { trade_no: tradeNo.value }
    })
    // 后端格式：{ code: 1, data: { paid: true/false } }
    if (res.code === 1 && res.data && res.data.paid) {
      clearInterval(pollTimer)
      Toast.success('支付成功，系统已自动发货！')
      router.replace('/orders?tab=1') // 跳到待发货页面
    }
  } catch (e) {
    // 静默失败，不打扰用户
  }
}

const startPolling = () => {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(checkStatus, 3000) // 每 3 秒查一次
}

const copyAddr = (text) => {
  navigator.clipboard.writeText(text).then(() => Toast.success('地址已复制'))
}

onMounted(() => {
  if (!tradeNo.value) {
    Toast.error('订单号缺失')
    return router.replace('/shop')
  }
  fetchPayInfo()
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style scoped>
.pay-page { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 20px; }
.amount-card { background: #fff; border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
.amount-card p { color: #64748b; font-size: 14px; margin: 0 0 10px; }
.amount-card .price { font-size: 36px; font-weight: bold; color: #ff5000; margin-bottom: 10px; }
.trade-no { font-size: 12px; color: #94a3b8; }

.loading-box { text-align: center; padding: 40px; color: #64748b; font-size: 15px; }

.pay-box { background: #fff; border-radius: 16px; padding: 20px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
.pay-box h3 { font-size: 16px; margin: 0 0 20px; }
.qr-placeholder img { width: 200px; height: 200px; margin-bottom: 20px; border: 1px solid #eee; border-radius: 12px; padding: 10px; }
.tip { font-size: 12px; color: #64748b; margin-bottom: 10px; line-height: 1.5; }

.usdt-info { background: #f8fafc; border-radius: 8px; padding: 15px; margin-bottom: 20px; text-align: left; }
.usdt-info p { margin: 0 0 8px; font-size: 14px; }
.usdt-info strong { color: #10b981; font-size: 18px; }
.usdt-info .addr-text { font-family: monospace; color: #334155; word-break: break-all; background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; }
.copy-btn { background: #e2e8f0; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; width: 100%; margin-top: 5px; font-weight: bold; }
</style>
