<template>
  <div class="container settings-page">
    <div class="header"><button @click="$router.back()" class="back-btn">←</button><h2>设置</h2><div></div></div>
    <div class="section">
      <div class="item"><span>个人信息</span> <span class="val">查看</span></div>
      <div class="item"><span>支付设置</span> <span class="val">支付宝/微信</span></div>
      <div class="item"><span>地区与语言</span> <span class="val">简体中文</span></div>
    </div>
    <div class="logout-box"><button class="logout-btn" @click="logout">退出登录</button></div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => { localStorage.clear(); router.push('/auth'); }
</script>
<style scoped>
.settings-page { padding-top: 60px; background: #f5f7fa; min-height: 100vh; }
.header { position: fixed; top: 0; left: 0; right: 0; height: 60px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #eee; z-index:100;}
.header h2 { font-size: 18px; margin: 0; color: #1e293b; }
.back-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #333; }
.section { background: #fff; margin: 16px; border-radius: 12px; overflow: hidden; }
.item { display: flex; justify-content: space-between; padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #334155; }
.item:last-child { border-bottom: none; }
.val { color: #94a3b8; font-size: 14px; }
.logout-box { margin: 24px 16px; }
.logout-btn { width: 100%; padding: 16px; border-radius: 12px; border: none; background: #fff; color: #ef4444; font-size: 16px; font-weight: bold; cursor: pointer; }
</style>
