<template>
  <template v-if="$route.path !== '/'">
    <NavBar />
  </template>

  <main class="page" :class="{ 'is-auth': $route.path === '/' }">
    <router-view v-slot="{ Component }">
      <!-- 🔥 核心大招：使用 keep-alive 缓存首页和分类页，防止来回切换重新加载 -->
      <keep-alive :include="['HomeView']">
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
import DynamicBackground from '@/components/DynamicBackground.vue'
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
