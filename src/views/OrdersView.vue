<template>
  <div class="container orders-page">
    
    <!-- 1. 头部：个人信息卡片 -->
    <div class="profile-card">
      <div class="p-top">
        <img :src="myAvatar" class="p-avatar" />
        <div class="p-info">
          <h3 class="p-name">{{ myNickname }}</h3>
          <p class="p-role" v-if="userInfo.role === 'super' || userInfo.role === 'admin'">👑 尊贵的管理员</p>
        </div>
      </div>
      
      <!-- 快捷功能入口 -->
      <div class="p-links">
        <span @click="showToast('暂未开放，敬请期待')">📍 收货地址</span>
        <span @click="showToast('暂未开放，敬请期待')">🛡️ 账号与安全</span>
        <span @click="showToast('暂未开放，敬请期待')">🎧 联系客服</span>
      </div>
    </div>

    <!-- 2. 我的订单（带状态分类） -->
    <div class="section">
      <div class="section-header">
        <h3>我的订单</h3>
        <span class="all-orders" @click="currentTab = 'all'">全部订单 ></span>
      </div>

      <!-- 订单状态图标导航 -->
      <div class="order-nav">
        <div class="nav-item" @click="currentTab = 'unpaid'">
          <div class="icon-box">💳</div>
          <span>待付款</span>
        </div>
        <div class="nav-item" @click="currentTab = 'unshipped'">
          <div class="icon-box">📦</div>
          <span>待发货</span>
        </div>
        <div class="nav-item" @click="currentTab = 'shipped'">
          <div class="icon-box">🚚</div>
          <span>待收货</span>
        </div>
        <div class="nav-item" @click="currentTab = 'completed'">
          <div class="icon-box">⭐</div>
          <span>待评价</span>
        </div>
        <div class="nav-item" @click="currentTab = 'refund'">
          <div class="icon-box">🔄</div>
          <span>退款/售后</span>
        </div>
      </div>

      <!-- 订单列表展示区 -->
      <div class="order-content">
        <div v-if="loading" class="loading">加载中...</div>
        
        <div v-else-if="filteredList.length === 0" class="empty-orders">
          <p>这里空空如也～</p>
          <button @click="$router.push('/shop')" class="go-shop-btn">去逛逛</button>
        </div>

        <ul v-else class="order-list">
          <li v-for="o in filteredList" :key="o.id || o.trade_no" class="order-item">
            <div class="o-head">
              <span>订单号：{{ o.trade_no || o.id }}</span>
              <span class="o-status">{{ o.status }}</span>
            </div>
            <div class="o-foot">
              <span>{{ formatTime(o.created_at) }}</span>
              <span class="o-amount">合计：¥{{ o.amount }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 3. 我的资产 / 工具区（预留占位） -->
    <div class="section tools-section">
      <div class="tool-item" @click="showToast('功能开发中')">
        <span class="t-icon">🎟️</span> 优惠券
      </div>
      <div class="tool-item" @click="showToast('功能开发中')">
        <span class="t-icon">💎</span> 积分
      </div>
      <div class="tool-item" @click="showToast('功能开发中')">
        <span class="t-icon">❤️</span> 我的收藏
      </div>
      <div class="tool-item" @click="showToast('功能开发中')">
        <span class="t-icon">👣</span> 我的足迹
      </div>
    </div>

    <!-- 4. 退出登录 -->
    <div class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from '@/utils/toast'
import { getMyOrders } from '@/api/order'

const router = useRouter()
const list = ref([])
const loading = ref(true)

// 订单状态分类控制
const currentTab = ref('all')

const userInfo = computed(() => {
  const data = localStorage.getItem('userInfo')
  if (!data) return {}
  try { return JSON.parse(data) } catch (e) { return {} }
})

const myAvatar = computed(() => userInfo.value.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=lynli&backgroundColor=3b82f6&textColor=ffffff')
const myNickname = computed(() => userInfo.value.nickname || userInfo.value.email?.split('@')[0] || '用户')

const showToast = (msg) => {
  if (Toast && Toast.info) Toast.info(msg)
  else alert(msg)
}

// 过滤显示不同的订单状态
const filteredList = computed(() => {
  if (currentTab.value === 'all') return list.value
  // 这里的过滤逻辑需要根据你后端实际返回的 status 字段来适配
  // 比如后端返回 'pending', 'paid', 'shipped' 等
  return list.value.filter(o => {
    const s = (o.status || '').toLowerCase()
    if (currentTab.value === 'unpaid') return s === 'pending' || s === 'unpaid'
    if (currentTab.value === 'unshipped') return s === 'paid'
    if (currentTab.value === 'shipped') return s === 'shipped'
    if (currentTab.value === 'completed') return s === 'completed'
    if (currentTab.value === 'refund') return s === 'refund'
    return true
  })
})

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}

async function load() {
  if (!localStorage.getItem('token')) {
    router.push('/auth')
    return
  }
  loading.value = true
  try {
    const res = await getMyOrders()
    if (res && Array.isArray(res.data)) list.value = res.data
    else if (Array.isArray(res)) list.value = res
  } catch (e) {
    console.warn('获取订单失败', e)
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  if (Toast && Toast.success) Toast.success('已退出登录')
  router.push('/auth')
}

onMounted(load)
</script>

<style scoped>
.orders-page { padding-top: 20px; padding-bottom: 40px; background: #f5f7fa; min-height: 100vh; }

/* 头部卡片 */
.profile-card { background: linear-gradient(135deg, #3b82f6, #1e3a8a); border-radius: 20px; padding: 24px; color: #fff; box-shadow: 0 10px 20px rgba(59,130,246,0.2); margin-bottom: 16px; }
.p-top { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.p-avatar { width: 68px; height: 68px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); object-fit: cover; }
.p-info { display: flex; flex-direction: column; gap: 6px; }
.p-name { font-size: 22px; font-weight: bold; margin: 0; }
.p-role { font-size: 12px; background: rgba(255,255,255,0.2); display: inline-block; padding: 3px 10px; border-radius: 12px; margin: 0; width: fit-content; }
.p-links { display: flex; justify-content: space-between; font-size: 13px; color: rgba(255,255,255,0.9); border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; }
.p-links span { cursor: pointer; }

/* 通用白底区块 */
.section { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-bottom: 16px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-header h3 { margin: 0; font-size: 16px; color: #1e293b; font-weight: bold; }
.all-orders { font-size: 13px; color: #94a3b8; cursor: pointer; }

/* 订单状态图标 */
.order-nav { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; }
.nav-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #475569; font-size: 13px; }
.icon-box { font-size: 24px; background: #f8fafc; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid #f1f5f9; }

/* 订单列表 */
.order-content { min-height: 120px; }
.empty-orders { text-align: center; padding: 20px 0; color: #94a3b8; font-size: 14px; }
.go-shop-btn { margin-top: 12px; background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 8px 24px; border-radius: 20px; cursor: pointer; }
.order-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.order-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
.o-head { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-bottom: 10px; }
.o-status { color: #3b82f6; font-weight: bold; }
.o-foot { display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; }
.o-amount { color: #f59e0b; font-weight: bold; font-size: 15px; }

/* 工具区 */
.tools-section { display: flex; justify-content: space-around; padding: 20px 10px; }
.tool-item { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 12px; color: #475569; cursor: pointer; }
.t-icon { font-size: 22px; }

/* 退出登录 */
.logout-section { margin-top: 24px; }
.logout-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; background: #fee2e2; color: #ef4444; font-size: 15px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
.logout-btn:hover { background: #fecaca; }
</style>
