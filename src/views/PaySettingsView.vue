<template>
  <div class="page-wrap">
    <div class="header"><button @click="$router.back()">←</button><h2>支付设置</h2><div></div></div>
    <div class="content">
      <div class="section-title">国内支付</div>
      <div class="list">
        <div class="item"><span class="icon green">支</span><span class="name">支付宝</span><span class="status">已绑定</span></div>
        <div class="item"><span class="icon green">微</span><span class="name">微信支付</span><span class="status">已绑定</span></div>
      </div>
      
      <div class="section-title">海外 / 跨境支付</div>
      <div class="list">
        <div class="item"><span class="icon blue">P</span><span class="name">PayPal</span><span class="status gray">未绑定</span></div>
        <div class="item"><span class="icon orange">U</span><span class="name">USDT (TRC20)</span><span class="status gray">未绑定</span></div>
        <div class="item"><span class="icon dark">S</span><span class="name">Stripe</span><span class="status gray">未绑定</span></div>
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
.section-title { font-size: 13px; color: #94a3b8; margin: 16px 0 8px; }
.list { background: #fff; border-radius: 12px; padding: 0 16px; }
.item { display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
.item:last-child { border-bottom: none; }
.icon { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; margin-right: 12px; }
.icon.green { background: #10b981; } .icon.blue { background: #0070ba; } .icon.orange { background: #f59e0b; } .icon.dark { background: #635bff; }
.name { flex: 1; font-size: 15px; color: #1e293b; }
.status { font-size: 13px; color: #10b981; }
.status.gray { color: #94a3b8; }
</style>
