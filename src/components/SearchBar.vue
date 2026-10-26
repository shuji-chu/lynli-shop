<template>
  <div class="search-bar-wrapper" @click.stop>
    <div class="search-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input 
        v-model="innerKeyword" 
        type="text" 
        placeholder="搜索商品 / 分类..." 
        @keyup.enter="handleSearch" 
        @focus="showHistory = true" 
      />
      <span v-if="innerKeyword" class="clear-btn" @click="innerKeyword = ''">×</span>
    </div>
    
    <div class="history-wrap" v-if="historyList.length > 0 && showHistory && !innerKeyword">
      <div class="history-header">
        <span>搜索历史</span>
        <span class="clear-history" @click="clearHistory">清空</span>
      </div>
      <div class="history-tags">
        <span v-for="(item, index) in historyList" :key="index" class="tag" @click="clickHistory(item)">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 向父组件传递输入的值
const emit = defineEmits(['update:keyword', 'search'])
const innerKeyword = ref('')
const showHistory = ref(false)

const historyList = ref(JSON.parse(localStorage.getItem('lynli_search_history') || '[]'))

watch(innerKeyword, (val) => {
  emit('update:keyword', val)
})

function handleSearch() {
  if (!innerKeyword.value.trim()) return
  const kw = innerKeyword.value.trim()
  historyList.value = [kw, ...historyList.value.filter(i => i !== kw)].slice(0, 10)
  localStorage.setItem('lynli_search_history', JSON.stringify(historyList.value))
  showHistory.value = false
  emit('search', kw)
}

function clickHistory(item) {
  innerKeyword.value = item
  handleSearch()
}

function clearHistory() {
  historyList.value = []
  localStorage.removeItem('lynli_search_history')
}

// 暴露一个方法给父组件，用于点击空白处收起历史
defineExpose({
  closeHistory: () => { showHistory.value = false }
})
</script>

<style scoped>
.search-bar-wrapper { padding: 12px 16px; position: relative; z-index: 100; }
.search-box { display: flex; align-items: center; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; padding: 10px 16px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.search-box svg { width: 18px; height: 18px; margin-right: 10px; }
.search-box input { flex: 1; border: none; outline: none; font-size: 15px; color: #1e293b; background: transparent; }
.clear-btn { font-size: 20px; color: #94a3b8; cursor: pointer; padding: 0 5px; }

.history-wrap { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; margin-top: 8px; border: 1px solid #e2e8f0; position: absolute; left: 16px; right: 16px; z-index: 20; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
.history-header { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-bottom: 12px; }
.clear-history { cursor: pointer; color: #94a3b8; }
.history-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { background: #f1f5f9; color: #475569; font-size: 13px; padding: 6px 14px; border-radius: 15px; cursor: pointer; }
</style>
