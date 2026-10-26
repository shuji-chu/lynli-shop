<template>
  <!-- 🚨 核心修复：只有在首页、购物车、我的这三个主页面，才显示顶部导航栏和底部Tab -->
  <template v-if="['/shop', '/cart', '/orders'].includes($route.path)">
    <NavBar />
  </template>

  <main class="page" :class="{ 'is-auth': $route.path === '/' }">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['HomeView', 'OrdersView', 'CartView']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>

  <template v-if="['/shop', '/cart', '/orders'].includes($route.path)">
    <BottomNav />
  </template>
  
  <!-- Toast 和 客服是全局的，一直保留 -->
  <template v-if="$route.path !== '/'">
    <Toast />
    <ChatWidget />
  </template>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import BottomNav from '@/components/BottomNav.vue'
import Toast from '@/components/Toast.vue'
import ChatWidget from '@/components/ChatWidget.vue'
</script>

<style>
.page { min-height: 100vh; box-sizing: border-box; }
.page.is-auth { padding: 0; }
.fade-enter-active, .fade-leave-to { transition: opacity 0.25s ease; }
</style>
