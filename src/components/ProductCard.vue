<template>
  <div class="card" @click="goDetail">
    <div class="img-wrap">
      <!-- 极简骨架屏 -->
      <div v-if="!loaded" class="skeleton"></div>
      <!-- 真实图片，带懒加载和淡入 -->
      <img
        v-show="loaded"
        :src="product.image"
        :alt="product.title"
        loading="lazy"
        @load="loaded = true"
        @error="handleError"
        class="fade-in"
      />
      <!-- 加载失败兜底 -->
      <div v-if="error" class="fallback-img">
        <span class="icon">📦</span>
        <span>图片加载中</span>
      </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatPrice } from '@/utils/format'

const props = defineProps({
  product: { type: Object, required: true }
})

const router = useRouter()
const loaded = ref(false)
const error = ref(false)

const goDetail = () => {
  router.push(`/product/${props.product.id}`)
}

const handleError = () => {
  error.value = true
  loaded.value = true
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.img-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  background: #f8fafc;
  overflow: hidden;
}
.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* 平滑淡入动画 */
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.skeleton {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}
@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.fallback-img {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  color: #94a3b8;
  font-size: 13px;
  gap: 8px;
}
.fallback-img .icon { font-size: 28px; }
.info { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.title {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  line-height: 1.4;
  height: 39px;
}
.category {
  font-size: 12px;
  color: #3b82f6;
  background: #eff6ff;
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  margin: 0;
  width: fit-content;
}
.bottom { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4px; }
.price { font-size: 16px; font-weight: bold; color: #3b82f6; }
.sold { font-size: 12px; color: #94a3b8; }
</style>
