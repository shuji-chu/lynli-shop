<template>
  <div class="page-wrap">
    <div class="header">
      <button @click="$router.back()">←</button>
      <button class="back-btn" @click="$router.back()" style="background:none;border:none;font-size:24px;color:#1e293b;cursor:pointer;">←</button><h2>支持的支付方式</h2>
      <div></div>
    </div>
    
    <div class="content">
      <div class="section-title">国内支付</div>
      <div class="list">
        <!-- 支付宝 -->
        <div class="item">
          <div class="brand-icon alipay">
            <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M512 102.4c-226.1 0-409.6 183.5-409.6 409.6 0 123.9 55 234.7 141.6 309.2-18.5-62.1-26.7-131.7-19.4-204.8 8.3-82.5 42.6-158.6 94.6-218.1 19-21.7 44.6-42.2 74.3-60.5-26.5-16-48.4-36.3-62.5-59.7-16.8-27.7-21.1-57.4-12.3-84.1 7.5-22.6 26.1-38.9 51.2-44.8 15-3.5 30.5-3.5 45.8 0.1 29.4 6.8 53.7 27.1 67.6 56.9 6.5 14 10 29.9 10 46.2 0 22.2-6.8 43.8-19.2 61.6-13.8 19.8-32.8 35.6-54.9 45.9 26.5 15.9 46 37.2 56.3 62.3 11.9 29 12 62.2 0.2 92.8-8.3 21.5-23.2 38.4-42.7 48.3-37 18.8-88.4 20.8-130.2-5.7-23.1-14.7-41.5-34.2-52.3-56.4-5.3-11-8.8-22.5-10.5-34.5-19 17.4-42.6 36.9-67 55.8-41 31.7-90.4 59.1-146.3 80.2 61.7 45.1 138.1 71.8 220.8 71.8 226.1 0 409.6-183.5 409.6-409.6S738.1 102.4 512 102.4z" fill="#1677FF"/></svg>
          </div>
          <span class="name">支付宝</span>
          <span class="status supported">已支持</span>
        </div>
        
        <!-- 微信支付 -->
        <div class="item">
          <div class="brand-icon wechat">
            <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M682.666667 618.666667c-17.066667 0-34.133333-4.266667-51.2-8.533334-8.533333 38.4-29.866667 72.533333-59.733334 98.133334-38.4 34.133333-89.6 51.2-140.8 51.2-25.6 0-51.2-4.266667-72.533333-12.8l-98.133333 51.2 25.6-89.6c-68.266667-51.2-110.933333-132.266667-110.933334-217.6 0-157.866667 132.266667-285.866667 294.4-285.866667 162.133333 0 294.4 128 294.4 285.866667 0 21.333333-4.266667 46.933333-8.533333 68.266667 21.333333 4.266667 42.666667 8.533333 64 8.533333 166.4 0 302.933333-132.266667 302.933333-294.4S738.133333 128 571.733333 128 268.8 260.266667 268.8 426.666667c0 29.866667 4.266667 59.733333 12.8 85.333333l-46.933333 157.866667 162.133333-85.333334c42.666667 17.066667 89.6 29.866667 140.8 29.866667 4.266667 0 12.8 0 17.066667-4.266667 12.8 59.733333 68.266667 102.4 132.266666 102.4 17.066667 0 34.133333-4.266667 51.2-8.533333l81.066667 38.4-21.333334-72.533334c51.2-38.4 85.333333-98.133333 85.333334-162.133333 0-115.2-98.133333-204.8-217.6-204.8z" fill="#07C160"/></svg>
          </div>
          <span class="name">微信支付</span>
          <span class="status supported">已支持</span>
        </div>
      </div>
      
      <div class="section-title">跨境 / 海外支付 (高保密通道)</div>
      <div class="list">
        <!-- USDT -->
        <div class="item">
          <div class="brand-icon usdt">
            <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z" fill="#26A17B"/><path d="M571.349333 556.117333V455.210667h130.858667V298.666667H321.962667v156.544h130.858666v100.906666c-108.8 5.12-190.293333 26.069333-190.293333 51.285334 0 25.216 81.493333 46.165333 190.293333 51.285333v182.698667h118.528V658.688c108.672-5.12 190.208-26.026667 190.208-51.242667 0-25.216-81.536-46.122667-190.208-51.328zM571.349333 644.864v-0.042667c-1.706667 0.128-10.496 0.64-26.453333 0.64-14.122667 0-24.192-0.426667-27.776-0.64v0.042667c-98.389333-4.352-171.776-21.461333-171.776-41.984 0-20.48 73.386667-37.632 171.776-41.984v66.944c3.669333 0.256 13.909333 0.768 28.16 0.768 15.36 0 23.850667-0.512 25.984-0.768v-66.901333c98.261333 4.352 171.52 21.504 171.52 41.941333 0 20.522667-73.258667 37.632-171.52 41.984z" fill="#FFF"/></svg>
          </div>
          <span class="name">USDT 加密货币</span>
          <span class="status supported">已支持</span>
        </div>
        
        <!-- 国际信用卡 -->
        <div class="item">
          <div class="brand-icon card">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
          </div>
          <span class="name">国际信用卡通道</span>
          <span class="status supported">已支持</span>
        </div>

        <!-- 加密货币 -->
        <div class="item">
          <div class="brand-icon crypto">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#F59E0B"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z"/></svg>
          </div>
          <span class="name">BTC / ETH 加密通道</span>
          <span class="status supported">已支持</span>
        </div>
      </div>
      
      <p class="tip">注：为保障您的隐私及资金安全，平台采用高保密支付通道，下单时选择对应方式即可，无需提前绑定。</p>
    </div>
  </div>
</template>

<style scoped>
.page-wrap {  min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; color: #1e293b; }
.header h2 { font-size: 18px; margin: 0; color: #1e293b; }
.content { padding: 16px; }
.section-title { font-size: 13px; color: #94a3b8; margin: 20px 0 8px; padding-left: 4px; }
.list { background: #fff; border-radius: 16px; padding: 0 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.item { display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
.item:last-child { border-bottom: none; }

.brand-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 12px; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
.brand-icon svg { width: 26px; height: 26px; }

.name { flex: 1; font-size: 15px; color: #1e293b; font-weight: 500; }
.status { font-size: 13px; }
.supported { color: #3b82f6; font-weight: 500; } /* 统一改成品牌蓝的已支持 */

.tip { font-size: 12px; color: #94a3b8; margin-top: 16px; text-align: center; line-height: 1.5; }
</style>
