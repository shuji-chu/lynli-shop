<template>
  <div class="detail-page" v-if="product">
    <!-- 悬浮返回 -->
    <div class="nav-bar">
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
    </div>

    <!-- 🖼️ 1. 多图自动轮播 -->
    <div class="img-swiper" ref="swiperRef" @scroll="onScroll">
      <div class="img-wrap" v-for="(img, idx) in imgList" :key="idx">
        <img :src="img" />
      </div>
    </div>
    <div class="dots" v-if="imgList.length > 1">
      <span v-for="(img, idx) in imgList" :key="idx" :class="{ active: currentImg === idx }"></span>
    </div>

    <!-- 💰 2. 核心信息 -->
    <div class="info-card">
      <div class="price-row">
        <span class="price">{{ formatPrice(product.price) }}</span>
        <span class="sold">已售 {{ product.sold || 0 }} 件</span>
      </div>
      <h1 class="title">{{ product.title || product.name }}</h1>
      <p class="category" v-if="product.category">{{ product.category }}</p>
    </div>

    <!-- 📝 3. 商品介绍（补全你缺失的） -->
    <div class="section desc-section">
      <h3>商品详情</h3>
      <div class="desc-content" v-html="product.detail || '暂无详细图文介绍'"></div>
    </div>

    <!-- 💬 4. 私密评价展示区 -->
    <div class="section review-section">
      <div class="section-header" @click="openReviewModal">
        <h3>私密评价 ({{ reviews.length }})</h3>
        <span class="all-reviews">查看全部 &gt;</span>
      </div>
      
      <div v-if="reviews.length === 0" class="empty-review">
        暂无评价，来抢首评～
      </div>
      
      <div v-else class="review-list">
        <div v-for="(r, i) in reviews.slice(0, 3)" :key="i" class="review-item">
          <div class="r-head">
            <div class="r-user">
              <span class="id-tag">ID:{{ r.short_id }}</span>
              <span class="ip-tag">{{ r.city || '未知' }}</span>
            </div>
            <span class="r-stars">⭐⭐⭐⭐⭐</span>
          </div>
          <p class="r-content">{{ r.content }}</p>
        </div>
      </div>
    </div>

    <!-- 🚨 5. 底部操作栏 -->
    <div class="bottom-bar">
      <button class="icon-btn" @click="$router.push('/cart')">
        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.5"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2l2.2 11.2a1.2 1.2 0 0 0 1.2 1h9.3a1.2 1.2 0 0 0 1.2-.95L21 7H6" /></svg>
        <span>购物车</span>
      </button>
      <div class="action-btns">
        <button class="add-cart" @click="handleAddCart">加入购物车</button>
        <button class="buy-now" @click="handleBuyNow">立即购买</button>
      </div>
    </div>

    <!-- 🚨 6. 发评价弹窗（解决遮挡问题） -->
    <div class="modal-mask" v-if="showReviewModal" @click.self="showReviewModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>写下您的私密评价</h3>
          <button @click="showReviewModal = false">✕</button>
        </div>
        <textarea v-model="newReview" placeholder="这款产品体验如何？您的评价将匿名展示..." rows="4"></textarea>
        <button class="submit-review-btn" @click="submitReview">发布评价</button>
      </div>
    </div>
  </div>

  <div v-else class="loading-page">加载中...</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
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
const swiperRef = ref(null)
const currentImg = ref(0)
const showReviewModal = ref(false)
const newReview = ref('')
let autoSlideTimer = null

// 🚨 多图解析
const imgList = computed(() => {
  if (!product.value) return []
  if (product.value.images) {
    try {
      const arr = JSON.parse(product.value.images)
      if (arr.length > 0) return arr
    } catch(e) {}
  }
  return [product.value.image || 'https://img.yisoujiasu.de5.net/images/spider/202610/b055c8aebde14fd9b157961e7ff1f8f9.jpg']
})

// 监听手指滑动
const onScroll = () => {
  if (!swiperRef.value) return
  const idx = Math.round(swiperRef.value.scrollLeft / swiperRef.value.offsetWidth)
  currentImg.value = idx
}

// 🚨 自动轮播逻辑
const startAutoSlide = () => {
  if (imgList.value.length <= 1) return
  autoSlideTimer = setInterval(() => {
    if (!swiperRef.value) return
    let nextIdx = (currentImg.value + 1) % imgList.value.length
    swiperRef.value.scrollTo({
      left: nextIdx * swiperRef.value.offsetWidth,
      behavior: 'smooth'
    })
  }, 3000)
}

onMounted(async () => {
  try {
    const res = await getProductDetail(route.params.id)
    product.value = res.data || res
    
    // 获取评价
    const r = await request.get('/api/v1/shop/reviews', { params: { product_id: route.params.id } })
    reviews.value = r.data || []
    
    // 启动自动轮播
    startAutoSlide()
  } catch (e) {
    Toast.error('商品加载失败')
  }
})

onUnmounted(() => {
  if (autoSlideTimer) clearInterval(autoSlideTimer)
})

const openReviewModal = () => {
  if (!localStorage.getItem('token')) return Toast.error('请先登录')
  showReviewModal.value = true
}

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
    showReviewModal.value = false
    // 刷新评价
    const r = await request.get('/api/v1/shop/reviews', { params: { product_id: route.params.id } })
    reviews.value = r.data || []
  } catch (e) {
    Toast.error('发布失败')
  }
}

const handleAddCart = () => { addToCart(product.value); Toast.success('已加购'); }
const handleBuyNow = () => { addToCart(product.value); router.push('/cart'); }
</script>

<style scoped>
.detail-page { padding-bottom: 80px; background: #f5f7fa; min-height: 100vh; }
.nav-bar { position: fixed; top: 0; left: 0; right: 0; height: 56px; z-index: 100; padding: 0 16px; pointer-events: none; }
.back-btn { background: rgba(0,0,0,0.3); border: none; width: 36px; height: 36px; border-radius: 50%; pointer-events: auto; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-top: 10px; }

/* 轮播图 */
.img-swiper { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; height: 100vw; max-height: 500px; background: #fff; }
.img-swiper::-webkit-scrollbar { display: none; }
.img-wrap { flex: 0 0 100%; scroll-snap-align: start; }
.img-wrap img { width: 100%; height: 100%; object-fit: cover; }

/* 指示点 */
.dots { position: absolute; top: 90vw; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; z-index: 10; }
.dots span { width: 6px; height: 6px; background: rgba(0,0,0,0.2); border-radius: 50%; transition: all 0.3s; }
.dots span.active { width: 16px; background: #3b82f6; border-radius: 3px; }

/* 核心信息 */
.info-card { background: #fff; padding: 16px; margin-bottom: 12px; }
.price-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 10px; }
.price { font-size: 26px; font-weight: 900; color: #ef4444; }
.sold { font-size: 13px; color: #94a3b8; }
.title { font-size: 18px; margin: 0 0 8px; font-weight: bold; color: #1e293b; }
.category { font-size: 12px; color: #3b82f6; background: #eff6ff; display: inline-block; padding: 2px 8px; border-radius: 4px; margin: 0; }

/* 通用区块 */
.section { background: #fff; padding: 16px; margin-bottom: 12px; }
.section h3 { font-size: 16px; font-weight: bold; margin: 0 0 12px; border-left: 3px solid #3b82f6; padding-left: 8px; }
.desc-content { font-size: 14px; color: #475569; line-height: 1.6; }
.desc-content :deep(img) { max-width: 100%; border-radius: 8px; margin: 8px 0; }

/* 评价区 */
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-header h3 { margin: 0; border: none; padding: 0; }
.all-reviews { font-size: 13px; color: #3b82f6; cursor: pointer; }
.empty-review { text-align: center; color: #94a3b8; font-size: 13px; padding: 20px 0; }
.review-item { border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 12px; }
.review-item:last-child { border: none; margin-bottom: 0; padding-bottom: 0; }
.r-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.r-user { display: flex; gap: 6px; align-items: center; }
.id-tag { font-size: 12px; font-weight: bold; color: #1e293b; }
.ip-tag { font-size: 10px; background: #f1f5f9; color: #64748b; padding: 2px 6px; border-radius: 4px; }
.r-stars { font-size: 10px; }
.r-content { font-size: 14px; color: #334155; margin: 0; line-height: 1.5; }

/* 底部操作栏 */
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 64px; background: #fff; display: flex; align-items: center; padding: 8px 16px; gap: 12px; border-top: 1px solid #f1f5f9; z-index: 100; }
.icon-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; background: none; border: none; font-size: 10px; color: #64748b; }
.icon-btn svg { width: 22px; height: 22px; }
.action-btns { flex: 1; display: flex; gap: 10px; justify-content: flex-end; }
.add-cart, .buy-now { border: none; padding: 0 20px; height: 44px; border-radius: 22px; font-size: 15px; font-weight: bold; cursor: pointer; }
.add-cart { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; }
.buy-now { background: linear-gradient(135deg, #3b82f6, #1e3a8a); color: #fff; box-shadow: 0 4px 10px rgba(59,130,246,0.3); }

/* 发评价弹窗 */
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; z-index: 9999; }
.modal-content { width: 100%; background: #fff; border-radius: 20px 20px 0 0; padding: 20px; padding-bottom: calc(20px + env(safe-area-inset-bottom) + 60px); animation: slideUp 0.3s; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.modal-header h3 { margin: 0; font-size: 16px; font-weight: bold; }
.modal-header button { background: none; border: none; font-size: 20px; color: #94a3b8; cursor: pointer; }
textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; font-size: 14px; margin-bottom: 20px; box-sizing: border-box; background: #f8fafc; outline: none; resize: none; }
.submit-review-btn { width: 100%; background: #3b82f6; color: #fff; border: none; padding: 14px; border-radius: 20px; font-size: 16px; font-weight: bold; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.loading-page { display: flex; justify-content: center; align-items: center; height: 100vh; color: #64748b; }
</style>
