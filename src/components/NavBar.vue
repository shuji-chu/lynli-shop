<template>
  <header class="navbar">
    <div class="container bar">
      <router-link to="/shop" class="brand">
        <span class="brand-text">LYNLI<i>泠礼</i></span>
      </router-link>

      <div class="actions">
        <router-link to="/cart" class="icon-btn">购物车</router-link>
        
        <!-- 强制判断 token -->
        <router-link v-if="hasToken" to="/orders" class="profile-box" style="background: red; color: white; padding: 5px 10px; border-radius: 10px;">
          <img :src="myAvatar" alt="头像" class="avatar-img" />
          <span class="nickname">{{ myNickname }}</span>
        </router-link>
        
        <router-link v-else to="/auth" class="btn-ghost sm">去登录</router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

// 直接判断本地是否有 token
const hasToken = computed(() => {
  return !!localStorage.getItem('token')
})

// 直接读 userInfo
const myInfo = computed(() => {
  const data = localStorage.getItem('userInfo')
  if (!data) return {}
  try {
    return JSON.parse(data)
  } catch (e) {
    return {}
  }
})

// 强制读取头像
const myAvatar = computed(() => {
  if (myInfo.value.avatar) return myInfo.value.avatar
  return 'https://api.dicebear.com/7.x/initials/svg?seed=' + (myInfo.value.email || 'lynli') + '&backgroundColor=3b82f6&textColor=ffffff'
})

// 强制读取昵称
const myNickname = computed(() => {
  return myInfo.value.nickname || myInfo.value.email?.split('@')[0] || '测试用户'
})
</script>

<style scoped>
.navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: #fff; border-bottom: 1px solid #eee; }
.bar { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.brand-text { font-size: 20px; font-weight: 900; color: #1e3a8a; }
.brand-text i { font-size: 14px; color: #3b82f6; margin-left: 4px; }
.actions { display: flex; align-items: center; gap: 16px; }
.icon-btn { color: #333; text-decoration: none; }
.profile-box { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.avatar-img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; background: white; }
.nickname { font-size: 14px; font-weight: bold; }
.btn-ghost.sm { color: #3b82f6; border: 1px solid #3b82f6; padding: 4px 12px; border-radius: 20px; text-decoration: none; }
</style>
