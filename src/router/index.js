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
  { path: '/api-platform', component: () => import('@/views/ApiPlatformView.vue') },
  { path: '/profile', component: () => import('@/views/ProfileView.vue') },
  { path: '/pay-settings', component: () => import('@/views/PaySettingsView.vue') },
  { path: '/language', component: () => import('@/views/LanguageView.vue') },
  { path: '/apply', component: () => import('@/views/ApplyView.vue') },
  { path: '/help', component: () => import('@/views/HelpView.vue') },
  { path: '/about', component: () => import('@/views/AboutView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 🚨 核心大招：切换页面时，强制把滚动条重置到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/') {
    next()
  } else {
    if (!token || token === 'undefined' || token === 'null') {
      next('/')
    } else {
      next()
    }
  }
})

export default router
