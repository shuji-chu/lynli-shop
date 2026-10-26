<template>
  <div class="container detail" v-if="loading">
    <div class="skel-img skeleton"></div>
    <div class="skel-info">
      <div class="skeleton line w70"></div>
      <div class="skeleton line w40"></div>
      <div class="skeleton line w90"></div>
      <div class="skeleton price-skel"></div>
    </div>
  </div>

  <div class="container detail" v-else-if="product">
    <div class="gallery">
      <div class="main-img">
        <div v-if="!imgLoaded" class="skeleton img-skel"></div>
        <img
          v-show="imgLoaded"
          :src="currentImage"
          :alt="product.title || product.name"
          loading="lazy"
          @load="imgLoaded = true"
          @error="imgLoaded = true"
        />
      </div>
      <div class="thumbs" v-if="gallery.length > 1">
        <button
          v-for="(img, i) in gallery"
          :key="i"
          class="thumb"
          :class="{ active: i === current }"
          @click="current = i"
        >
          <img :src="img" alt="缩略图" loading="lazy" />
        </button>
      </div>
    </div>

    <div class="info">
      <h1 class="title">{{ product.title || product.name }}</h1>
      <p v-if="product.desc || product.subtitle" class="desc">
        {{ product.desc || product.subtitle }}
      </p>
      <p v-if="product.category || product.cat" class="cat-tag">
        {{ product.category || product.cat }}
      </p>

      <div class="price-row">
        <span class="price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.origin_price" class="origin">{{
          formatPrice(product.origin_price)
        }}</span>
      </div>

      <div class="qty-row">
        <span class="label">数量</span>
        <div class="stepper">
          <button @click="dec">−</button>
          <input v-model.number="qty" type="number" min="1" @input="fixQty" />
          <button @click="inc">+</button>
        </div>
      </div>

      <div class="ops">
        <button class="btn-ghost" @click="add">加入购物车</button>
        <button class="btn-gold" @click="buyNow">立即购买</button>
      </div>

      <div class="meta">
        <p>· 私密包装发货，保护您的隐私</p>
        <p>· 正品保障，支持售后</p>
      </div>
    </div>
  </div>

  <div class="container empty" v-else>
    <p>商品不存在或已下架</p>
    <router-link to="/" class="btn-ghost">返回首页</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail, getProducts } from '@/api/product'
import { addToCart } from '@/store/cart'
import { Toast } from '@/utils/toast'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)
const qty = ref(1)
const current = ref(0)
const imgLoaded = ref(false)

const gallery = computed(() => {
  const p = product.value
  if (!p) return []
  const imgs = []
  if (p.image || p.image_url || p.cover) imgs.push(p.image || p.image_url || p.cover)
  if (Array.isArray(p.images)) imgs.push(...p.images)
  if (Array.isArray(p.gallery)) imgs.push(...p.gallery)
  return [...new Set(imgs.filter(Boolean))]
})
const currentImage = computed(() => gallery.value[current.value] || '')

function fixQty() {
  qty.value = Math.max(1, Math.floor(qty.value) || 1)
}
function inc() {
  qty.value++
}
function dec() {
  if (qty.value > 1) qty.value--
}

function add() {
  addToCart(product.value, qty.value)
  Toast.success('已加入购物车')
}
function buyNow() {
  addToCart(product.value, qty.value)
  router.push({ name: 'cart' })
}

async function load() {
  const id = route.params.id
  try {
    const res = await getProductDetail(id)
    if (res && (res.id != null || res.title || res.name)) {
      product.value = res
    } else {
      // 兼容：详情接口不支持时回退到列表查找
      const listRes = await getProducts()
      const list = Array.isArray(listRes)
        ? listRes
        : listRes?.list || listRes?.items || listRes?.data || []
      product.value = list.find((p) => String(p.id) === String(id)) || null
    }
  } catch {
    product.value = null
  } finally {
    loading.value = false
    current.value = 0
    imgLoaded.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.detail {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
  padding-top: 24px;
}
.gallery .main-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
}
.gallery .main-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-skel {
  width: 100%;
  height: 100%;
  border-radius: 0;
}
.thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow-x: auto;
}
.thumb {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  flex: 0 0 auto;
  opacity: 0.6;
  transition: opacity 0.2s, border-color 0.2s;
}
.thumb.active {
  opacity: 1;
  border-color: var(--gold);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.title {
  font-size: 24px;
  font-weight: 700;
}
.desc {
  margin-top: 10px;
  color: var(--text-2);
  font-size: 14px;
}
.cat-tag {
  display: inline-block;
  margin-top: 12px;
  font-size: 12px;
  color: var(--gold);
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  padding: 3px 10px;
}
.price-row {
  margin-top: 18px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.price {
  font-size: 28px;
  font-weight: 800;
  color: var(--gold-bright);
}
.origin {
  font-size: 15px;
  color: var(--text-3);
  text-decoration: line-through;
}
.qty-row {
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.label {
  font-size: 14px;
  color: var(--text-2);
}
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.stepper button {
  width: 40px;
  height: 40px;
  font-size: 20px;
  color: var(--text-1);
  background: rgba(255, 255, 255, 0.04);
}
.stepper button:active {
  background: rgba(212, 175, 107, 0.16);
}
.stepper input {
  width: 56px;
  height: 40px;
  text-align: center;
  border: none;
  background: transparent;
  color: var(--text-1);
  font-size: 16px;
  -moz-appearance: textfield;
}
.stepper input::-webkit-outer-spin-button,
.stepper input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.ops {
  margin-top: 26px;
  display: flex;
  gap: 14px;
}
.ops .btn-ghost,
.ops .btn-gold {
  flex: 1;
}
.meta {
  margin-top: 26px;
  font-size: 13px;
  color: var(--text-3);
  line-height: 1.9;
}
.skel-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
}
.skel-info {
  padding: 10px 0;
}
.skel-info .line {
  height: 16px;
  margin-bottom: 14px;
}
.skel-info .price-skel {
  height: 26px;
  width: 36%;
  margin-top: 20px;
}
.empty {
  text-align: center;
  padding: 80px 0;
  color: var(--text-3);
}
.empty .btn-ghost {
  margin-top: 16px;
}
@media (min-width: 768px) {
  .detail {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 40px;
    align-items: start;
  }
  .title {
    font-size: 28px;
  }
}
</style>
