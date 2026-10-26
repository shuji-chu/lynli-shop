import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/product/:id', name: 'product', component: () => import('@/views/ProductDetailView.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  { path: '/auth', name: 'auth', component: () => import('@/views/AuthView.vue') },
  { path: '/pay', name: 'pay', component: () => import('@/views/PayView.vue') },
  { path: '/success', name: 'success', component: () => import('@/views/PaySuccessView.vue') },
  { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// ===== 绝对强硬的路由守卫 =====
router.beforeEach((to, from, next) => {
  // 尝试从本地拿 token（兼容不同字段名）
  const token = localStorage.getItem('token') || localStorage.getItem('access_token')
  
  if (to.path !== '/auth' && !token) {
    // 没登录，去哪都给你踢回登录页
    next('/auth')
  } else if (to.path === '/auth' && token) {
    // 已登录还想去登录页，踢回首页
    next('/')
  } else {
    // 正常放行
    next()
  }
})

export default router
