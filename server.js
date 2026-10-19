const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DB = path.join(__dirname, 'db.json');
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
function load() { if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({products:[],orders:[]})); return JSON.parse(fs.readFileSync(DB, 'utf8')); }
function save(data) { fs.writeFileSync(DB, JSON.stringify(data, null, 2)); }
function needAdmin(req, res, next) { if (req.get('x-admin-pass') !== ADMIN_PASS) return res.status(401).json({ error: '密码错误' }); next(); }
app.get('/api/products', (req, res) => res.json(load().products));
app.post('/api/orders', (req, res) => {
  const { items, name, phone, address } = req.body || {};
  if (!items || !items.length) return res.status(400).json({ error: '购物车为空' });
  const data = load(); const lines = [];
  for (const it of items) {
    const p = data.products.find(x => x.id === it.id);
    if (!p) return res.status(400).json({ error: '商品已下架' });
    if (p.stock < it.qty) return res.status(409).json({ error: `库存不足: ${p.name}` });
    lines.push({ id: p.id, name: p.name, price: p.price, qty: it.qty, sum: p.price * it.qty });
  }
  lines.forEach(l => data.products.find(p => p.id === l.id).stock -= l.qty);
  const order = { id: 'NO' + Date.now(), items: lines, total: lines.reduce((s, l) => s + l.sum, 0), name, phone, address, status: '待付款', createdAt: new Date().toISOString() };
  data.orders.unshift(order); save(data); res.json({ ok: true, order });
});
app.get('/api/admin/orders', needAdmin, (req, res) => res.json(load().orders));
app.get('/api/admin/products', needAdmin, (req, res) => res.json(load().products));
app.patch('/api/admin/orders/:id', needAdmin, (req, res) => { const data = load(); const o = data.orders.find(x => x.id === req.params.id); if (o) o.status = req.body.status; save(data); res.json(o); });
app.post('/api/admin/products', needAdmin, (req, res) => { const data = load(); data.products.push({ id: 'p' + Date.now(), ...req.body }); save(data); res.json(data.products); });
app.patch('/api/admin/products/:id', needAdmin, (req, res) => { const data = load(); const p = data.products.find(x => x.id === req.params.id); if (p) Object.assign(p, req.body); save(data); res.json(p); });
app.delete('/api/admin/products/:id', needAdmin, (req, res) => { const data = load(); data.products = data.products.filter(x => x.id !== req.params.id); save(data); res.json({ok: true}); });
app.listen(PORT, () => console.log('Server running on port ' + PORT));
