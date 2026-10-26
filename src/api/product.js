import request from './request'

// 商品列表：带分页参数
export function getProducts(params = {}) {
  return request.get('/api/v1/shop/products', { params })
}

// 商品详情
export function getProductDetail(id) {
  return request.get('/api/v1/shop/product/detail', { params: { id } })
}
