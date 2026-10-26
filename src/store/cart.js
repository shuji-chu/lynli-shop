import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'lynli_cart'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

// 购物车：纯前端 localStorage 管理，全局单例响应式对象
export const cart = reactive({ items: load() })

// 任何改动都持久化到 localStorage（深监听）
watch(
  () => cart.items,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {
      /* 忽略写入异常（如隐私模式） */
    }
  },
  { deep: true }
)

export function addToCart(product, qty = 1) {
  if (!product || product.id == null) return
  const id = product.id
  const exist = cart.items.find((i) => i.id === id)
  if (exist) {
    exist.qty += qty
  } else {
    cart.items.push({
      id,
      title: product.title || product.name || '未命名商品',
      price: Number(product.price) || 0,
      image: product.image || product.image_url || product.cover || '',
      qty,
      selected: true
    })
  }
}

export function removeFromCart(id) {
  cart.items = cart.items.filter((i) => i.id !== id)
}

export function updateQty(id, qty) {
  const item = cart.items.find((i) => i.id === id)
  if (item) item.qty = Math.max(1, Math.floor(qty) || 1)
}

export function clearCart() {
  cart.items = []
}

export function setSelected(id, selected) {
  const item = cart.items.find((i) => i.id === id)
  if (item) item.selected = !!selected
}

export function setSelectAll(selected) {
  cart.items.forEach((i) => (i.selected = !!selected))
}

// 派生状态
export const selectedItems = computed(() =>
  cart.items.filter((i) => i.selected !== false)
)
export const selectedCount = computed(() =>
  selectedItems.value.reduce((s, i) => s + i.qty, 0)
)
export const selectedTotal = computed(() =>
  selectedItems.value.reduce((s, i) => s + i.qty * i.price, 0)
)
export const totalCount = computed(() =>
  cart.items.reduce((s, i) => s + i.qty, 0)
)
export const allSelected = computed(
  () => cart.items.length > 0 && cart.items.every((i) => i.selected !== false)
)
