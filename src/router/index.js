import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'auth', component: () => import('@/views/AuthView.vue') },
  { path: '/shop', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/product/:id', name: 'product', component: () => import('@/views/ProductDetailView.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue') },
  
  // 新的子页面
  { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
  { path: '/security', name: 'security', component: () => import('@/views/SecurityView.vue') },
  { path: '/merchant', name: 'merchant', component: () => import('@/views/GenericPage.vue'), meta: { title: '商家入驻' } },
  { path: '/developer', name: 'developer', component: () => import('@/views/GenericPage.vue'), meta: { title: 'API 开放平台' } },
  { path: '/help', name: 'help', component: () => import('@/views/GenericPage.vue'), meta: { title: '帮助与反馈' } },
  { path: '/profile', name: 'profile', component: () => import('@/views/GenericPage.vue'), meta: { title: '个人信息' } },
  
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
