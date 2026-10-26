import request from './request'

// 商品列表：GET /api/products
// 后端从 MySQL 读取已铺货的真实商品（含标题、价格、阿里云 OSS 图片外链）。
// 支持可选查询参数：分类、分页、关键词等（按后端实际能力透传）。
export function getProducts(params = {}) {
  return request.get('/api/products', { params })
}

// 商品详情（按后端实际路由调整；部分实现复用 /api/products?id= 或 /api/product/:id）
export function getProductDetail(id) {
  return request.get('/api/product/detail', { params: { id } })
}
