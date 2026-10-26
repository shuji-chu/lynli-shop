<template>
  <div class="cart-page">
    <!-- 顶部导航 -->
    <div class="header">
      <h2>购物车 <span v-if="cart.items.length">({{ cart.items.length }})</span></h2>
      <span class="edit-btn" v-if="cart.items.length" @click="toggleEdit">
        {{ isEditing ? '完成' : '管理' }}
      </span>
    </div>

    <!-- 空购物车状态 (重绘高级感) -->
    <div v-if="cart.items.length === 0" class="empty-cart">
      <div class="empty-svg">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#f0f7ff"/>
          <path d="M35 45h50l-5 35H40l-5-35z" stroke="#bfdbfe" stroke-width="4" stroke-linejoin="round"/>
          <path d="M45 45v-5a15 15 0 0 1 30 0v5" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/>
          <circle cx="48" cy="90" r="5" fill="#3b82f6"/>
          <circle cx="72" cy="90" r="5" fill="#3b82f6"/>
        </svg>
      </div>
      <p class="empty-title">购物车还是空的</p>
      <p class="empty-desc">快去挑选心仪的好物，开启私密之旅吧～</p>
      <button class="go-shopping" @click="$router.push('/shop')">立即去逛逛</button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-list-container">
      <div class="shop-group">
        <div class="shop-header">
          <div class="checkbox" :class="{ checked: allShopSelected }" @click="toggleAllShop">
            <svg v-if="allShopSelected" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="shop-name">LYNLI 泠礼官方旗舰店 <span class="arrow">></span></span>
        </div>

        <div class="cart-item" v-for="item in cart.items" :key="item.id">
          <div class="checkbox" :class="{ checked: item.selected !== false }" @click="toggleItem(item)">
            <svg v-if="item.selected !== false" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>

          <img :src="item.image" class="item-img" @click="$router.push('/product/' + item.id)" />

          <div class="item-info">
            <h4 class="item-title">{{ item.title }}</h4>
            <div class="item-sku">默认规格 · 隐私发货</div>
            <div class="item-bottom">
              <span class="price">¥<b>{{ (item.price).toFixed(2) }}</b></span>
              <div class="stepper">
                <button @click="changeQty(item, -1)" :disabled="item.qty <= 1">−</button>
                <span>{{ item.qty }}</span>
                <button @click="changeQty(item, 1)">+</button>
              </div>
            </div>
          </div>

          <div class="delete-btn" v-if="isEditing" @click="removeItem(item.id)">删除</div>
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
defineOptions({ name: 'CartView' });
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

const allShopSelected = computed(() => cart.items.every(i => i.selected !== false))
const toggleAllShop = () => {
  const val = !allShopSelected.value
  cart.items.forEach(i => setSelected(i.id, val))
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
/* 全局底色 */
.cart-page { padding-top: 0;  padding-top: 64px; min-height: 100vh; background: #f8fafc; padding-bottom: 70px; }

/* 顶部导航 */
.header { position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 100; border-bottom: 1px solid #f1f5f9; }
.header h2 { font-size: 18px; margin: 0; color: #1e293b; font-weight: bold; }
.header h2 span { font-size: 14px; color: #94a3b8; font-weight: normal; }
.edit-btn { font-size: 14px; color: #64748b; cursor: pointer; }

/* 空状态重绘 */
.empty-cart { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 100px; }
.empty-svg { width: 140px; height: 140px; margin-bottom: 20px; }
.empty-title { font-size: 18px; color: #1e293b; font-weight: bold; margin: 0 0 8px; }
.empty-desc { font-size: 14px; color: #94a3b8; margin: 0 0 24px; }
.go-shopping { background: linear-gradient(135deg, #3b82f6, #1e3a8a); color: #fff; border: none; padding: 12px 36px; border-radius: 24px; font-size: 15px; font-weight: bold; box-shadow: 0 4px 12px rgba(59,130,246,0.3); cursor: pointer; transition: transform 0.2s; }
.go-shopping:active { transform: scale(0.95); }

/* 列表容器 */
.cart-list-container { padding: 70px 16px 16px; display: flex; flex-direction: column; gap: 12px; }
.shop-group { background: #fff; border-radius: 16px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.shop-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
.shop-name { font-size: 15px; font-weight: bold; color: #1e293b; }
.arrow { font-size: 12px; color: #cbd5e1; }

/* 商品项 */
.cart-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.cart-item:last-child { margin-bottom: 0; }

/* 🚨 全站统一的蓝色勾选框 */
.checkbox { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid #cbd5e1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.checkbox.checked { background: #3b82f6; border-color: #3b82f6; }
.checkbox svg { width: 14px; height: 14px; }

.item-img { width: 88px; height: 88px; border-radius: 12px; object-fit: cover; background: #f8fafc; }
.item-info { flex: 1; height: 88px; display: flex; flex-direction: column; justify-content: space-between; }
.item-title { font-size: 14px; color: #1e293b; margin: 0; line-height: 1.4; font-weight: 500; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.item-sku { font-size: 11px; color: #94a3b8; background: #f8fafc; padding: 2px 6px; border-radius: 4px; width: fit-content; }

.item-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
.price { font-size: 14px; color: #ef4444; font-weight: bold; }
.price b { font-size: 18px; font-family: Arial; }

/* 数量加减器 */
.stepper { display: flex; align-items: center; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0; }
.stepper button { width: 26px; height: 26px; background: transparent; border: none; font-size: 16px; color: #64748b; }
.stepper button:disabled { color: #cbd5e1; }
.stepper span { width: 32px; text-align: center; font-size: 13px; color: #1e293b; }

.delete-btn { font-size: 12px; color: #ef4444; border: 1px solid #fecaca; background: #fef2f2; padding: 4px 10px; border-radius: 14px; margin-left: 8px; }

/* 底部结算栏 (恢复蓝色调) */
.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 64px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-top: 1px solid #f1f5f9; z-index: 100; }
.select-all { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #475569; }
.total-info { display: flex; flex-direction: column; align-items: flex-end; margin-right: 16px; }
.total-text { font-size: 13px; color: #64748b; }
.total-price { font-size: 20px; font-weight: bold; color: #ef4444; font-family: Arial; }
.tip { font-size: 11px; color: #94a3b8; margin: 2px 0 0; }

/* 结算按钮 (蓝色渐变) */
.checkout-btn { background: linear-gradient(135deg, #3b82f6, #1e3a8a); color: #fff; border: none; padding: 0 24px; height: 42px; border-radius: 21px; font-size: 15px; font-weight: bold; box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
.checkout-btn.disabled { background: #cbd5e1; box-shadow: none; }
</style>
