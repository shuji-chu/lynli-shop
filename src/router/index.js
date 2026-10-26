import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'auth', component: () => import('@/views/AuthView.vue') },
  { path: '/shop', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/product/:id', name: 'product', component: () => import('@/views/ProductDetailView.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue') },
  { path: '/order-list', name: 'order-list', component: () => import('@/views/OrderListView.vue') },
  
  { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
  { path: '/security', name: 'security', component: () => import('@/views/SecurityView.vue') },
  { path: '/address', name: 'address', component: () => import('@/views/AddressView.vue') },
  
  // 刚刚新建的 6 个页面
  { path: '/profile', component: () => import('@/views/ProfileView.vue') },
  { path: '/pay-settings', component: () => import('@/views/PaySettingsView.vue') },
  { path: '/language', component: () => import('@/views/LanguageView.vue') },
  { path: '/apply', component: () => import('@/views/ApplyView.vue') },
  { path: '/help', component: () => import('@/views/HelpView.vue') },
  { path: '/about', component: () => import('@/views/AboutView.vue') },
  
  // 兜底：找不到页面才跳回首页
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局路由守卫（处理没登录的状态，防止死循环）
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 如果去的是登录页，直接放行
  if (to.path === '/') {
    next()
  } else {
    // 去其他页面，如果没有 token，踢回登录页
    if (!token || token === 'undefined' || token === 'null') {
      next('/')
    } else {
      next()
    }
  }
})

export default router
