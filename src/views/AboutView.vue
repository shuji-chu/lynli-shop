<template>
  <div class="page-wrap">
    <div class="header"><button @click="$router.back()">←</button><h2>关于 LYNLI</h2><div></div></div>
    <div class="content">
      <div class="logo-box">
        <div class="logo">LYNLI</div>
        <p>版本 v1.0.0</p>
      </div>
      <div class="list">
        <div class="item"><span>官网</span><span>www.lynli.me</span></div>
        <div class="item"><span>用户协议</span><span>&gt;</span></div>
        <div class="item"><span>隐私政策</span><span>&gt;</span></div>
      </div>
      <p class="copyright">© 2026 LYNLI 泠礼. All Rights Reserved.</p>
    </div>
  </div>
</template>
<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }
.logo-box { display: flex; flex-direction: column; align-items: center; margin: 40px 0; }
.logo { font-size: 32px; font-weight: 900; color: #1e3a8a; letter-spacing: 2px; }
.logo-box p { font-size: 13px; color: #94a3b8; margin-top: 8px; }
.list { background: #fff; border-radius: 12px; padding: 0 16px; }
.item { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #1e293b; }
.item:last-child { border-bottom: none; }
.copyright { text-align: center; font-size: 12px; color: #cbd5e1; margin-top: 40px; }
</style>
