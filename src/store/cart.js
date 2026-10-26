import { reactive, computed } from 'vue'

// 从本地存储读取初始购物车数据
const storedCart = localStorage.getItem('cart_items')
const initialItems = storedCart ? JSON.parse(storedCart) : []

// 严格适配 CartView.vue 需要的 `cart.items` 结构
export const cart = reactive({
  items: initialItems
})

// 兼容老数据
cart.items.forEach(item => {
  if (item.selected === undefined) item.selected = true
  if (item.qty === undefined) item.qty = item.quantity || 1
})

const saveCart = () => {
  localStorage.setItem('cart_items', JSON.stringify(cart.items))
}

// 🔥 修改数量 (对应 updateQty)
export const updateQty = (id, qty) => {
  const item = cart.items.find(i => i.id === id)
  if (item && qty > 0) {
    item.qty = qty
    saveCart()
  }
}

// 🔥 移除商品
export const removeFromCart = (id) => {
  cart.items = cart.items.filter(i => i.id !== id)
  saveCart()
}

// 🔥 单个选中 (对应 setSelected)
export const setSelected = (id, val) => {
  const item = cart.items.find(i => i.id === id)
  if (item) {
    item.selected = val
    saveCart()
  }
}

// 🔥 全选 (对应 setSelectAll)
export const setSelectAll = (val) => {
  cart.items.forEach(i => i.selected = val)
  saveCart()
}

// 🔥 清空购物车
export const clearCart = () => {
  cart.items = []
  saveCart()
}

// 🔥 计算属性：是否全选
export const allSelected = computed(() => {
  return cart.items.length > 0 && cart.items.every(i => i.selected !== false)
})

// 🔥 计算属性：选中总金额
export const selectedTotal = computed(() => {
  return cart.items.filter(i => i.selected !== false).reduce((sum, i) => sum + (i.price * i.qty), 0)
})

// 兼容其他页面（如 ProductCard.vue 和 BottomNav.vue）的导出
export const addToCart = (product, quantity = 1) => {
  const existing = cart.items.find(i => i.id === product.id)
  if (existing) {
    existing.qty += quantity
  } else {
    cart.items.push({
      id: product.id,
      title: product.title || product.name,
      price: product.price,
      image: product.image || product.cover,
      qty: quantity,
      selected: true
    })
  }
  saveCart()
}

export const totalCount = computed(() => {
  return cart.items.reduce((sum, item) => sum + item.qty, 0)
})
