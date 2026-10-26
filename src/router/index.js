import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/auth', name: 'auth', component: () => import('@/views/AuthView.vue') },
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/product/:id', name: 'product', component: () => import('@/views/ProductDetailView.vue') },
  { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/auth' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局白名单，只有 /auth 不需要登录
const whiteList = ['/auth']

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token === 'undefined' || token === 'null') localStorage.removeItem('token')
  
  if (token) {
    if (to.path === '/auth') {
      next('/') // 有 token 就不去登录页
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next() // 白名单直接放行
    } else {
      next('/auth') // 没 token 强制踢回登录页
    }
  }
})

export default router
