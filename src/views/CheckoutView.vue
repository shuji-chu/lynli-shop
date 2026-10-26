<template>
  <div class="checkout-page">
    <div class="header">
      <button @click="$router.back()" class="back-btn">←</button>
      <h2>确认订单</h2>
      <div></div>
    </div>

    <!-- 配送方式 -->
    <div class="section">
      <h3>配送方式</h3>
      <div class="delivery-options">
        <div class="option" :class="{ active: form.deliveryType === 1 }" @click="form.deliveryType = 1">
          <span class="icon">📦</span>
          <span class="name">普通快递</span>
          <span class="desc">顺丰包邮 / 2-3天送达</span>
        </div>
        <div class="option" :class="{ active: form.deliveryType === 2 }" @click="form.deliveryType = 2">
          <span class="icon">🛵</span>
          <span class="name">同城急送</span>
          <span class="desc">1小时达 / 隐私防护</span>
        </div>
      </div>
    </div>

    <!-- 收货信息 (改为点击选择) -->
    <div class="section">
      <h3>收货信息</h3>
      
      <!-- 🚨 选好地址后展示这个卡片 -->
      <div v-if="selectedAddress" class="address-card" @click="goSelectAddress">
        <div class="addr-name-row">
          <span class="name">{{ selectedAddress.name }}</span>
          <span class="phone">{{ selectedAddress.phone }}</span>
          <span class="tag" v-if="selectedAddress.is_default == 1">默认</span>
        </div>
        <div class="addr-detail">{{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.district }} {{ selectedAddress.detail }}</div>
        <div class="arrow">></div>
      </div>

      <!-- 没选地址时展示这个 -->
      <div v-else class="no-address" @click="goSelectAddress">
        <span>+ 点击选择收货地址</span>
      </div>

      <!-- 同城专属：期望送达时间 -->
      <div v-if="form.deliveryType === 2" class="time-picker">
        <label>期望送达时间：</label>
        <select v-model="form.expectTime">
          <option value="尽快送达">尽快送达</option>
          <option value="1小时内">1小时内</option>
          <option value="2小时内">2小时内</option>
          <option value="晚间送达">晚间送达</option>
        </select>
      </div>
    </div>

    <!-- 商品清单 -->
    <div class="section">
      <h3>商品清单</h3>
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" alt="" />
        <div class="item-info">
          <p class="title">{{ item.title }}</p>
          <p class="qty">x{{ item.qty }}</p>
        </div>
        <p class="price">¥{{ item.price }}</p>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="bottom-bar">
      <div class="total">
        合计：<span class="price">¥{{ totalPrice }}</span>
      </div>
      <button class="submit-btn" @click="submitOrder">提交订单</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { cart } from '@/store/cart'
import { Toast } from '@/utils/toast'
import { createOrder } from '@/api/order'

const router = useRouter()
const cartItems = computed(() => cart.items.filter(i => i.selected !== false))
const selectedAddress = ref(null)

const form = ref({
  deliveryType: 1,
  expectTime: '尽快送达'
})

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)
})

// 每次进入页面读取选中的地址
const loadSelectedAddress = () => {
  const addr = localStorage.getItem('selected_address')
  if (addr) {
    selectedAddress.value = JSON.parse(addr)
  }
}

onMounted(() => {
  loadSelectedAddress()
})

onActivated(() => {
  loadSelectedAddress()
})

const goSelectAddress = () => {
  router.push('/address?mode=select')
}

async function submitOrder() {
  if (!selectedAddress.value) {
    return Toast.error('请选择收货地址')
  }
  if (cartItems.value.length === 0) return Toast.error('购物车为空')

  const payload = {
    items: cartItems.value.map(i => ({ id: i.id, qty: i.qty, price: i.price })),
    amount: Number(totalPrice.value),
    receiver_name: selectedAddress.value.name,
    receiver_phone: selectedAddress.value.phone,
    receiver_address: `${selectedAddress.value.province}${selectedAddress.value.city}${selectedAddress.value.district}${selectedAddress.value.detail}`,
    delivery_type: form.value.deliveryType,
    expect_time: form.value.deliveryType === 2 ? form.value.expectTime : ''
  }

  try {
    const res = await createOrder(payload)
    const tradeNo = res.data?.trade_no || res.trade_no
    if (tradeNo) {
      Toast.success('下单成功')
      localStorage.removeItem('selected_address') // 清空选中的地址
      router.push('/orders')
    } else {
      Toast.error('下单失败')
    }
  } catch (e) {
    Toast.error(e.message || '网络错误')
  }
}
</script>

<style scoped>
.checkout-page { min-height: 100vh; background: #f4f4f4; padding: 60px 16px 80px; }
.header { position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 100; }
.back-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
.header h2 { font-size: 18px; margin: 0; font-weight: bold; }

.section { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.section h3 { font-size: 15px; margin: 0 0 12px; color: #1e293b; font-weight: bold; }

.delivery-options { display: flex; gap: 12px; }
.option { flex: 1; border: 2px solid #e2e8f0; border-radius: 10px; padding: 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; text-align: center; transition: all 0.2s; }
.option.active { border-color: #ff5000; background: #fff0e8; }
.option .icon { font-size: 24px; margin-bottom: 6px; }
.option .name { font-size: 14px; font-weight: bold; color: #1e293b; }
.option .desc { font-size: 11px; color: #94a3b8; margin-top: 4px; }

/* 地址卡片样式 */
.address-card { position: relative; padding: 16px; background: #f8fafc; border-radius: 8px; cursor: pointer; border: 1px solid #f1f5f9; }
.addr-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.addr-name-row .name { font-size: 16px; font-weight: bold; color: #1e293b; }
.addr-name-row .phone { font-size: 14px; color: #64748b; }
.addr-name-row .tag { font-size: 10px; background: #fff0e8; color: #ff5000; padding: 2px 6px; border-radius: 4px; }
.addr-detail { font-size: 14px; color: #334155; line-height: 1.4; }
.arrow { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #cbd5e1; }

.no-address { text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; color: #ff5000; font-weight: bold; cursor: pointer; }

.time-picker { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #334155; margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9; }
.time-picker select { flex: 1; padding: 8px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; outline: none; }

.cart-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
.cart-item img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; }
.item-info { flex: 1; }
.item-info .title { font-size: 14px; margin: 0 0 4px; color: #1e293b; }
.item-info .qty { font-size: 12px; margin: 0; color: #94a3b8; }
.price { font-size: 15px; font-weight: bold; color: #ff5000; margin: 0; }

.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 60px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-top: 1px solid #eee; z-index: 100; }
.total { font-size: 15px; color: #334155; }
.submit-btn { background: #ff5000; color: #fff; border: none; padding: 10px 30px; border-radius: 20px; font-size: 16px; font-weight: bold; }
</style>
