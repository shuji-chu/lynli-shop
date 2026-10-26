# LYNLI 微澜 · 情趣用品独立 C 端商城

高端情趣用品独立商城前端。暗黑 / 黑金质感，动态氛围背景，纯前端购物车，支持支付宝与 USDT 双支付，全端自适应（PC 宽屏 + 手机 H5）。

> 技术栈：**Vue 3 + Vite + Vue Router**（组合式 API `<script setup>`），工程化组件化拆分，可平滑迁移至微信小程序。

---

## 一、架构与红线

| 项 | 约定 |
| --- | --- |
| 代码归属 | 仅本仓库 `shuji-chu/lynli-shop`，不触碰管理端 / 后端仓库 |
| 线上域名 | `https://www.lynli.me`（C 端站点） |
| 接口域名 | `https://api.lynli.me`（所有数据 HTTP 请求来源） |
| 前后端分离 | 数据一律经 HTTP 从 `api.lynli.me` 拉取，**禁止读取本地 JSON 作为假数据** |
| 商品来源 | 后端已通过 1688 抓取铺货写入 MySQL；C 端只消费 `GET /api/products` 的真实数据 |
| 无年龄墙 | 直接展示商品，**不出现任何「18 岁拦截」弹窗** |

---

## 二、目录结构

```
lynli-shop/
├── index.html                # Vite 入口（挂载 #app）
├── vite.config.js            # 构建 / 别名 @ / dev 代理
├── package.json
├── .github/workflows/        # GitHub Pages 自动构建部署
├── public/
│   └── logo.png              # 品牌 Logo（被 index.html / 导航栏引用）
└── src/
    ├── main.js               # 应用入口
    ├── App.vue               # 根组件（动态背景 + 导航 + Toast）
    ├── router/               # 路由（懒加载页面）
    ├── api/                  # 请求层（axios 二次封装 + 业务接口）
    │   ├── request.js        # 拦截器：带 Token / 全局错误 Toast / 401 清登
    │   ├── product.js        # 商品
    │   ├── auth.js           # 验证码 / 注册 / 登录
    │   └── order.js          # 下单 / 支付 / 轮询查单 / 我的订单
    ├── store/                # 状态（购物车 localStorage / 用户 token）
    ├── components/           # 通用组件（动态背景 / 商品卡 / 骨架 / Toast / 导航 / 支付弹窗）
    ├── views/                # 页面（首页 / 详情 / 购物车 / 结算 / 登录 / 支付 / 成功 / 订单）
    ├── utils/                # 工具（金额格式化 / Toast 单例）
    └── styles/global.css     # 主题变量 / Reset / 骨架屏 / 通用类
```

---

## 三、本地运行

```bash
# 1. 安装依赖
npm install

# 2. 配置接口域名（可选）
#    复制 .env.example 为 .env 并按需修改 VITE_API_BASE
#    默认即指向 https://api.lynli.me，无需改动即可联调线上接口

# 3. 启动开发服务器
npm run dev
# 打开 http://localhost:5173
```

> 若后端在本地或需要走代理：将 `.env` 中 `VITE_API_BASE` 设为空字符串 `''`，
> 开发服务器会通过 `vite.config.js` 的 `/api` 代理转发到 `https://api.lynli.me`。

---

## 四、打包与部署到 www.lynli.me

```bash
# 生产构建（产物在 dist/）
npm run build

# 本地预览构建产物
npm run preview
```

**部署方式（二选一）：**

1. **GitHub Pages + 自定义域名（仓库已内置工作流）**
   - 推送 `main` 分支即自动 `npm ci → npm run build → 上传 dist` 到 GitHub Pages。
   - 在仓库 **Settings → Pages → Custom domain** 填写 `www.lynli.me` 并按提示添加 DNS 解析（CNAME）。
   - 同时建议在 DNS 处为 `www.lynli.me` 配置 CNAME 指向 `<user>.github.io`，并开启 HTTPS。

2. **自有服务器 / 对象存储 / CDN**
   - 将 `dist/` 目录整体上传到 `www.lynli.me` 站点根目录即可（纯静态，无需服务端渲染）。
   - 注意 `vite.config.js` 中 `base: '/'` 适用于站点根路径部署；若部署到子路径，请相应调整 `base`。

> 前端只消费 `https://api.lynli.me`，与 C 端站点 `www.lynli.me` 跨域已由后端 CORS 白名单放行。

---

## 五、接口契约（前端按此发请求）

所有请求前缀：`https://api.lynli.me`

| 能力 | 方法 & 路径 | 说明 |
| --- | --- | --- |
| 商品列表 | `GET /api/products` | 返回 MySQL 已铺货真实商品（标题 / 价格 / 阿里云 OSS 图片外链） |
| 发送验证码 | `POST /api/v1/user/send_code` | body：`{ email }` |
| 注册 | `POST /api/v1/auth/register` | body：`{ email, code }` |
| 登录 | `POST /api/v1/auth/login` | body：`{ email, code }`，返回 `token` |
| 创建订单 | `POST /api/v1/shop/order` | body：`{ items:[{id,qty}], address, contact, method }`，返回 `trade_no` |
| 发起支付 | `POST /api/v1/user/order/pay` | body：`{ trade_no, method:'alipay'|'usdt' }`；支付宝返回二维码（`qr_url` 或待生成二维码的 `pay_url`），USDT 返回充值 `address` / `amount` / `network` |
| 轮询查单 | `GET /api/v1/user/order/query?trade_no=xxx` | 返回 `status`（`pending` / `paid` / `closed` 等），支付成功后跳转成功页 |
| 我的订单 | `GET /api/v1/user/orders` | 登录态拉取当前用户订单 |

> **响应适配**：后端返回结构可能是业务信封 `{ code, data, msg }` 或裸数据（数组 / 对象）。
> `src/api/request.js` 已做兼容归一化；如后端信封的成功码 / 字段名不同，仅需调整该文件顶部的 `SUCCESS_CODES` 与 `isExplicitError` 两处。
> 注册 / 登录的子路径（如后端需要密码字段）也集中在 `src/api/auth.js` 调整，便于联调对齐。

---

## 六、工程约定

- **请求封装**：`axios` 二次封装，请求拦截器自动携带 `Authorization: Bearer <token>`；响应拦截器统一拆信封、全局错误 Toast、401 自动清登并跳转登录页。
- **用户体系**：纯前端无感，登录后 `token` 持久化于 `localStorage`，刷新不丢失。
- **购物车**：纯前端 `localStorage` 管理，支持加减数量、单选 / 全选、清空。
- **UI 交互红线**
  - 动态背景：Canvas 粒子流光 + CSS 呼吸光晕（暗红 / 黑金），`requestAnimationFrame` 驱动、隐藏标签页自动暂停、`prefers-reduced-motion` 降级，确保流畅不卡顿。
  - **全局原生滚动**：禁止任何局部滚动条（`scrollbar-width:none` 等），`body` 占据全局滚动，移动端取消点击高亮。
  - 图片：`loading="lazy"` 懒加载 + 骨架屏加载态，防抖动。
  - 全端自适应：PC 宽屏大网格 + 宽导航；手机 H5 双列瀑布流 + 底部固定导航 / 购物车。
- **健壮性**：所有接口调用均有 `try/catch` 兜底，空数据、网络异常、字段缺失均有明确分支处理，杜绝页面死机。

---

## 七、环境要求

- Node.js ≥ 18（推荐 20 LTS）
- npm ≥ 9

---

## 八、待联调对齐项（与后端首次对接时确认）

1. 登录 / 注册接口的真实子路径与入参（是否需要 `password`）。
2. `GET /api/products` 的实际返回字段名（图片字段 `image` / `image_url` / `cover`，分类字段 `category` / `cat` 已做兼容）。
3. 支付接口返回的二维码字段（`qr_url` 直接图片 or `pay_url` 生码）与 USDT 网络字段（`network`，默认 TRC20）。
4. 订单状态枚举值（已在前端映射常见值，未知状态回退为「未知」）。
