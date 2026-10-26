<template>
  <div class="container orders-page">
    <!-- 1. 顶部通栏个人信息卡片 -->
    <div class="profile-header">
      <div class="p-top">
        <img :src="myAvatar" class="p-avatar" />
        <div class="p-info">
          <div class="name-row">
            <h3 class="p-name">{{ myNickname }}</h3>
            <span class="p-role" v-if="userInfo.role === 'super' || userInfo.role === 'admin'">管理员</span>
          </div>
          <p class="p-id">专属ID: {{ userInfo.short_id || '10001' }}</p>
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

    <!-- 2. 我的订单模块 -->
    <div class="section">
      <div class="section-header">
        <h3>我的订单</h3>
        <span class="all-orders" @click="$router.push('/order-list?tab=all')">全部订单 &gt;</span>
      </div>
      <div class="order-nav">
        <div class="nav-item" @click="$router.push('/order-list?tab=0')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg><span>待付款</span>
        </div>
        <div class="nav-item" @click="$router.push('/order-list?tab=1')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg><span>待发货</span>
        </div>
        <div class="nav-item" @click="$router.push('/order-list?tab=2')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><span>待收货</span>
        </div>
        <div class="nav-item" @click="$router.push('/order-list?tab=3')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span>待评价</span>
        </div>
        <div class="nav-item" @click="$router.push('/order-list?tab=refund')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>退款/售后</span>
        </div>
      </div>
    </div>

    <!-- 🚨 3. 新增：镶嵌在下面的功能菜单列表 -->
    <div class="section menu-list">
      <div class="menu-item" @click="$router.push('/address')">
        <div class="m-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>收货地址</span>
        </div>
        <div class="m-right">
          <span class="arrow">&gt;</span>
        </div>
      </div>

      <div class="menu-item" @click="$router.push('/api-platform')">
        <div class="m-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span>开发者 / 商户 API 平台</span>
        </div>
        <div class="m-right">
          <span class="arrow">&gt;</span>
        </div>
      </div>

      <div class="menu-item" @click="$router.push('/pay-settings')">
        <div class="m-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
          <span>支持的支付方式</span>
        </div>
        <div class="m-right">
          <span class="arrow">&gt;</span>
        </div>
      </div>

      <div class="menu-item" @click="$router.push('/help')">
        <div class="m-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>帮助与反馈</span>
        </div>
        <div class="m-right">
          <span class="arrow">&gt;</span>
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
/* 页面底层底色 */
.orders-page { padding-top: 56px; padding-top: 64px; background: #f5f7fa; min-height: 100vh; padding-bottom: 40px; }

/* 顶部通栏渐变卡片 */
.profile-header { 
  background: linear-gradient(135deg, #3b82f6, #1e3a8a); 
  padding: 32px 20px 24px; 
  color: #fff; 
  border-bottom-left-radius: 24px; 
  border-bottom-right-radius: 24px; 
  margin-bottom: 16px; 
  box-shadow: 0 8px 20px rgba(59,130,246,0.2); 
}
.p-top { display: flex; align-items: center; gap: 16px; position: relative; margin-bottom: 24px; }
.p-avatar { width: 72px; height: 72px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.9); object-fit: cover; background: #fff; }
.p-info { display: flex; flex-direction: column; gap: 6px; }
.name-row { display: flex; align-items: center; gap: 8px; }
.p-name { font-size: 22px; font-weight: bold; margin: 0; }
.p-role { font-size: 11px; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 8px; }
.p-id { font-size: 13px; color: rgba(255,255,255,0.8); margin: 0; font-family: monospace; letter-spacing: 1px; }
.settings-icon { position: absolute; top: 4px; right: 0; cursor: pointer; opacity: 0.9; }
.settings-icon svg { width: 22px; height: 22px; }

/* 顶部链接 */
.p-links { display: flex; justify-content: space-between; font-size: 14px; color: #fff; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.15); }
.p-links span { cursor: pointer; flex: 1; text-align: center; font-weight: 500; }
.p-links span:first-child { text-align: left; }
.p-links span:last-child { text-align: right; }

/* 通用卡片 */
.section { background: #fff; margin: 0 16px 16px; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-header h3 { margin: 0; font-size: 16px; color: #1e293b; font-weight: bold; }
.all-orders { font-size: 13px; color: #94a3b8; cursor: pointer; }

/* 订单导航 */
.order-nav { display: flex; justify-content: space-between; }
.nav-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #475569; font-size: 13px; }
.nav-item svg { width: 28px; height: 28px; stroke-width: 1.8; }

/* 🚨 新增：菜单列表样式 */
.menu-list { padding: 0 20px; }
.menu-item { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
.menu-item:last-child { border-bottom: none; }
.m-left { display: flex; align-items: center; gap: 12px; font-size: 15px; color: #334155; font-weight: 500; }
.m-left svg { width: 22px; height: 22px; }
.m-right { display: flex; align-items: center; }
.arrow { color: #cbd5e1; font-size: 14px; }
</style>
