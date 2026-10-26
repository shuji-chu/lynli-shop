<template>
  <div class="placeholder-page">
    <h2>{{ title }}</h2>
    <p>该功能正在紧急开发中，敬请期待...</p>
    <button @click="$router.back()" class="back-btn">返回</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const title = computed(() => route.query.title || '功能页面')
</script>

<style scoped>
.placeholder-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; }
h2 { color: #1e3a8a; margin-bottom: 10px; }
p { color: #64748b; font-size: 14px; margin-bottom: 20px; }
.back-btn { background: #3b82f6; color: white; border: none; padding: 10px 24px; border-radius: 20px; cursor: pointer; }
</style>
