<template>
  <header class="navbar">
    <div class="container bar">
      <router-link to="/shop" class="brand">
        <span class="brand-text">LYNLI<i>泠礼</i></span>
      </router-link>

      <div class="actions">
        <router-link to="/cart" class="icon-btn">购物车</router-link>
        
        <router-link v-if="hasToken" to="/orders" class="profile-box">
          <img :src="myAvatar" alt="头像" class="avatar-img" />
          <div class="user-info">
            <span class="nickname">{{ myNickname }}</span>
            <span class="short-id">ID: {{ myShortId }}</span>
          </div>
        </router-link>
        
        <router-link v-else to="/auth" class="btn-ghost sm">去登录</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const hasToken = computed(() => !!localStorage.getItem('token'))

const myInfo = computed(() => {
  const data = localStorage.getItem('userInfo')
  if (!data) return {}
  try { return JSON.parse(data) } catch (e) { return {} }
})

const myAvatar = computed(() => {
  if (myInfo.value.avatar) return myInfo.value.avatar
  return 'https://api.dicebear.com/7.x/initials/svg?seed=' + (myInfo.value.email || 'lynli') + '&backgroundColor=3b82f6&textColor=ffffff'
})

const myNickname = computed(() => myInfo.value.nickname || myInfo.value.email?.split('@')[0] || '用户')
const myShortId = computed(() => myInfo.value.short_id || '10001')
</script>

<style scoped>
/* 悬浮 + 毛玻璃背景 */
.navbar { 
  position: fixed; top: 0; left: 0; right: 0; 
  z-index: 100; 
  background: rgba(255,255,255,0.75); 
  backdrop-filter: blur(15px); 
  -webkit-backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(0,0,0,0.03); 
}
.bar { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; max-width: 1200px; margin: 0 auto; }
.brand-text { font-size: 20px; font-weight: 900; color: #1e3a8a; }
.brand-text i { font-size: 14px; color: #3b82f6; margin-left: 4px; }
.actions { display: flex; align-items: center; gap: 16px; }
.icon-btn { color: #333; text-decoration: none; font-size: 14px; }
.profile-box { display: flex; align-items: center; gap: 8px; text-decoration: none; background: rgba(241, 245, 249, 0.8); padding: 4px 12px 4px 4px; border-radius: 24px; }
.avatar-img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; background: white; }
.user-info { display: flex; flex-direction: column; justify-content: center; line-height: 1.2; }
.nickname { font-size: 13px; font-weight: bold; color: #1e293b; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.short-id { font-size: 10px; color: #94a3b8; font-family: monospace; }
.btn-ghost.sm { color: #3b82f6; border: 1px solid #3b82f6; padding: 6px 16px; border-radius: 20px; text-decoration: none; font-size: 14px; }
</style>
