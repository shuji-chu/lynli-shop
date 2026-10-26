<template>
  <article class="card" @click="goDetail">
    <div class="img-wrap">
      <div v-if="!loaded" class="skeleton img-skel"></div>
      <img
        v-show="loaded"
        :src="product.image || product.image_url || product.cover"
        :alt="product.title || product.name"
        loading="lazy"
        @load="loaded = true"
        @error="onError"
      />
      <button class="add" @click.stop="onAdd" aria-label="加入购物车">+</button>
    </div>
    <div class="info">
      <h3 class="title">{{ product.title || product.name }}</h3>
      <p v-if="product.desc || product.subtitle" class="desc">
        {{ product.desc || product.subtitle }}
      </p>
      <div class="bottom">
        <span class="price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.tag" class="tag">{{ product.tag }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatPrice } from '@/utils/format'
import { addToCart } from '@/store/cart'
import { Toast } from '@/utils/toast'

const props = defineProps({
  product: { type: Object, required: true }
})
const router = useRouter()
const loaded = ref(false)

function onError() {
  loaded.value = true
}
function onAdd() {
  addToCart(props.product, 1)
  Toast.success('已加入购物车')
}
function goDetail() {
  router.push({ name: 'product', params: { id: props.product.id } })
}
</script>

<style scoped>
.card {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--panel);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s, box-shadow 0.35s;
}
.card:hover {
  transform: translateY(-6px);
  border-color: var(--border-strong);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}
.img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
}
.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.card:hover .img-wrap img {
  transform: scale(1.06);
}
.img-skel {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
.add {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 1;
  color: #1a1206;
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  box-shadow: 0 6px 16px rgba(212, 175, 107, 0.4);
  transition: transform 0.2s;
}
.add:active {
  transform: scale(0.9);
}
.info {
  padding: 14px 14px 18px;
}
.title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.desc {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bottom {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price {
  font-size: 18px;
  font-weight: 700;
  color: var(--gold-bright);
}
.tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 8px;
  color: var(--gold);
  border: 1px solid var(--border-strong);
}
</style>
