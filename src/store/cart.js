import { ref, computed } from 'vue'

// 从本地存储读取初始购物车数据
const storedCart = localStorage.getItem('cart_items')
export const cartItems = ref(storedCart ? JSON.parse(storedCart) : [])

// 计算购物车总数量
export const totalCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 添加到购物车
export const addToCart = (product, quantity = 1) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    // 兼容你原来的商品数据结构
    cartItems.value.push({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || product.cover,
      quantity: quantity
    })
  }
  // 同步到本地存储
  localStorage.setItem('cart_items', JSON.stringify(cartItems.value))
}

// 从购物车移除
export const removeFromCart = (productId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== productId)
  localStorage.setItem('cart_items', JSON.stringify(cartItems.value))
}
