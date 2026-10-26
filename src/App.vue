<template>
  <template v-if="$route.path !== '/'">
    <NavBar />
  </template>

  <main class="page" :class="{ 'is-auth': $route.path === '/' }">
    <router-view v-slot="{ Component }">
      <!-- 🚨 核心大招：开启缓存，把首页(HomeView)和订单页(OrdersView)保存起来 -->
      <keep-alive :include="['HomeView', 'OrdersView', 'CartView']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>

  <template v-if="$route.path !== '/'">
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
.page { padding-top: 64px; padding-bottom: 40px; min-height: 100vh; }
.page.is-auth { padding-top: 0; padding-bottom: 0; }
@media (max-width: 640px) {
  .page { padding-top: 56px; padding-bottom: 78px; }
  .page.is-auth { padding-top: 0; padding-bottom: 0; }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.fade-enter-from { opacity: 0; transform: translateY(8px); }
.fade-leave-to { opacity: 0; }
</style>
