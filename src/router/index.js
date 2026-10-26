import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'auth', component: () => import('@/views/AuthView.vue') },
  { path: '/shop', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/product/:id', name: 'product', component: () => import('@/views/ProductDetailView.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue') },
  // 🔥 新增所有“我的”页面的子路由
  { path: '/address', name: 'address', component: () => import('@/views/Placeholder.vue') },
  { path: '/security', name: 'security', component: () => import('@/views/Placeholder.vue') },
  { path: '/coupons', name: 'coupons', component: () => import('@/views/Placeholder.vue') },
  { path: '/points', name: 'points', component: () => import('@/views/Placeholder.vue') },
  { path: '/favorites', name: 'favorites', component: () => import('@/views/Placeholder.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
