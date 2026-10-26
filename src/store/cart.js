import { ref, computed } from 'vue'

// 从本地存储读取初始购物车数据
const storedCart = localStorage.getItem('cart_items')
export const cartItems = ref(storedCart ? JSON.parse(storedCart) : [])

// 🔥 关键别名：你的代码里叫 cart，这里给它个名字
export const cart = cartItems

// 确保历史数据里有 selected 属性
cartItems.value.forEach(item => {
  if (item.selected === undefined) item.selected = true
})

const saveCart = () => {
  localStorage.setItem('cart_items', JSON.stringify(cartItems.value))
}

// 购物车总数量
export const totalCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 添加商品
export const addToCart = (product, quantity = 1) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartItems.value.push({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || product.cover,
      quantity: quantity,
      selected: true
    })
  }
  saveCart()
}

// 移除商品
export const removeFromCart = (productId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== productId)
  saveCart()
}

// 🔥 修改数量 (你代码里叫 updateQty)
export const updateQty = (productId, qty) => {
  const item = cartItems.value.find(item => item.id === productId)
  if (item && qty > 0) {
    item.quantity = qty
    saveCart()
  }
}

// 清空购物车
export const clearCart = () => {
  cartItems.value = []
  saveCart()
}

// 计算选中的商品列表
export const selectedItems = computed(() => {
  return cartItems.value.filter(item => item.selected)
})

// 计算选中的商品总数量
export const selectedCount = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 计算选中的商品总金额
export const selectedTotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

// 全选/取消全选
export const setSelectAll = (val) => {
  cartItems.value.forEach(item => {
    item.selected = val
  })
  saveCart()
}

// 改变单个商品的选中状态 (兼容 updateSelected)
export const updateSelected = (productId, val) => {
  const item = cartItems.value.find(item => item.id === productId)
  if (item) {
    item.selected = val
    saveCart()
  }
}
