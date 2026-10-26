<template>
  <div class="card" @click="goDetail">
    <div class="img-wrap">
      <!-- 取消灰色骨架屏，直接给个浅色背景，图片加载出来直接显示 -->
      <img
        :src="product.image"
        :alt="product.title"
        loading="lazy"
        @error="handleError"
        class="fade-in"
      />
    </div>
    <div class="info">
      <h3 class="title">{{ product.title || product.name }}</h3>
      <p class="category" v-if="product.category">{{ product.category }}</p>
      <div class="bottom">
        <span class="price">{{ formatPrice(product.price) }}</span>
        <span class="sold">已售 {{ product.sold || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { formatPrice } from '@/utils/format'

const props = defineProps({
  product: { type: Object, required: true }
})

const router = useRouter()

const goDetail = () => {
  if (!props.product.id) return
  router.push(`/product/${props.product.id}`)
}

const handleError = (e) => {
  // 图片加载失败时，换成一张默认占位图
  e.target.src = 'https://img.yisoujiasu.de5.net/images/spider/202610/b055c8aebde14fd9b157961e7ff1f8f9.jpg?x-oss-process=image/resize,w_500/quality,q_80'
}
</script>

<style scoped>
.card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); cursor: pointer; display: flex; flex-direction: column; }
.img-wrap { width: 100%; aspect-ratio: 1 / 1; position: relative; background: #f1f5f9; overflow: hidden; }
.img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* 图片平滑淡入，消除生硬的加载感 */
.fade-in { animation: fadeIn 0.5s ease-in-out; }
@keyframes fadeIn { from { opacity: 0.5; } to { opacity: 1; } }

.info { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.title { font-size: 14px; color: #1e293b; font-weight: 600; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; line-height: 1.4; height: 39px; }
.category { font-size: 12px; color: #3b82f6; background: #eff6ff; display: inline-block; padding: 2px 6px; border-radius: 4px; margin: 0; width: fit-content; }
.bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4px; }
.price { font-size: 16px; font-weight: bold; color: #3b82f6; }
.sold { font-size: 12px; color: #94a3b8; }
</style>
