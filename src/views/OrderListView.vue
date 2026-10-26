<template>
  <div class="order-list-page">
    <!-- 蓝白光晕背景 -->
    <div class="soft-bg">
      <div class="glow glow-blue"></div>
      <div class="glow glow-pink"></div>
    </div>

    <!-- 顶部搜索与导航 -->
    <div class="header">
      <button @click="$router.back()" class="back-btn">←</button>
      <div class="search-bar">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ff5000" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="搜索订单" />
      </div>
      <!-- 🚨 点击唤起 AI 聊天 -->
      <div class="header-right" @click="openAiChat">
        <span>AI助手</span>
      </div>
    </div>

    <!-- 状态分类 Tab (可横向滑动) -->
    <div class="status-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.value" 
        class="tab-item" 
        :class="{ active: currentTab === tab.value }"
        @click="currentTab = tab.value"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 订单列表区 -->
    <div class="order-content" v-if="filteredOrders.length > 0">
      <div class="order-card" v-for="order in filteredOrders" :key="order.id || order.trade_no">
        <div class="card-header">
          <span>订单号: {{ order.trade_no }}</span>
          <span class="status">{{ getStatusText(order.status) }}</span>
        </div>
        <div class="card-body">
          <p>总金额: ¥{{ order.total_amount }}</p>
          <p class="time">{{ formatTime(order.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- 空状态 & 推荐商品 -->
    <div class="empty-state" v-else>
      <div class="empty-icon">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="20" width="60" height="80" rx="6" fill="#f0f7ff" stroke="#bfdbfe" stroke-width="4"/>
          <path d="M45 40h30M45 55h30M45 70h15" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="empty-text">您还没有相关的订单</p>
    </div>

    <!-- 推荐商品 -->
    <div class="recommend-section">
      <div class="rec-title">
        <span class="line"></span>
        <span>为您甄选</span>
        <span class="line"></span>
      </div>
      
      <div class="grid" v-if="recommendProducts.length > 0">
        <ProductCard v-for="p in recommendProducts" :key="p.id" :product="p" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { getProducts } from '@/api/product'
import request from '@/api/request'

const route = useRoute()
const currentTab = ref(route.query.tab || 'all')

const tabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: '0' },
  { label: '待发货', value: '1' },
  { label: '待收货', value: '2' },
  { label: '待评价', value: '3' },
  { label: '退款/售后', value: 'refund' }
]

const orders = ref([])
const recommendProducts = ref([])

// 🚨 触发全局 AI 唤起事件
const openAiChat = () => {
  window.dispatchEvent(new Event('open-ai-chat'))
}

const getStatusText = (status) => {
  const s = String(status).toLowerCase()
  if (s === '0' || s === 'pending' || s === 'unpaid') return '待付款'
  if (s === '1' || s === 'paid') return '待发货'
  if (s === '2' || s === 'shipped') return '待收货'
  if (s === '3' || s === 'completed') return '已完成'
  return '未知状态'
}

const filteredOrders = computed(() => {
  if (currentTab.value === 'all') return orders.value
  return orders.value.filter(o => String(o.status) === String(currentTab.value))
})

const formatTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts * 1000)
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
}

onMounted(async () => {
  try {
    const res = await request.get('/api/v1/user/orders')
    orders.value = res.data || res || []
  } catch (e) { console.warn('获取订单失败', e) }

  try {
    const pRes = await getProducts({ page: 1, size: 10 })
    recommendProducts.value = Array.isArray(pRes) ? pRes : (pRes?.data || [])
  } catch (e) { console.warn('获取推荐商品失败', e) }
})
</script>

<style scoped>
/* 蓝白质感背景 */
.order-list-page { min-height: 100vh; position: relative; background: #f8fafc; padding-bottom: 20px; overflow-x: hidden; }
.soft-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
.glow { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.6; }
.glow-blue { width: 350px; height: 350px; background: #bfdbfe; top: -50px; left: -100px; animation: floatGlow 8s infinite alternate ease-in-out; }
.glow-pink { width: 300px; height: 300px; background: #fbcfe8; bottom: 20%; right: -100px; animation: floatGlow 10s infinite alternate-reverse ease-in-out; }
@keyframes floatGlow { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(20px, 30px) scale(1.1); } }

/* 顶部导航 */
.header { position: sticky; top: 0; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px); height: 56px; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
.back-btn { background: none; border: none; font-size: 24px; color: #1e293b; cursor: pointer; }
.search-bar { flex: 1; height: 36px; background: #fff; border: 1px solid #ff5000; border-radius: 18px; display: flex; align-items: center; padding: 0 12px; gap: 6px; }
.search-bar input { flex: 1; border: none; background: transparent; outline: none; font-size: 14px; }
.header-right { font-size: 14px; font-weight: bold; color: #3b82f6; cursor: pointer; }

/* 状态 Tab */
.status-tabs { display: flex; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px); overflow-x: auto; padding: 0 16px; scrollbar-width: none; position: relative; z-index: 2; }
.status-tabs::-webkit-scrollbar { display: none; }
.tab-item { padding: 14px 16px; font-size: 15px; color: #475569; white-space: nowrap; position: relative; cursor: pointer; }
.tab-item.active { font-weight: bold; color: #3b82f6; }
.tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 24px; height: 3px; background: #3b82f6; border-radius: 2px; }

/* 订单卡片 */
.order-content { padding: 12px; position: relative; z-index: 2; }
.order-card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
.card-header { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 10px; }
.card-header .status { color: #3b82f6; font-weight: bold; }

/* 空状态 */
.empty-state { padding: 60px 0 40px; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; }
.empty-icon { width: 100px; height: 100px; margin-bottom: 16px; }
.empty-text { font-size: 15px; color: #94a3b8; }

/* 推荐商品 */
.recommend-section { padding: 0 12px; position: relative; z-index: 2; }
.rec-title { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 20px 0; font-size: 16px; font-weight: bold; color: #1e293b; }
.rec-title .line { width: 30px; height: 1px; background: #cbd5e1; }
.grid { column-count: 2; column-gap: 12px; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
</style>
