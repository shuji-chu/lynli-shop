<template>
  <div class="container success">
    <div class="card panel">
      <div class="check">
        <svg viewBox="0 0 52 52" width="72" height="72">
          <circle cx="26" cy="26" r="24" fill="none" stroke="var(--ok)" stroke-width="2" />
          <path
            fill="none"
            stroke="var(--ok)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 27l8 8 15-15"
          />
        </svg>
      </div>
      <h2>支付成功</h2>
      <p v-if="tradeNo">订单号：{{ tradeNo }}</p>
      <p class="hint">我们会尽快为您私密发货，请留意邮箱通知</p>
      <div class="ops">
        <router-link to="/orders" class="btn-ghost">查看订单</router-link>
        <router-link to="/" class="btn-gold">继续购物</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const tradeNo = route.query.trade_no || ''
</script>

<style scoped>
.success {
  display: flex;
  justify-content: center;
  padding-top: 60px;
}
.card {
  width: 100%;
  max-width: 380px;
  text-align: center;
  padding: 40px 28px;
}
.check {
  margin-bottom: 14px;
}
.card h2 {
  font-size: 24px;
  font-weight: 700;
}
.card p {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-3);
}
.card .hint {
  color: var(--text-2);
  margin-top: 12px;
}
.ops {
  margin-top: 26px;
  display: flex;
  gap: 14px;
  justify-content: center;
}
.ops a {
  flex: 1;
}
</style>
