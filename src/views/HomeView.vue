<template>
  <div class="container home">
    <section class="hero">
      <h1 class="gold-text">探索边界 · 私人愉悦</h1>
      <p>高端情趣用品甄选 · 私密发货 · 全球好物直达</p>
    </section>

    <!-- 🔍 搜索框 -->
    <div class="search-wrap">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input v-model="keyword" type="text" placeholder="搜索商品 / 分类..." />
        <span v-if="keyword" class="clear-btn" @click="keyword = ''">×</span>
      </div>
    </div>

    <!-- 错误提示区 -->
    <div v-if="errorMsg" style="background: #fee2e2; color: #ef4444; padding: 15px; border-radius: 10px; margin-bottom: 15px; font-weight: bold;">
      错误原因：{{ errorMsg }}
    </div>

    <!-- 商品列表 -->
    <div class="grid" v-if="filteredList.length">
      <ProductCard v-for="p in filteredList" :key="p.id" :product="p" />
    </div>
    <div v-else-if="loading" class="loading-text">加载中...</div>
    <div v-else class="empty">
      {{ keyword ? '没有找到相关商品' : '暂无商品' }}
    </div>

    <!-- 加载更多按钮 -->
    <div class="load-more-wrap" v-if="hasMore && !loading && !keyword">
      <button class="load-more-btn" @click="loadMore">加载更多好物</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { getProducts } from '@/api/product'

const products = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const errorMsg = ref('')
const keyword = ref('') // 搜索关键词

// 🚨 前端本地搜索过滤逻辑
const filteredList = computed(() => {
  if (!keyword.value.trim()) return products.value
  const kw = keyword.value.toLowerCase().trim()
  return products.value.filter(p => 
    (p.title && p.title.toLowerCase().includes(kw)) || 
    (p.name && p.name.toLowerCase().includes(kw)) ||
    (p.category && p.category.toLowerCase().includes(kw))
  )
})

async function loadData() {
  if (loading.value) return
  loading.value = true
  errorMsg.value = ''
  
  try {
    const res = await getProducts({ page: page.value, size: 20 })
    const list = Array.isArray(res) ? res : (res?.data || [])
    
    if (list.length < 20) hasMore.value = false
    if (page.value === 1) products.value = list
    else products.value.push(...list)
  } catch (e) {
    console.error('加载失败详情:', e)
    errorMsg.value = '接口报错，请稍后再试'
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
.home { padding-top: 70px; padding-bottom: 20px; min-height: 100vh; background: #f5f7fa; }
.hero { text-align: center; padding: 20px 0; }
.hero h1 { font-size: 26px; font-weight: 800; color: #1e3a8a; margin: 0; }
.hero p { margin-top: 8px; font-size: 13px; color: #64748b; }

/* 搜索框样式 */
.search-wrap { padding: 0 16px 20px; }
.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  padding: 10px 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  border: 1px solid #e2e8f0;
}
.search-box svg { width: 18px; height: 18px; margin-right: 10px; }
.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1e293b;
  background: transparent;
}
.search-box input::placeholder { color: #94a3b8; }
.clear-btn {
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
  padding: 0 5px;
}

.grid { column-count: 2; column-gap: 12px; padding: 0 16px; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
.loading-text { text-align: center; padding: 40px; color: #94a3b8; font-size: 14px; }
.empty { text-align: center; padding: 80px 0; color: #94a3b8; }
.load-more-wrap { text-align: center; padding: 20px 0 40px; }
.load-more-btn { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 10px 30px; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: bold; }

@media (min-width: 768px) {
  .grid { column-count: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; }
  .grid > * { margin-bottom: 0; }
  .hero h1 { font-size: 34px; }
}
</style>
