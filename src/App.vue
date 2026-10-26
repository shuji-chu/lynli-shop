<template>
  <DynamicBackground />
  <NavBar />
  <main class="page">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <BottomNav />
  <Toast />
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
@media (max-width: 640px) {
  .page {
    padding-top: 56px;
    padding-bottom: 78px;
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
