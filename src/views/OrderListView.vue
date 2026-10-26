<template>
  <div class="order-list-page">
    <!-- 顶部搜索与导航 -->
    <div class="header">
      <button @click="$router.back()" class="back-btn">←</button>
      <div class="search-bar">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ff5000" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="搜索订单" />
      </div>
      <div class="header-right">
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
      <div class="order-card" v-for="order in filteredOrders" :key="order.id">
        <div class="card-header">
          <span>订单号: {{ order.trade_no }}</span>
          <span class="status">{{ order.status_text || '待付款' }}</span>
        </div>
        <div class="card-body">
          <!-- 这里为了演示简单，暂时不展开多商品，只显示总价 -->
          <p>总金额: ¥{{ order.total_amount }}</p>
          <p class="time">{{ formatTime(order.created_at) }}</p>
        </div>
      </div>
    </div>

    <!-- 空状态 & 推荐商品 -->
    <div class="empty-state" v-else>
      <div class="empty-icon">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="20" width="60" height="80" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="4"/>
          <path d="M45 40h30M45 55h30M45 70h15" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="empty-text">您还没有相关的订单</p>
    </div>

    <!-- 推荐商品 (淘宝同款猜你喜欢) -->
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

const currentTab = ref('all')
const tabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '待发货', value: 'paid' },
  { label: '待收货', value: 'shipped' },
  { label: '退款/售后', value: 'refund' }
]

const orders = ref([])
const recommendProducts = ref([])

const filteredOrders = computed(() => {
  if (currentTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status == currentTab.value)
})

const formatTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts * 1000)
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
}

onMounted(async () => {
  // 1. 获取我的订单
  try {
    const res = await request.get('/api/v1/user/orders')
    orders.value = res.data || res || []
  } catch (e) {
    console.warn('获取订单失败', e)
  }

  // 2. 获取推荐商品 (调用首页同一个接口)
  try {
    const pRes = await getProducts({ page: 1, size: 10 })
    recommendProducts.value = Array.isArray(pRes) ? pRes : (pRes?.data || [])
  } catch (e) {
    console.warn('获取推荐商品失败', e)
  }
})
</script>

<style scoped>
.order-list-page { min-height: 100vh; background: #f8fafc; padding-bottom: 20px; }

/* 顶部导航 */
.header { position: sticky; top: 0; z-index: 100; background: #fff; height: 56px; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
.back-btn { background: none; border: none; font-size: 24px; color: #1e293b; cursor: pointer; }
.search-bar { flex: 1; height: 36px; background: #f8fafc; border: 1px solid #ff5000; border-radius: 18px; display: flex; align-items: center; padding: 0 12px; gap: 6px; }
.search-bar input { flex: 1; border: none; background: transparent; outline: none; font-size: 14px; }
.header-right { font-size: 13px; color: #1e293b; }

/* 状态 Tab */
.status-tabs { display: flex; background: #fff; overflow-x: auto; border-bottom: 1px solid #f1f5f9; padding: 0 16px; scrollbar-width: none; }
.status-tabs::-webkit-scrollbar { display: none; }
.tab-item { padding: 14px 16px; font-size: 15px; color: #475569; white-space: nowrap; position: relative; cursor: pointer; }
.tab-item.active { font-weight: bold; color: #ff5000; }
.tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 24px; height: 3px; background: #ff5000; border-radius: 2px; }

/* 订单卡片 */
.order-content { padding: 12px; }
.order-card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.card-header { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 10px; }
.card-header .status { color: #ff5000; font-weight: bold; }

/* 空状态 */
.empty-state { padding: 60px 0 40px; display: flex; flex-direction: column; align-items: center; }
.empty-icon { width: 100px; height: 100px; margin-bottom: 16px; }
.empty-text { font-size: 15px; color: #94a3b8; }

/* 推荐商品 */
.recommend-section { padding: 0 12px; }
.rec-title { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 20px 0; font-size: 16px; font-weight: bold; color: #1e293b; }
.rec-title .line { width: 30px; height: 1px; background: #cbd5e1; }
.grid { column-count: 2; column-gap: 12px; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
</style>
