<template>
  <div class="category-nav">
    <div class="cat-item" v-for="cat in categories" :key="cat.name" @click="$emit('select', cat.name)">
      <div class="cat-icon" :style="{ background: cat.color }">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
      </div>
      <span>{{ cat.name }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true }
})
defineEmits(['select'])
</script>

<style scoped>
.category-nav { display: flex; overflow-x: auto; padding: 0 16px 16px; gap: 16px; position: relative; z-index: 2; scrollbar-width: none; }
.category-nav::-webkit-scrollbar { display: none; }
.cat-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0; }
.cat-icon { width: 52px; height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.cat-icon svg { width: 24px; height: 24px; }
.cat-item span { font-size: 12px; color: #475569; font-weight: 500; }
</style>
