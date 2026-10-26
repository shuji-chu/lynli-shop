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

router.beforeEach((to, from, next) => {
  // 🔥 强效暗门：只要网址后面带了 ?clear=1，就强制洗清所有脏数据
  if (to.query.clear === '1') {
    localStorage.clear()
    next('/auth')
    return
  }

  let token = localStorage.getItem('token')
  
  // 清洗各种奇怪的空值
  if (token === 'undefined' || token === 'null' || token === 'false' || token === '') {
    localStorage.removeItem('token')
    token = null
  }

  if (!token) {
    if (to.path === '/auth') next()
    else next('/auth')
  } else {
    if (to.path === '/auth') next('/')
    else next()
  }
})

export default router
