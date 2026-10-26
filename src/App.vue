<template>
  <template v-if="$route.path !== '/'">
    <NavBar />
  </template>

  <!-- 彻底删除顶部的 padding-top -->
  <main class="page" :class="{ 'is-auth': $route.path === '/' }">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['HomeView', 'OrdersView', 'CartView']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>

  <template v-if="$router.path !== '/'">
    <BottomNav />
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
.page { 
  min-height: 100vh; 
  box-sizing: border-box; 
  /* 移除所有 padding-top */
  padding-bottom: 70px;
}
.page.is-auth { padding-bottom: 0; }

@media (max-width: 640px) {
  .page { padding-bottom: 80px; }
  .page.is-auth { padding-bottom: 0; }
}
.fade-enter-active, .fade-leave-to { transition: opacity 0.25s ease; }
</style>
