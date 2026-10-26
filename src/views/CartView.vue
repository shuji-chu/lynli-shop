<template>
  <div class="cart-page">
    <!-- 顶部导航 -->
    <div class="header">
      <h2>购物车 <span v-if="cart.items.length">({{ cart.items.length }})</span></h2>
      <span class="edit-btn" v-if="cart.items.length" @click="toggleEdit">
        {{ isEditing ? '完成' : '管理' }}
      </span>
    </div>

    <!-- 空购物车状态 -->
    <div v-if="cart.items.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <p>购物车还是空的</p>
      <button class="go-shopping" @click="$router.push('/shop')">去逛逛</button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-list">
      <div class="cart-item" v-for="item in cart.items" :key="item.id">
        <!-- 勾选框 -->
        <div class="checkbox" :class="{ checked: item.selected !== false }" @click="toggleItem(item)">
          <svg v-if="item.selected !== false" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>

        <!-- 商品图 -->
        <img :src="item.image" class="item-img" @click="$router.push('/product/' + item.id)" />

        <!-- 商品信息 -->
        <div class="item-info">
          <h4 class="item-title">{{ item.title }}</h4>
          <div class="item-bottom">
            <span class="price">¥{{ (item.price).toFixed(2) }}</span>
            <!-- 数量加减器 -->
            <div class="stepper">
              <button @click="changeQty(item, -1)" :disabled="item.qty <= 1">−</button>
              <span>{{ item.qty }}</span>
              <button @click="changeQty(item, 1)">+</button>
            </div>
          </div>
        </div>

        <!-- 删除按钮 (编辑模式下显示) -->
        <div class="delete-btn" v-if="isEditing" @click="removeItem(item.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="bottom-bar" v-if="cart.items.length > 0">
      <div class="select-all" @click="toggleAll">
        <div class="checkbox" :class="{ checked: allSelected }">
          <svg v-if="allSelected" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span>全选</span>
      </div>
      
      <div class="total-info">
        <div class="total-text">
          合计：<span class="total-price">¥{{ selectedTotal.toFixed(2) }}</span>
        </div>
        <p class="tip">已免运费</p>
      </div>

      <button class="checkout-btn" :class="{ disabled: selectedCount === 0 }" @click="goCheckout">
        结算({{ selectedCount }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cart, updateQty, removeFromCart, setSelected, setSelectAll, allSelected, selectedTotal, selectedCount } from '@/store/cart'
import { Toast } from '@/utils/toast'

const router = useRouter()
const isEditing = ref(false)

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const toggleItem = (item) => {
  setSelected(item.id, item.selected === false)
}

const toggleAll = () => {
  setSelectAll(!allSelected.value)
}

const changeQty = (item, delta) => {
  updateQty(item.id, item.qty + delta)
}

const removeItem = (id) => {
  removeFromCart(id)
  Toast.success('已移除商品')
}

const goCheckout = () => {
  if (selectedCount.value === 0) {
    return Toast.error('请先选择要结算的商品')
  }
  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px; /* 留出底部结算栏的高度 */
}

/* 顶部导航 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 100;
  border-bottom: 1px solid #f1f5f9;
}
.header h2 { font-size: 18px; margin: 0; color: #1e293b; }
.header h2 span { font-size: 14px; color: #94a3b8; }
.edit-btn { font-size: 14px; color: #3b82f6; cursor: pointer; }

/* 空状态 */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 120px;
}
.empty-icon { font-size: 60px; margin-bottom: 16px; opacity: 0.5; }
.empty-cart p { color: #94a3b8; font-size: 15px; margin-bottom: 24px; }
.go-shopping {
  background: #3b82f6; color: #fff; border: none; padding: 10px 30px; border-radius: 20px; font-size: 15px; font-weight: bold; cursor: pointer;
}

/* 购物车列表 */
.cart-list {
  padding: 70px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cart-item {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

/* 核心勾选框 */
.checkbox {
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}
.checkbox.checked {
  background: #3b82f6; border-color: #3b82f6;
}
.checkbox svg { width: 12px; height: 12px; }

.item-img {
  width: 80px; height: 80px;
  border-radius: 12px;
  object-fit: cover;
  background: #f8fafc;
  cursor: pointer;
}

.item-info {
  flex: 1;
  display: flex; flex-direction: column; justify-content: space-between;
  height: 76px;
}
.item-title {
  font-size: 14px; color: #1e293b; font-weight: 500;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  margin: 0; line-height: 1.4;
}
.item-bottom { display: flex; justify-content: space-between; align-items: center; }
.price { font-size: 16px; font-weight: bold; color: #ef4444; }

/* 数量加减器 */
.stepper {
  display: flex; align-items: center;
  background: #f8fafc; border-radius: 6px; border: 1px solid #f1f5f9;
}
.stepper button {
  width: 26px; height: 26px; background: transparent; border: none;
  color: #64748b; font-size: 16px; cursor: pointer;
}
.stepper button:disabled { color: #cbd5e1; cursor: not-allowed; }
.stepper span { width: 30px; text-align: center; font-size: 13px; color: #1e293b; }

/* 删除按钮 */
.delete-btn { padding: 8px; cursor: pointer; }
.delete-btn svg { width: 20px; height: 20px; }

/* 底部结算栏 */
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: 64px; background: #fff;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; border-top: 1px solid #f1f5f9; z-index: 100;
}
.select-all { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #475569; cursor: pointer; }

.total-info { display: flex; flex-direction: column; align-items: flex-end; margin-right: 12px; }
.total-text { font-size: 14px; color: #1e293b; }
.total-price { font-size: 18px; font-weight: bold; color: #ef4444; }
.tip { font-size: 11px; color: #94a3b8; margin: 2px 0 0; }

.checkout-btn {
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: #fff; border: none;
  padding: 10px 24px; border-radius: 20px;
  font-size: 15px; font-weight: bold; cursor: pointer;
}
.checkout-btn.disabled { background: #cbd5e1; cursor: not-allowed; opacity: 0.8; }
</style>
