<template>
  <div class="cart-page">
    <!-- 顶部导航 -->
    <div class="header">
      <h2>购物车 <span>({{ cart.items.length }})</span></h2>
      <span class="edit-btn" v-if="cart.items.length" @click="toggleEdit">
        {{ isEditing ? '完成' : '管理' }}
      </span>
    </div>

    <!-- 💰 淘宝同款：顶部领券横幅 -->
    <div class="coupon-banner" v-if="cart.items.length">
      <div class="cb-left">
        <span class="cb-icon">🧧</span>
        <span>您有 <b>4张</b> 共 <b>305元</b> 消费券待领取</span>
      </div>
      <button class="cb-btn">领305元</button>
    </div>

    <!-- 空购物车状态 -->
    <div v-if="cart.items.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <p>购物车还是空的</p>
      <button class="go-shopping" @click="$router.push('/shop')">去逛逛</button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-list-container">
      <!-- 模拟店铺分组：这里把所有商品当作同一家店 -->
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

          <!-- 删除按钮 -->
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

// 模拟店铺全选
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
/* 全局底色对齐淘宝灰 */
.cart-page {
  min-height: 100vh;
  background: #f4f4f4; 
  padding-bottom: 70px;
}

/* 顶部导航 */
.header {
  position: fixed; top: 0; left: 0; right: 0; height: 56px;
  background: #fff; display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; z-index: 100;
}
.header h2 { font-size: 18px; margin: 0; color: #333; font-weight: bold; }
.header h2 span { font-size: 14px; color: #999; font-weight: normal; }
.edit-btn { font-size: 14px; color: #333; cursor: pointer; }

/* 💰 顶部横幅 */
.coupon-banner {
  margin-top: 56px;
  background: #fff;
  padding: 10px 16px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}
.cb-left { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #333; }
.cb-icon { font-size: 16px; }
.cb-left b { color: #ff5000; font-weight: bold; }
.cb-btn {
  background: #ff5000; color: #fff; border: none;
  padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;
}

/* 空状态 */
.empty-cart { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 100px; }
.empty-icon { font-size: 60px; margin-bottom: 16px; opacity: 0.3; }
.empty-cart p { color: #999; font-size: 14px; margin-bottom: 20px; }
.go-shopping { background: #ff5000; color: #fff; border: none; padding: 10px 30px; border-radius: 20px; font-size: 15px; font-weight: bold; }

/* 购物车列表 */
.cart-list-container { padding: 12px; display: flex; flex-direction: column; gap: 12px; }

/* 店铺分组卡片 */
.shop-group {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}
.shop-header {
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
  padding-bottom: 12px; border-bottom: 1px solid #f5f5f5;
}
.shop-name { font-size: 15px; font-weight: bold; color: #333; display: flex; align-items: center; gap: 4px; }
.arrow { font-size: 12px; color: #999; }

/* 商品项 */
.cart-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.cart-item:last-child { margin-bottom: 0; }

/* 淘宝同款红圈勾选框 */
.checkbox {
  width: 20px; height: 20px; border-radius: 50%; border: 1px solid #ccc;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.checkbox.checked { background: #ff5000; border-color: #ff5000; }
.checkbox svg { width: 12px; height: 12px; }

.item-img { width: 90px; height: 90px; border-radius: 8px; object-fit: cover; background: #f9f9f9; }

.item-info { flex: 1; height: 90px; display: flex; flex-direction: column; justify-content: space-between; }
.item-title {
  font-size: 14px; color: #333; margin: 0; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.item-sku { font-size: 12px; color: #999; background: #f5f5f5; padding: 2px 6px; border-radius: 4px; width: fit-content; }

.item-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
.price { font-size: 14px; color: #ff5000; font-weight: bold; }
.price b { font-size: 18px; font-family: Arial, sans-serif; }

/* 数量加减器 */
.stepper { display: flex; align-items: center; border: 1px solid #eee; border-radius: 4px; }
.stepper button { width: 24px; height: 24px; background: #f8f8f8; border: none; font-size: 14px; color: #333; }
.stepper span { width: 34px; text-align: center; font-size: 14px; color: #333; }

.delete-btn { font-size: 12px; color: #ff5000; border: 1px solid #ff5000; padding: 4px 10px; border-radius: 14px; margin-left: 8px; }

/* 底部结算栏 */
.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0; height: 60px;
  background: #fff; display: flex; align-items: center; padding: 0 16px;
  box-shadow: 0 -1px 5px rgba(0,0,0,0.05); z-index: 100;
  justify-content: space-between;
}
.select-all { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #333; }
.total-info { display: flex; flex-direction: column; align-items: flex-end; margin-left: auto; margin-right: 16px; }
.total-text { font-size: 14px; color: #333; }
.total-price { font-size: 20px; font-weight: bold; color: #ff5000; font-family: Arial, sans-serif; }
.tip { font-size: 12px; color: #999; margin: 2px 0 0; }

/* 巨大的结算按钮 */
.checkout-btn {
  background: #ff5000; color: #fff; border: none;
  padding: 0 24px; height: 40px; border-radius: 20px;
  font-size: 16px; font-weight: bold; letter-spacing: 1px;
}
.checkout-btn.disabled { background: #ffc4a8; opacity: 0.8; }
</style>
