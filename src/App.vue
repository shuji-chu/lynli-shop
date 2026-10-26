<template>
  <!-- 如果是登录页（/），就不显示顶部和底部导航 -->
  <template v-if="$route.path !== '/'">
    <DynamicBackground />
    <NavBar />
  </template>
  
  <main class="page" :class="{ 'is-auth': $route.path === '/' }">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  
  <template v-if="$route.path !== '/'">
    <BottomNav />
    <Toast />
  </template>
</template>

<script setup>
import DynamicBackground from '@/components/DynamicBackground.vue'
import NavBar from '@/components/NavBar.vue'
import BottomNav from '@/components/BottomNav.vue'
import Toast from '@/components/Toast.vue'
</script>

<style>
.page {
  padding-top: 64px;
  padding-bottom: 40px;
  min-height: 100vh;
}
/* 登录页不需要顶部的留白 */
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
/* 保持你原本的过渡动画 */
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
