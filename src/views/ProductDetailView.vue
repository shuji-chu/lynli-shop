<template>
  <div class="detail-page" v-if="product">
    <!-- 顶部返回按钮（悬浮在图片上） -->
    <div class="nav-bar">
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
    </div>

    <!-- 顶部大图 -->
    <div class="img-wrap">
      <img :src="product.image" alt="商品大图" @error="handleImgError" />
    </div>

    <!-- 核心信息区 -->
    <div class="info-card">
      <div class="price-row">
        <span class="price">{{ formatPrice(product.price) }}</span>
        <span class="sold">已售 {{ product.sold || 0 }} 件</span>
      </div>
      <h1 class="title">{{ product.title || product.name }}</h1>
      <p class="subtitle">{{ product.subtitle || '高端甄选 · 保密发货 · 隐私包装' }}</p>
      
      <div class="tags">
        <span class="tag" v-if="product.category">{{ product.category }}</span>
        <span class="tag">现货秒发</span>
        <span class="tag">正品保障</span>
      </div>
    </div>

    <!-- 规格与数量选择 -->
    <div class="spec-card">
      <div class="spec-item">
        <span class="label">购买数量</span>
        <div class="stepper">
          <button @click="qty > 1 && qty--">−</button>
          <span>{{ qty }}</span>
          <button @click="qty++">+</button>
        </div>
      </div>
      <div class="spec-item">
        <span class="label">配送至</span>
        <span class="value">默认地址 (顺丰包邮)</span>
      </div>
    </div>

    <!-- 商品详情图文区 -->
    <div class="desc-card">
      <div class="desc-title">
        <span></span>
        <h3>商品详情</h3>
        <span></span>
      </div>
      <div class="desc-content" v-html="product.detail || '暂无更多图文介绍'"></div>
    </div>

    <!-- 底部悬浮操作栏 -->
    <div class="bottom-bar">
      <div class="icon-btn" @click="goHome">
        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>首页</span>
      </div>
      <div class="icon-btn" @click="goCart">
        <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.5"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2l2.2 11.2a1.2 1.2 0 0 0 1.2 1h9.3a1.2 1.2 0 0 0 1.2-.95L21 7H6" /></svg>
        <span>购物车</span>
        <span class="badge" v-if="totalCount > 0">{{ totalCount }}</span>
      </div>
      
      <div class="action-btns">
        <button class="add-cart" @click="handleAddCart">加入购物车</button>
        <button class="buy-now" @click="handleBuyNow">立即购买</button>
      </div>
    </div>
  </div>

  <!-- 加载状态 -->
  <div v-else class="loading-page">
    <div class="spinner"></div>
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { addToCart, totalCount } from '@/store/cart'
import { formatPrice } from '@/utils/format'
import { Toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const qty = ref(1)

const handleImgError = (e) => {
  e.target.src = 'https://img.yisoujiasu.de5.net/images/spider/202610/b055c8aebde14fd9b157961e7ff1f8f9.jpg?x-oss-process=image/resize,w_500/quality,q_80'
}

onMounted(async () => {
  try {
    const res = await getProductDetail(route.params.id)
    product.value = res.data || res
  } catch (e) {
    Toast.error('商品加载失败，请返回重试')
    router.replace('/shop')
  }
})

function goHome() { router.push('/shop') }
function goCart() { router.push('/cart') }

const handleAddCart = () => {
  // 注意：这里把 qty 传进去
  addToCart(product.value, qty.value)
  Toast.success('已成功加入购物车')
}

const handleBuyNow = () => {
  addToCart(product.value, qty.value)
  router.push('/cart')
}
</script>

<style scoped>
.detail-page { padding-bottom: 80px; background: #f5f7fa; min-height: 100vh; }

/* 悬浮返回按钮 */
.nav-bar { position: fixed; top: 0; left: 0; right: 0; height: 56px; z-index: 100; display: flex; align-items: center; padding: 0 16px; background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%); pointer-events: none; }
.back-btn { background: rgba(0,0,0,0.3); border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); pointer-events: auto; cursor: pointer; }

/* 顶部大图 */
.img-wrap { width: 100%; aspect-ratio: 1/1; background: #fff; }
.img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* 信息卡片 */
.info-card { background: #fff; padding: 16px; margin-bottom: 12px; }
.price-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
.price { font-size: 28px; font-weight: 900; color: #ef4444; }
.sold { font-size: 13px; color: #94a3b8; }
.title { font-size: 18px; color: #1e293b; margin: 0 0 8px; font-weight: bold; line-height: 1.4; }
.subtitle { font-size: 13px; color: #64748b; margin: 0 0 12px; }
.tags { display: flex; gap: 8px; }
.tag { background: #eff6ff; color: #3b82f6; font-size: 11px; padding: 3px 8px; border-radius: 4px; }

/* 规格选择 */
.spec-card { background: #fff; padding: 16px; margin-bottom: 12px; }
.spec-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
.spec-item:last-child { border-bottom: none; padding-bottom: 0; }
.spec-item:first-child { padding-top: 0; }
.label { font-size: 14px; color: #64748b; }
.value { font-size: 14px; color: #1e293b; }
.stepper { display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.stepper button { background: #f8fafc; border: none; width: 32px; height: 32px; font-size: 18px; color: #334155; cursor: pointer; }
.stepper span { width: 44px; text-align: center; font-size: 15px; color: #1e293b; font-weight: 500; }

/* 图文详情 */
.desc-card { background: #fff; padding: 16px; margin-bottom: 20px; }
.desc-title { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px; }
.desc-title span { width: 30px; height: 1px; background: #cbd5e1; }
.desc-title h3 { font-size: 15px; color: #1e293b; margin: 0; }
.desc-content { font-size: 14px; color: #475569; line-height: 1.8; }
.desc-content img { max-width: 100%; border-radius: 8px; margin-top: 10px; }

/* 底部悬浮操作栏 */
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 64px; background: #fff; display: flex; align-items: center; padding: 0 16px; border-top: 1px solid #f1f5f9; z-index: 100; }
.icon-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 10px; color: #64748b; margin-right: 20px; cursor: pointer; position: relative; }
.icon-btn svg { width: 22px; height: 22px; }
.badge { position: absolute; top: -4px; right: -8px; background: #ef4444; color: #fff; font-size: 10px; min-width: 16px; height: 16px; line-height: 16px; text-align: center; border-radius: 8px; padding: 0 4px; }

.action-btns { flex: 1; display: flex; gap: 10px; justify-content: flex-end; }
.add-cart, .buy-now { border: none; padding: 0 20px; height: 44px; border-radius: 22px; font-size: 15px; font-weight: bold; cursor: pointer; }
.add-cart { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; }
.buy-now { background: linear-gradient(135deg, #3b82f6, #1e3a8a); color: #fff; box-shadow: 0 4px 10px rgba(59,130,246,0.3); }

/* 加载动画 */
.loading-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; color: #64748b; }
.spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
