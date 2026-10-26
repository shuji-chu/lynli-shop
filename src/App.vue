<template>
  <!-- 登录页不显示顶部导航 -->
  <template v-if="$route.path !== '/'">
    <NavBar />
  </template>

  <main class="page" :class="{ 'is-auth': $route.path === '/' }">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <ChatWidget v-if="$route.path !== '/auth'" />

  <!-- 登录页不显示底部 Tab 和提示 -->
  <template v-if="$route.path !== '/'">
    <BottomNav />
    <Toast />
  </template>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import BottomNav from '@/components/BottomNav.vue'
import Toast from '@/components/Toast.vue'
import ChatWidget from '@/components/ChatWidget.vue'
// 🚨 暂时移除 DynamicBackground，大概率是它导致的白屏
</script>

<style>
.page {
  padding-top: 64px;
  padding-bottom: 40px;
  min-height: 100vh;
}
.page.is-auth {
  padding-top: 0;
  padding-bottom: 0;
}
@media (max-width: 640px) {
  .page {
    padding-top: 56px;
    padding-bottom: 78px;
  }
  .page.is-auth {
    padding-top: 0;
    padding-bottom: 0;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
}
</style>
