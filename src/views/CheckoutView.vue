<template>
  <div class="container checkout">
    <h2 class="section-title">确认订单</h2>

    <div v-if="!selectedItems.length" class="empty">
      <p>没有可结算的商品</p>
      <router-link to="/cart" class="btn-gold">返回购物车</router-link>
    </div>

    <template v-else>
      <ul class="items panel">
        <li v-for="item in selectedItems" :key="item.id" class="item">
          <img :src="item.image" :alt="item.title" loading="lazy" @error="onErr" />
          <div class="info">
            <p class="name">{{ item.title }}</p>
            <p class="price">{{ formatPrice(markupPrice(item.price)) }} × {{ item.qty }}</p>
          </div>
          <span class="sub">{{ formatPrice(markupPrice(item.price * item.qty)) }}</span>
        </li>
      </ul>

      <section class="block panel">
        <h3>收货信息</h3>
        <div class="form">
          <input v-model.trim="form.name" class="field" placeholder="收货人姓名" />
          <input
            v-model.trim="form.phone"
            class="field"
            placeholder="联系电话"
            inputmode="tel"
          />
          <textarea
            v-model.trim="form.address"
            class="field"
            rows="2"
            placeholder="详细收货地址"
          ></textarea>
        </div>
      </section>

      <section class="block panel">
        <h3>支付方式</h3>
        <div class="methods">
          <label class="method" :class="{ active: method === 'alipay' }">
            <input type="radio" value="alipay" v-model="method" />
            <span class="m-name">支付宝</span>
            <span class="m-desc">扫码即时到账</span>
          </label>
          <label class="method" :class="{ active: method === 'usdt' }">
            <input type="radio" value="usdt" v-model="method" />
            <span class="m-name">USDT 加密货币</span>
            <span class="m-desc">链上充值 · 隐私友好</span>
          </label>
          <label class="method wechat" :class="{ active: method === 'wechat' }">
            <input type="radio" value="wechat" v-model="method" />
            <span class="m-name">微信支付 <i class="soon">即将开通</i></span>
            <span class="m-desc">敬请期待</span>
          </label>
        </div>
      </section>

      <div class="submit panel">
        <div class="total">
          应付：<b>{{ formatPrice(selectedTotal) }}</b>
        </div>
        <button class="btn-gold" :disabled="submitting" @click="submit">
          {{ submitting ? '提交中…' : (method === 'wechat' ? '微信支付即将开通' : '提交订单') }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { selectedItems, selectedTotal } from '@/store/cart'
import { createOrder } from '@/api/order'
import { isLoggedIn } from '@/store/user'
import { Toast } from '@/utils/toast'
import { formatPrice } from '@/utils/format'
import { markupPrice, markupTotal } from '@/utils/price'

const router = useRouter()
const method = ref('alipay')
const submitting = ref(false)
const form = reactive({ name: '', phone: '', address: '' })

function onErr(e) {
  e.target.style.visibility = 'hidden'
}

async function submit() {
  if (!isLoggedIn.value) {
    Toast.error('请先登录')
    router.push({ name: 'auth', query: { redirect: '/checkout' } })
    return
  }
  if (!form.name || !form.phone || !form.address) {
    Toast.error('请完整填写收货信息')
    return
  }

  const payload = {
    items: selectedItems.value.map((i) => ({ id: i.id, qty: i.qty })),
    address: form.address,
    contact: `${form.name} ${form.phone}`,
    method: method.value,
    // 金额一致性红线：携带上浮 35% 后的应付总额（经价格中枢计算）。
    // 后端当前按 shop_products.price 落单（见 guanli/api_shop.py），
    // 此处传 amount 为前向兼容——后端一旦按前端金额取值即自动一致。
    amount: Number(markupTotal(selectedItems.value).toFixed(2))
  }

  // 微信支付预留：暂未开通，点击提示而不落地下单
  if (method.value === 'wechat') {
    Toast.info('微信支付即将开通，敬请期待')
    return
  }

  submitting.value = true
  try {
    const res = await createOrder(payload)
    const tradeNo = res?.trade_no || res?.tradeNo || res?.order_no
    if (!tradeNo) {
      Toast.error('下单失败：未返回订单号')
      return
    }
    router.push({
      name: 'pay',
      query: { trade_no: tradeNo, method: method.value }
    })
  } catch {
    // 错误已由拦截器 Toast
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.checkout {
  padding-top: 24px;
}
.items {
  padding: 8px 16px;
  margin-bottom: 16px;
}
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.item:last-child {
  border-bottom: none;
}
.item img {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.04);
}
.item .info {
  flex: 1;
  min-width: 0;
}
.item .name {
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item .price {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-3);
}
.item .sub {
  color: var(--gold-bright);
  font-weight: 700;
  flex: 0 0 auto;
}
.block {
  padding: 16px;
  margin-bottom: 16px;
}
.block h3 {
  font-size: 16px;
  margin-bottom: 14px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.method {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.method.active {
  border-color: var(--gold);
  background: rgba(47, 107, 224, 0.1);
}
.method.wechat {
  opacity: 0.85;
}
.soon {
  font-style: normal;
  font-size: 10px;
  padding: 1px 7px;
  border-radius: 7px;
  color: #fff;
  background: var(--text-3);
  margin-left: 4px;
  vertical-align: middle;
}
.method input {
  position: absolute;
  top: 14px;
  right: 14px;
  accent-color: var(--gold);
}
.m-name {
  font-weight: 600;
}
.m-desc {
  font-size: 12px;
  color: var(--text-3);
}
.submit {
  position: sticky;
  bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
}
.total {
  font-size: 14px;
  color: var(--text-2);
}
.total b {
  color: var(--gold-bright);
  font-size: 22px;
}
.empty {
  text-align: center;
  padding: 90px 0;
  color: var(--text-3);
}
.empty .btn-gold {
  margin-top: 18px;
}
@media (max-width: 640px) {
  .methods {
    grid-template-columns: 1fr;
  }
}
</style>
