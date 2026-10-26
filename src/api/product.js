import request from './request'

// 商品列表：对齐后端注入的新接口
export function getProducts(params = {}) {
  return request.get('/api/v1/shop/products', { params })
}

// 商品详情：暂时沿用，后端如果没有这个接口后面再补
export function getProductDetail(id) {
  return request.get('/api/v1/shop/product/detail', { params: { id } })
}
