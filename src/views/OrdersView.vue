<template>
  <div class="container orders-page">
    
    <!-- 个人中心头部卡片 -->
    <div class="profile-card">
      <img :src="myAvatar" class="p-avatar" />
      <div class="p-info">
        <h3 class="p-name">{{ myNickname }}</h3>
        <p class="p-email">{{ myEmail }}</p>
        <p class="p-role" v-if="userInfo.role === 'super' || userInfo.role === 'admin'">尊贵的管理员</p>
      </div>
    </div>

    <!-- 订单模块 -->
    <div class="section">
      <div class="section-header">
        <h3>我的订单</h3>
        <span class="all-orders">全部订单 ></span>
      </div>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="!list.length" class="empty-orders">
        <p>暂无订单记录</p>
        <button @click="$router.push('/shop')" class="go-shop-btn">去逛逛</button>
      </div>

      <ul v-else class="order-list">
        <li v-for="o in list" :key="o.id || o.trade_no" class="order-item">
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

    <!-- 退出登录 -->
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

const userInfo = computed(() => {
  const data = localStorage.getItem('userInfo')
  if (!data) return {}
  try { return JSON.parse(data) } catch (e) { return {} }
})

const myAvatar = computed(() => userInfo.value.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=lynli&backgroundColor=3b82f6&textColor=ffffff')
const myNickname = computed(() => userInfo.value.nickname || userInfo.value.email?.split('@')[0] || '用户')
const myEmail = computed(() => userInfo.value.email || '未绑定邮箱')

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
    if (res && Array.isArray(res.data)) {
      list.value = res.data
    } else if (Array.isArray(res)) {
      list.value = res
    }
  } catch (e) {
    console.warn('获取订单失败', e)
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  Toast.success('已退出登录')
  router.push('/auth')
}

onMounted(load)
</script>

<style scoped>
.orders-page { padding-top: 20px; padding-bottom: 40px; }
.profile-card { background: linear-gradient(135deg, #3b82f6, #1e3a8a); border-radius: 20px; padding: 24px; display: flex; align-items: center; gap: 16px; color: #fff; box-shadow: 0 10px 20px rgba(59,130,246,0.2); margin-bottom: 24px; }
.p-avatar { width: 64px; height: 64px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); object-fit: cover; }
.p-info { display: flex; flex-direction: column; gap: 4px; }
.p-name { font-size: 20px; font-weight: bold; margin: 0; }
.p-email { font-size: 13px; color: rgba(255,255,255,0.8); margin: 0; }
.p-role { font-size: 11px; background: rgba(255,255,255,0.2); display: inline-block; padding: 2px 8px; border-radius: 10px; margin-top: 4px; }

.section { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-header h3 { margin: 0; font-size: 16px; color: #1e293b; }
.all-orders { font-size: 13px; color: #94a3b8; }

.empty-orders { text-align: center; padding: 30px 0; color: #94a3b8; font-size: 14px; }
.go-shop-btn { margin-top: 12px; background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 8px 24px; border-radius: 20px; cursor: pointer; }

.order-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.order-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
.o-head { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-bottom: 10px; }
.o-status { color: #3b82f6; font-weight: bold; }
.o-foot { display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; }
.o-amount { color: #f59e0b; font-weight: bold; font-size: 15px; }

.logout-section { margin-top: 30px; }
.logout-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; background: #fee2e2; color: #ef4444; font-size: 15px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
.logout-btn:hover { background: #fecaca; }
</style>
