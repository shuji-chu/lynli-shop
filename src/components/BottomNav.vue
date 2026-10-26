<template>
  <nav class="bottom-nav">
    <router-link to="/" class="tab" active-class="active">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v9h14v-9" />
      </svg>
      <span>首页</span>
    </router-link>
    <router-link to="/cart" class="tab" active-class="active">
      <span class="rel">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="20" r="1.4" />
          <circle cx="18" cy="20" r="1.4" />
          <path d="M2.5 3h2l2.2 11.2a1.2 1.2 0 0 0 1.2 1h9.3a1.2 1.2 0 0 0 1.2-.95L21 7H6" />
        </svg>
        <span v-if="totalCount" class="badge">{{ totalCount }}</span>
      </span>
      <span>购物车</span>
    </router-link>
    <router-link :to="isLoggedIn ? '/orders' : '/auth'" class="tab" active-class="active">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
      </svg>
      <span>我的</span>
    </router-link>
  </nav>
</template>

<script setup>
import { isLoggedIn } from '@/store/user'
import { totalCount } from '@/store/cart'
</script>

<style scoped>
.bottom-nav {
  display: none;
}
@media (max-width: 640px) {
  .bottom-nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 58px;
    padding-bottom: env(safe-area-inset-bottom);
    background: rgba(8, 8, 13, 0.82);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-top: 1px solid var(--border);
  }
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 11px;
    color: var(--text-3);
    transition: color 0.2s;
  }
  .tab.active {
    color: var(--gold-bright);
  }
  .rel {
    position: relative;
    display: inline-flex;
  }
  .badge {
    position: absolute;
    top: -5px;
    right: -9px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 8px;
    background: var(--danger);
    color: #fff;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
  }
}
</style>
