<template>
  <div class="container cart">
    <h2 class="section-title">购物车</h2>

    <div v-if="!cart.items.length" class="empty">
      <p>购物车还是空的</p>
      <router-link to="/" class="btn-gold">去逛逛</router-link>
    </div>

    <template v-else>
      <ul class="list">
        <li v-for="item in cart.items" :key="item.id" class="row panel">
          <label class="pick">
            <input
              type="checkbox"
              :checked="item.selected !== false"
              @change="setSelected(item.id, $event.target.checked)"
            />
          </label>
          <div class="thumb">
            <img :src="item.image" :alt="item.title" loading="lazy" @error="onErr" />
          </div>
          <div class="mid">
            <p class="name">{{ item.title }}</p>
            <p class="price">{{ formatPrice(markupPrice(item.price)) }}</p>
          </div>
          <div class="right">
            <div class="stepper">
              <button @click="updateQty(item.id, item.qty - 1)">−</button>
              <span>{{ item.qty }}</span>
              <button @click="updateQty(item.id, item.qty + 1)">+</button>
            </div>
            <button class="del" @click="removeFromCart(item.id)">删除</button>
          </div>
        </li>
      </ul>

      <div class="bar panel">
        <label class="pick all">
          <input
            type="checkbox"
            :checked="allSelected"
            @change="setSelectAll($event.target.checked)"
          />
          <span>全选</span>
        </label>
        <button class="clear" @click="clearCart">清空</button>
        <div class="sum">
          <span>合计：<b>{{ formatPrice(selectedTotal) }}</b></span>
        </div>
        <button
          class="btn-gold"
          :disabled="!selectedItems.length"
          @click="goCheckout"
        >
          结算 ({{ selectedCount }})
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  cart,
  removeFromCart,
  updateQty,
  setSelected,
  setSelectAll,
  clearCart,
  selectedItems,
  selectedCount,
  selectedTotal,
  allSelected
} from '@/store/cart'
import { formatPrice } from '@/utils/format'
import { markupPrice } from '@/utils/price'
import { Toast } from '@/utils/toast'

const router = useRouter()

function onErr(e) {
  e.target.style.visibility = 'hidden'
}
function goCheckout() {
  if (!selectedItems.value.length) {
    Toast.error('请先选择商品')
    return
  }
  router.push({ name: 'checkout' })
}
</script>

<style scoped>
.cart {
  padding-top: 24px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}
.pick {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
}
.pick input {
  width: 20px;
  height: 20px;
  accent-color: var(--gold);
}
.thumb {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  overflow: hidden;
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.04);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.mid {
  flex: 1;
  min-width: 0;
}
.name {
  font-size: 15px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.price {
  margin-top: 6px;
  color: var(--gold-bright);
  font-weight: 700;
}
.right {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
}
.stepper button {
  width: 30px;
  height: 30px;
  font-size: 16px;
  color: var(--text-1);
  background: rgba(255, 255, 255, 0.04);
}
.stepper span {
  width: 38px;
  text-align: center;
  font-size: 14px;
}
.del {
  font-size: 12px;
  color: var(--text-3);
}
.del:hover {
  color: var(--danger);
}
.bar {
  position: sticky;
  bottom: 12px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  flex-wrap: wrap;
}
.all {
  gap: 8px;
}
.clear {
  font-size: 13px;
  color: var(--text-3);
}
.clear:hover {
  color: var(--danger);
}
.sum {
  margin-left: auto;
  font-size: 14px;
  color: var(--text-2);
}
.sum b {
  color: var(--gold-bright);
  font-size: 20px;
}
.bar .btn-gold {
  padding: 10px 22px;
}
.empty {
  text-align: center;
  padding: 90px 0;
  color: var(--text-3);
}
.empty .btn-gold {
  margin-top: 18px;
}
@media (min-width: 768px) {
  .row {
    gap: 18px;
    padding: 16px;
  }
}
</style>
