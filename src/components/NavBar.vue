<template>
  <header class="navbar">
    <div class="container bar">
      <router-link to="/" class="brand">
        <img src="/logo.png" alt="LYNLI" class="logo" />
        <span class="brand-text">LYNLI<i>微澜</i></span>
      </router-link>

      <nav class="links">
        <router-link to="/" active-class="active">首页</router-link>
        <router-link to="/cart" active-class="active">购物车</router-link>
        <router-link v-if="isLoggedIn" to="/orders" active-class="active">我的订单</router-link>
      </nav>

      <div class="actions">
        <router-link to="/cart" class="icon-btn" aria-label="购物车">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2.5 3h2l2.2 11.2a1.2 1.2 0 0 0 1.2 1h9.3a1.2 1.2 0 0 0 1.2-.95L21 7H6" />
          </svg>
          <span v-if="totalCount" class="badge">{{ totalCount }}</span>
        </router-link>

        <router-link v-if="!isLoggedIn" to="/auth" class="btn-ghost sm">登录</router-link>
        <router-link v-else to="/orders" class="icon-btn" aria-label="我的">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
          </svg>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { isLoggedIn } from '@/store/user'
import { totalCount } from '@/store/cart'
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(8, 8, 13, 0.55);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
}
.bar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  height: 38px;
  width: 38px;
  border-radius: 50%;
  object-fit: cover;
}
.brand-text {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 1px;
}
.brand-text i {
  font-style: normal;
  font-size: 13px;
  font-weight: 400;
  color: var(--text-3);
  margin-left: 4px;
  letter-spacing: 2px;
}
.links {
  display: flex;
  gap: 28px;
  margin-left: auto;
  font-size: 15px;
  color: var(--text-2);
}
.links a {
  position: relative;
  padding: 4px 0;
  transition: color 0.2s;
}
.links a:hover {
  color: var(--text-1);
}
.links a.active {
  color: var(--gold-bright);
}
.links a.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--gold-bright), var(--gold));
}
.actions {
  display: flex;
  align-items: center;
  gap: 14px;
}
.icon-btn {
  position: relative;
  color: var(--text-1);
  display: inline-flex;
  transition: color 0.2s;
}
.icon-btn:hover {
  color: var(--gold);
}
.badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 9px;
  background: var(--danger);
  color: #fff;
  font-size: 11px;
  line-height: 17px;
  text-align: center;
}
.btn-ghost.sm {
  padding: 8px 16px;
  font-size: 14px;
}

@media (max-width: 640px) {
  .links {
    display: none;
  }
  .bar {
    height: 56px;
  }
  .logo {
    height: 32px;
    width: 32px;
  }
}
</style>
