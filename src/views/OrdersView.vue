<template>
  <div class="container orders-page">
    <div class="profile-card">
      <div class="p-top">
        <img :src="myAvatar" class="p-avatar" />
        <div class="p-info">
          <h3 class="p-name">{{ myNickname }}</h3>
          <p class="p-role" v-if="userInfo.role === 'super' || userInfo.role === 'admin'">尊贵的管理员</p>
        </div>
        <div class="settings-icon" @click="$router.push('/settings')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
      </div>
      <div class="p-links">
        <span @click="$router.push('/profile')">个人信息</span>
        <span @click="$router.push('/security')">账号与安全</span>
        <span @click="$router.push('/help')">联系客服</span>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h3>我的订单</h3>
        <span class="all-orders" @click="$router.push('/order-list?tab=all')">全部订单 &gt;</span>
      </div>
      <div class="order-nav">
        <!-- 🚨 核心修复：每个图标带上专属的 tab 参数 -->
        <div class="nav-item" @click="$router.push('/order-list?tab=pending')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg><span>待付款</span>
        </div>
        <div class="nav-item" @click="$router.push('/order-list?tab=paid')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg><span>待发货</span>
        </div>
        <div class="nav-item" @click="$router.push('/order-list?tab=shipped')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><span>待收货</span>
        </div>
        <div class="nav-item" @click="$router.push('/order-list?tab=completed')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span>待评价</span>
        </div>
        <div class="nav-item" @click="$router.push('/order-list?tab=refund')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>退款/售后</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

async function load() {
  if (!localStorage.getItem('token')) { router.push('/auth'); return }
  loading.value = true
  try {
    const res = await getMyOrders()
    if (res && Array.isArray(res.data)) list.value = res.data
    else if (Array.isArray(res)) list.value = res
  } catch (e) {
    console.warn('获取订单失败', e)
  } finally { loading.value = false }
}
onMounted(load)
</script>

<style scoped>
.orders-page { padding-top: 76px; padding-bottom: 40px; background: #f5f7fa; min-height: 100vh; }
.profile-card { position: relative; background: linear-gradient(135deg, #3b82f6, #1e3a8a); border-radius: 20px; padding: 24px; color: #fff; box-shadow: 0 10px 20px rgba(59,130,246,0.2); margin-bottom: 16px; }
.p-top { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.p-avatar { width: 68px; height: 68px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.8); object-fit: cover; }
.p-info { display: flex; flex-direction: column; gap: 6px; }
.p-name { font-size: 22px; font-weight: bold; margin: 0; }
.p-role { font-size: 12px; background: rgba(255,255,255,0.2); display: inline-block; padding: 3px 10px; border-radius: 12px; margin: 0; width: fit-content; }
.settings-icon { position: absolute; top: 24px; right: 20px; cursor: pointer; opacity: 0.8; }
.settings-icon svg { width: 20px; height: 20px; }
.p-links { display: flex; justify-content: space-between; font-size: 13px; color: rgba(255,255,255,0.9); border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; }
.p-links span { cursor: pointer; }

.section { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin-bottom: 16px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-header h3 { margin: 0; font-size: 16px; color: #1e293b; font-weight: bold; }
.all-orders { font-size: 13px; color: #94a3b8; cursor: pointer; }

.order-nav { display: flex; justify-content: space-between; }
.nav-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #475569; font-size: 13px; transition: color 0.2s; }
.nav-item:hover { color: #3b82f6; }
.nav-item svg { width: 26px; height: 26px; }
</style>
