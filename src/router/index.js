import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 1. 首页就是登录/注册页
  { path: '/', name: 'auth', component: () => import('@/views/AuthView.vue') },
  // 2. 登录后的商城首页（改成了 /shop）
  { path: '/shop', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/product/:id', name: 'product', component: () => import('@/views/ProductDetailView.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🚨 彻底删除 beforeEach 路由守卫！不再做任何拦截，绝不报错！
export default router
