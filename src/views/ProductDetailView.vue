<template>
  <div class="detail-page" v-if="product">
    <div class="nav-bar">
      <button class="back-btn" @click="$router.back()"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
    </div>

    <!-- 多图滑动轮播 -->
    <div class="img-swiper" ref="swiperRef" @scroll="onScroll">
      <div class="img-wrap" v-for="(img, idx) in imgList" :key="idx">
        <img :src="img" />
      </div>
    </div>
    <!-- 轮播指示点 -->
    <div class="dots" v-if="imgList.length > 1">
      <span v-for="(img, idx) in imgList" :key="idx" :class="{ active: currentImg === idx }"></span>
    </div>

    <div class="info-card">
      <div class="price-row"><span class="price">{{ formatPrice(product.price) }}</span><span class="sold">已售 {{ product.sold || 0 }} 件</span></div>
      <h1 class="title">{{ product.title || product.name }}</h1>
    </div>

    <!-- 私密评论区 -->
    <div class="section">
      <h3>私密评价 ({{ reviews.length }})</h3>
      <div class="review-list">
        <div v-for="(r, i) in reviews" :key="i" class="review-item">
          <div class="r-head"><span>匿名用户 ({{ r.short_id }}) <span class="ip-tag">{{ r.city || "未知" }}</span></span><span>⭐{{ r.rating }}</span></div>
          <p class="r-content">{{ r.content }}</p>
        </div>
        <p v-if="reviews.length === 0" style="text-align: center; color: #94a3b8; font-size: 13px;">暂无评价，来抢首评～</p>
      </div>
      
      <!-- 发评论 -->
      <div class="review-input">
        <input v-model="newReview" placeholder="写下您的私密使用感受..." />
        <button @click="submitReview">发布</button>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="add-cart" @click="handleAddCart">加入购物车</button>
      <button class="buy-now" @click="handleBuyNow">立即购买</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { addToCart } from '@/store/cart'
import { formatPrice } from '@/utils/format'
import { Toast } from '@/utils/toast'
import request from '@/api/request'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const reviews = ref([])
const newReview = ref('')
const swiperRef = ref(null)
const currentImg = ref(0)

const imgList = computed(() => {
  if (product.value.images) {
    try { return JSON.parse(product.value.images) } catch(e) {}
  }
  return [product.value.image]
})

const onScroll = () => {
  if (!swiperRef.value) return
  const idx = Math.round(swiperRef.value.scrollLeft / swiperRef.value.offsetWidth)
  currentImg.value = idx
}

onMounted(async () => {
  const res = await getProductDetail(route.params.id)
  product.value = res.data || res
  
  try {
    const r = await request.get('/api/v1/shop/reviews', { params: { product_id: route.params.id } })
    reviews.value = r.data || []
  } catch (e) { console.warn(e) }
})

const submitReview = async () => {
  if (!newReview.value.trim()) return
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  try {
    await request.post('/api/v1/shop/reviews', {
      product_id: product.value.id,
      short_id: userInfo.short_id || '10001',
      content: newReview.value
    })
    Toast.success('评价已发布')
    newReview.value = ''
    const r = await request.get('/api/v1/shop/reviews', { params: { product_id: route.params.id } })
    reviews.value = r.data || []
  } catch (e) { Toast.error('发布失败') }
}

const handleAddCart = () => { addToCart(product.value); Toast.success('已加购'); }
const handleBuyNow = () => { addToCart(product.value); router.push('/cart'); }
</script>

<style scoped>
.detail-page { padding-bottom: 80px; background: #f5f7fa; min-height: 100vh; }
.nav-bar { position: fixed; top: 0; left: 0; right: 0; height: 56px; z-index: 100; padding: 0 16px; pointer-events: none; }
.back-btn { background: rgba(0,0,0,0.3); border: none; width: 36px; height: 36px; border-radius: 50%; pointer-events: auto; }

.img-swiper { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; height: 100vw; max-height: 500px; }
.img-swiper::-webkit-scrollbar { display: none; }
.img-wrap { flex: 0 0 100%; scroll-snap-align: start; }
.img-wrap img { width: 100%; height: 100%; object-fit: cover; }

.dots { position: absolute; top: 90vw; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; z-index: 10; }
.dots span { width: 6px; height: 6px; background: rgba(255,255,255,0.5); border-radius: 50%; }
.dots span.active { width: 16px; background: #fff; border-radius: 3px; }

.info-card, .section { background: #fff; padding: 16px; margin-bottom: 12px; }
.price-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
.price { font-size: 26px; font-weight: 900; color: #ef4444; }
.title { font-size: 18px; margin: 0; }
.section h3 { font-size: 15px; margin: 0 0 12px; border-left: 3px solid #3b82f6; padding-left: 8px; }

.review-item { border-bottom: 1px solid #f1f5f9; padding: 10px 0; }
.r-head { display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; margin-bottom: 6px; }
.r-content { font-size: 14px; color: #334155; margin: 0; }
.review-input { display: flex; gap: 10px; margin-top: 15px; }
.review-input input { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; font-size: 13px; background: #f8fafc; outline: none; }
.review-input button { background: #3b82f6; color: #fff; border: none; border-radius: 8px; padding: 0 16px; font-size: 13px; }

.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 64px; background: #fff; display: flex; padding: 8px 16px; gap: 12px; z-index: 100; }
.add-cart, .buy-now { flex: 1; border-radius: 20px; border: none; font-size: 15px; font-weight: bold; }
.add-cart { background: #eff6ff; color: #3b82f6; border: 1px solid #3b82f6; }
.buy-now { background: #3b82f6; color: #fff; }

.ip-tag { font-size: 10px; background: #f1f5f9; color: #64748b; padding: 1px 4px; border-radius: 4px; margin-left: 4px; font-weight: normal; }

</style>
