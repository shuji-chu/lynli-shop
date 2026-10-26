<template>
  <div class="container home">
    <section class="hero">
      <h1 class="gold-text">探索边界 · 私人愉悦</h1>
      <p>高端情趣用品甄选 · 私密发货 · 全球好物直达</p>
    </section>

    <div class="cats" v-if="categories.length">
      <button class="cat" :class="{ active: activeCat === '' }" @click="activeCat = ''">
        全部
      </button>
      <button
        v-for="c in categories"
        :key="c"
        class="cat"
        :class="{ active: activeCat === c }"
        @click="activeCat = c"
      >
        {{ c }}
      </button>
    </div>

    <div v-if="loading" class="grid">
      <SkeletonCard v-for="n in 8" :key="n" />
    </div>
    <div v-else-if="!filtered.length" class="empty">
      <p>暂无商品，请稍后再来～</p>
    </div>
    <div v-else class="grid">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { getProducts } from '@/api/product'

const products = ref([])
const loading = ref(true)
const activeCat = ref('')
const categories = ref([])

// 后端返回形态不确定时统一归一化：裸数组 / {list} / {items} / {data} / {products}
function normalize(res) {
  if (Array.isArray(res)) return res
  if (res && Array.isArray(res.list)) return res.list
  if (res && Array.isArray(res.items)) return res.items
  if (res && Array.isArray(res.data)) return res.data
  if (res && Array.isArray(res.products)) return res.products
  return []
}

const filtered = computed(() => {
  if (!activeCat.value) return products.value
  return products.value.filter((p) => (p.category || p.cat || '') === activeCat.value)
})

function buildCategories(list) {
  const set = new Set()
  list.forEach((p) => {
    const c = p.category || p.cat
    if (c) set.add(c)
  })
  categories.value = [...set]
}

onMounted(async () => {
  try {
    const res = await getProducts()
    const list = normalize(res)
    products.value = list
    buildCategories(list)
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home {
  padding-top: 24px;
}
.hero {
  text-align: center;
  padding: 30px 0 26px;
}
.hero h1 {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 1px;
}
.hero p {
  margin-top: 12px;
  font-size: 14px;
  color: var(--text-2);
}
.cats {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 0 18px;
  margin-bottom: 4px;
}
.cat {
  flex: 0 0 auto;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 14px;
  color: var(--text-2);
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s;
}
.cat.active {
  color: #1a1206;
  background: linear-gradient(135deg, var(--gold-bright), var(--gold));
  border-color: var(--gold);
  font-weight: 600;
}
.grid {
  column-count: 2;
  column-gap: 12px;
}
.grid > * {
  break-inside: avoid;
  margin-bottom: 12px;
}
.empty {
  text-align: center;
  padding: 80px 0;
  color: var(--text-3);
}
@media (min-width: 768px) {
  .hero h1 {
    font-size: 44px;
  }
  .grid {
    column-count: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 18px;
  }
  .grid > * {
    margin-bottom: 0;
  }
}
</style>
