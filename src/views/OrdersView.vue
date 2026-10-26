<template>
  <div class="container orders">
    <h2 class="section-title">我的订单</h2>

    <div v-if="!isLoggedIn" class="empty">
      <p>请先登录后查看订单</p>
      <router-link to="/auth" class="btn-gold">去登录</router-link>
    </div>

    <div v-else-if="loading" class="loading">
      <div v-for="n in 3" :key="n" class="skeleton row-skel"></div>
    </div>

    <div v-else-if="!list.length" class="empty">
      <p>暂无订单</p>
      <router-link to="/" class="btn-gold">去逛逛</router-link>
    </div>

    <ul v-else class="list">
      <li v-for="o in list" :key="o.id || o.trade_no" class="order panel">
        <div class="head">
          <span class="no">订单号：{{ o.trade_no || o.id }}</span>
          <span class="status" :class="statusClass(o.status)">{{ statusText(o.status) }}</span>
        </div>
        <div class="goods">
          <div v-for="g in o.items || o.goods || []" :key="g.id || g.sku" class="good">
            <img :src="g.image || g.image_url || g.cover" :alt="g.title || g.name" loading="lazy" @error="onErr" />
            <div class="g-info">
              <p class="g-name">{{ g.title || g.name }}</p>
              <p class="g-qty">×{{ g.qty || 1 }}</p>
            </div>
          </div>
        </div>
        <div class="foot">
          <span class="time">{{ formatTime(o.created_at || o.create_time) }}</span>
          <span class="amount">合计 {{ formatPrice(o.amount || o.total) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { isLoggedIn } from '@/store/user'
import { getMyOrders } from '@/api/order'
import { formatPrice, formatTime } from '@/utils/format'

const list = ref([])
const loading = ref(true)

const STATUS_MAP = {
  pending: ['待支付', 'pending'],
  unpaid: ['待支付', 'pending'],
  paid: ['已支付', 'paid'],
  paided: ['已支付', 'paid'],
  shipped: ['已发货', 'shipped'],
  completed: ['已完成', 'completed'],
  done: ['已完成', 'completed'],
  closed: ['已关闭', 'closed'],
  expired: ['已关闭', 'closed']
}

function statusText(s) {
  return (STATUS_MAP[s] && STATUS_MAP[s][0]) || '未知'
}
function statusClass(s) {
  return (STATUS_MAP[s] && STATUS_MAP[s][1]) || 'unknown'
}

function normalize(res) {
  if (Array.isArray(res)) return res
  if (res && Array.isArray(res.list)) return res.list
  if (res && Array.isArray(res.items)) return res.items
  if (res && Array.isArray(res.data)) return res.data
  if (res && Array.isArray(res.orders)) return res.orders
  return []
}

function onErr(e) {
  e.target.style.visibility = 'hidden'
}

onMounted(async () => {
  if (!isLoggedIn.value) {
    loading.value = false
    return
  }
  try {
    const res = await getMyOrders()
    list.value = normalize(res)
  } catch {
    list.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.orders {
  padding-top: 24px;
}
.empty {
  text-align: center;
  padding: 90px 0;
  color: var(--text-3);
}
.empty .btn-gold {
  margin-top: 18px;
}
.loading {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.row-skel {
  height: 110px;
  border-radius: var(--radius);
}
.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.order {
  padding: 16px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-3);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.status {
  font-weight: 600;
  color: var(--gold);
}
.status.paid {
  color: var(--ok);
}
.status.shipped,
.status.completed {
  color: var(--gold-bright);
}
.status.closed {
  color: var(--text-3);
}
.goods {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 0;
}
.good {
  display: flex;
  gap: 12px;
  align-items: center;
}
.good img {
  width: 54px;
  height: 54px;
  border-radius: 10px;
  object-fit: cover;
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.04);
}
.g-name {
  font-size: 14px;
  font-weight: 600;
}
.g-qty {
  font-size: 12px;
  color: var(--text-3);
  margin-top: 2px;
}
.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-3);
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
.amount {
  color: var(--gold-bright);
  font-weight: 700;
  font-size: 16px;
}
</style>
