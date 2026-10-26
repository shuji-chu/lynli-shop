<template>
  <div class="generic-page">
    <div class="header"><button @click="$router.back()" class="back-btn">←</button><h2>{{ title }}</h2><div></div></div>
    <div class="content">
      <p>该功能正在开发中，敬请期待...</p>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const title = computed(() => route.query.title || '功能页面')
</script>
<style scoped>
.generic-page {  background: #f5f7fa; min-height: 100vh; }
.header { position: fixed; top: 0; left: 0; right: 0; height: 60px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #eee; z-index:100;}
.header h2 { font-size: 18px; margin: 0; color: #1e293b; }
.back-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #333; }
.content { display: flex; justify-content: center; align-items: center; height: 60vh; color: #94a3b8; }
</style>
