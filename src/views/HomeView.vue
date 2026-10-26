<template>
  <div class="container home" @click="closeHistory">
    <div class="search-wrap" @click.stop>
      <div class="search-box">
        <input v-model="keyword" type="text" placeholder="搜索商品 / 分类..." @keyup.enter="handleSearch" />
      </div>
    </div>

    <!-- 轮播图组件 -->
    <BannerSwiper :banners="bannerList" />

    <div class="category-nav">
      <div class="cat-item" v-for="cat in categories" :key="cat.name" @click="selectCategory(cat.name)">
        <div class="cat-icon" :style="{ background: cat.color }"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg></div>
        <span>{{ cat.name }}</span>
      </div>
    </div>

    <div class="grid" v-if="filteredList.length">
      <ProductCard v-for="p in filteredList" :key="p.id" :product="p" />
    </div>
    <div v-else-if="loading" class="loading-text">加载中...</div>
    <div v-else class="empty">暂无商品</div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import BannerSwiper from '@/components/BannerSwiper.vue'
import { getProducts } from '@/api/product'
import request from '@/api/request'

defineOptions({ name: 'HomeView' });
const products = ref([]), loading = ref(false), keyword = ref(''), activeCategory = ref(''), bannerList = ref([])
const categories = ref([{ name: '全部', color: '#3b82f6' }, { name: '情趣玩具', color: '#ec4899' }, { name: '情趣内衣', color: '#8b5cf6' }, { name: '情趣用品', color: '#f59e0b' }, { name: '情侣共震', color: '#10b981' }])

const closeHistory = () => {}
function selectCategory(catName) { activeCategory.value = catName === '全部' ? '' : catName }
const filteredList = computed(() => {
  let list = products.value
  if (activeCategory.value) list = list.filter(p => p.category === activeCategory.value)
  if (keyword.value.trim()) list = list.filter(p => (p.title && p.title.includes(keyword.value)) || (p.name && p.name.includes(keyword.value)))
  return list
})
onMounted(async () => {
  loading.value = true
  try {
    const res = await getProducts({ page: 1, size: 20 })
    products.value = Array.isArray(res) ? res : (res?.data || [])
    const bRes = await request.get('/api/v1/shop/banners')
    bannerList.value = bRes.data || bRes || []
  } catch (e) { console.warn(e) } finally { loading.value = false }
})
</script>
<style scoped>
.home {  padding-bottom: 80px; min-height: 100vh; background: #f8fafc; }
.search-wrap { padding: 12px 16px; }
.search-box { background: #fff; padding: 10px 16px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.search-box input { width: 100%; border: none; outline: none; font-size: 15px; background: transparent; }
.category-nav { display: flex; overflow-x: auto; padding: 0 16px 16px; gap: 16px; scrollbar-width: none; }
.cat-item { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
.cat-icon { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.cat-icon svg { width: 22px; height: 22px; }
.cat-item span { font-size: 12px; color: #475569; font-weight: 500; }
.grid { column-count: 2; column-gap: 12px; padding: 0 16px; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
.loading-text, .empty { text-align: center; padding: 40px 0; color: #94a3b8; }
</style>
