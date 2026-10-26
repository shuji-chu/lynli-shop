<template>
  <!-- 主页面显示导航 -->
  <template v-if="['/shop', '/cart', '/orders'].includes($route.path)">
    <NavBar />
  </template>

  <!-- 统一在这里给主页面留出顶部/底部间距，子页面绝对不准再写！ -->
  <main class="page" :class="{ 'is-auth': $route.path === '/', 'has-nav': ['/shop', '/cart', '/orders'].includes($route.path) }">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['HomeView', 'OrdersView', 'CartView']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>

  <template v-if="['/shop', '/cart', '/orders'].includes($route.path)">
    <BottomNav />
  </template>
  
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
/* 🚨 核心：只有带导航的主页面才留间距，且只留一次！ */
.page.has-nav {
  padding-top: 56px;
  padding-bottom: 70px; 
}
.page.is-auth { padding: 0; }
</style>
