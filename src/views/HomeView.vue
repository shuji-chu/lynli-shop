<template>
  <div class="container home">
    <section class="hero">
      <h1 class="gold-text">探索边界 · 私人愉悦</h1>
      <p>高端情趣用品甄选 · 私密发货 · 全球好物直达</p>
    </section>

    <div class="grid" v-if="products.length">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <div v-else-if="loading" class="loading-text">加载中...</div>
    <div v-else class="empty">暂无商品</div>

    <!-- 加载更多按钮 -->
    <div class="load-more-wrap" v-if="hasMore && !loading">
      <button class="load-more-btn" @click="loadMore">加载更多好物</button>
    </div>
    <div class="loading-text" v-if="loading && products.length > 0">正在加载...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { getProducts } from '@/api/product'

const products = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

async function loadData() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getProducts({ page: page.value, size: 20 })
    const list = Array.isArray(res) ? res : (res?.data || [])
    
    if (list.length < 20) hasMore.value = false
    if (page.value === 1) products.value = list
    else products.value.push(...list)
  } catch (e) {
    console.warn('加载失败', e)
  } finally {
    loading.value = false
  }
}

function loadMore() {
  if (!hasMore.value) return
  page.value++
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.home { padding-top: 70px; padding-bottom: 20px; }
.hero { text-align: center; padding: 30px 0 20px; }
.hero h1 { font-size: 28px; font-weight: 800; color: #1e3a8a; }
.hero p { margin-top: 10px; font-size: 14px; color: #64748b; }
.grid { column-count: 2; column-gap: 12px; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
.loading-text { text-align: center; padding: 20px; color: #94a3b8; font-size: 14px; }
.empty { text-align: center; padding: 50px 0; color: #94a3b8; }
.load-more-wrap { text-align: center; padding: 20px 0 40px; }
.load-more-btn { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 10px 30px; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: bold; }
@media (min-width: 768px) {
  .grid { column-count: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; }
  .grid > * { margin-bottom: 0; }
}
</style>
