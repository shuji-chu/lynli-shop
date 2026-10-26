<template>
  <div class="container detail-page" v-if="product">
    <div class="img-wrap">
      <img :src="product.image" alt="商品图" />
    </div>
    <div class="info-card">
      <div class="price-row">
        <span class="price">{{ formatPrice(product.price) }}</span>
        <span class="sold">已售 {{ product.sold || 0 }}</span>
      </div>
      <h1 class="title">{{ product.title }}</h1>
      <p class="subtitle">{{ product.subtitle || '甄选好物 · 私密发货' }}</p>
      <div class="tags">
        <span class="tag">{{ product.category }}</span>
        <span class="tag">现货</span>
        <span class="tag">保密发货</span>
      </div>
    </div>
    
    <div class="desc-card">
      <h3>商品详情</h3>
      <div class="desc-content" v-html="product.detail || '暂无详情'"></div>
    </div>

    <div class="bottom-bar">
      <button class="add-cart" @click="handleAddCart">加入购物车</button>
      <button class="buy-now" @click="handleBuyNow">立即购买</button>
    </div>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '@/api/product'
import { addToCart } from '@/store/cart'
import { formatPrice } from '@/utils/format'
import { Toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const product = ref(null)

onMounted(async () => {
  try {
    const res = await getProductDetail(route.params.id)
    product.value = res.data || res
  } catch (e) {
    Toast.error('商品加载失败')
  }
})

const handleAddCart = () => {
  addToCart(product.value)
  Toast.success('已加入购物车')
}

const handleBuyNow = () => {
  addToCart(product.value)
  router.push('/cart')
}
</script>

<style scoped>
.detail-page { padding-top: 60px; padding-bottom: 80px; background: #f8fafc; min-height: 100vh; }
.img-wrap { width: 100%; aspect-ratio: 1/1; background: #fff; }
.img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.info-card { background: #fff; padding: 16px; margin-bottom: 12px; }
.price-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
.price { font-size: 24px; font-weight: bold; color: #3b82f6; }
.sold { font-size: 13px; color: #94a3b8; }
.title { font-size: 18px; color: #1e293b; margin: 0 0 8px; line-height: 1.4; }
.subtitle { font-size: 14px; color: #64748b; margin: 0 0 12px; }
.tags { display: flex; gap: 8px; }
.tag { background: #eff6ff; color: #3b82f6; font-size: 12px; padding: 2px 8px; border-radius: 4px; }
.desc-card { background: #fff; padding: 16px; }
.desc-card h3 { font-size: 15px; color: #1e293b; margin: 0 0 12px; border-left: 3px solid #3b82f6; padding-left: 8px; }
.desc-content { font-size: 14px; color: #475569; line-height: 1.6; }
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 60px; background: #fff; display: flex; padding: 8px 16px; gap: 12px; border-top: 1px solid #eee; z-index: 100; }
.add-cart { flex: 1; background: #eff6ff; color: #3b82f6; border: 1px solid #3b82f6; border-radius: 20px; font-size: 15px; font-weight: bold; }
.buy-now { flex: 1; background: #3b82f6; color: #fff; border: none; border-radius: 20px; font-size: 15px; font-weight: bold; }
.loading { text-align: center; padding: 100px 0; color: #94a3b8; }
</style>
