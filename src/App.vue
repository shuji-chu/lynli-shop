<template>
  <template v-if="['/shop', '/cart', '/orders'].includes($route.path)">
    <NavBar />
  </template>

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
* { box-sizing: border-box; }
.page { min-height: 100vh; }
.page.has-nav {
  padding-top: 56px;
  padding-bottom: 80px; /* 统一留出底部大空间，彻底防遮挡 */
}
.page.is-auth { padding: 0; }
</style>
