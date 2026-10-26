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

export default router
