<template>
  <div class="page-wrap" style="padding-top: 64px;">
    <div class="header"><button @click="$router.back()">←</button><h2>地区与语言</h2><div></div></div>
    <div class="content">
      <div class="list">
        <div class="item active"><span>简体中文 (Simplified Chinese)</span><span class="check">✓</span></div>
        <div class="item"><span>繁體中文 (Traditional Chinese)</span></div>
        <div class="item"><span>English (US)</span></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }
.list { background: #fff; border-radius: 12px; padding: 0 16px; }
.item { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #1e293b; }
.item.active { color: #3b82f6; font-weight: bold; }
.check { color: #3b82f6; }
</style>
