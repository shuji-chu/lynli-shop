<template>
  <div v-if="show" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;">
    <div style="background: #fff; width: 100%; max-width: 600px; max-height: 80vh; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
      
      <!-- 弹窗头部 -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #eee;">
        <h3 style="margin: 0; font-size: 18px; color: #1e3a8a;">{{ type === 'privacy' ? '用户隐私协议' : '服务条款' }}</h3>
        <span @click="$emit('close')" style="cursor: pointer; font-size: 24px; color: #999; line-height: 1;">&times;</span>
      </div>

      <!-- 弹窗内容区 -->
      <div style="padding: 20px; overflow-y: auto; font-size: 13px; color: #475569; line-height: 1.8; text-align: justify;">
        
        <!-- 隐私协议内容 -->
        <template v-if="type === 'privacy'">
          <p><strong style="color: #0f172a;">尊敬的用户，欢迎使用 LYNLI 泠礼。</strong></p>
          <p>LYNLI 泠礼（以下简称“本站”）深知个人隐私对您的重要性。鉴于本站提供的是成人情趣及私密健康类商品，我们承诺将以最高标准保护您的个人信息与交易隐私。</p>
          <p><strong>一、 信息的收集</strong><br>当您注册或购物时，我们仅收集为您提供服务必需的信息，包括：邮箱地址、昵称、加密后的登录密码、收货人姓名、联系电话及详细收货地址。</p>
          <p><strong>二、 绝对的隐私发货承诺</strong><br>1. 您的所有包裹均采用无标识的纯色保密纸箱或快递袋进行包装，外包装绝不出现任何商品名称、品牌Logo或暗示性词汇。<br>2. 快递单上的寄件人信息均作隐私脱敏处理（默认显示为“日用百货”或“礼品”），绝不会泄露您购买的成人商品属性。</p>
          <p><strong>三、 信息的安全存储</strong><br>您的密码均经过不可逆的加密算法（Hash）存储，本站任何员工（包括管理员）均无法查看您的明文密码。您的交易记录与购物车数据将被严格隔离。</p>
          <p><strong>四、 信息的共享限制</strong><br>本站绝不会将您的个人信息出售、出租或非法提供给任何第三方。仅在为您完成物流配送（向快递公司提供必要联系信息）时进行最小范围共享，且会签署严格的保密协议。</p>
          <p><strong>五、 您的权利</strong><br>您有权随时登录账号查阅您的个人信息，或在“我的”页面申请注销账号。账号注销后，我们将依据法律法规在合理期限内彻底删除或匿名化您的所有数据。</p>
          <p><strong>六、 联系我们</strong><br>若您对本隐私政策有任何异议，或发现任何隐私泄露风险，请随时发送邮件至官方负责人邮箱：<strong style="color: #3b82f6;">boss@lynli.me</strong>，我们将有专人在24小时内为您处理。</p>
        </template>

        <!-- 服务条款内容 -->
        <template v-else>
          <p><strong style="color: #0f172a;">欢迎阅读 LYNLI 泠礼服务条款。</strong></p>
          <p>本协议是您与 LYNLI 泠礼之间就使用本站服务所订立的契约。请您在注册前仔细阅读。</p>
          <p><strong>一、 用户资格与限制</strong><br>本站仅面向年满18周岁且具备完全民事行为能力的合法公民提供服务。如果您未满18周岁，请立即停止注册并离开本站。注册即代表您承诺符合此年龄条件。</p>
          <p><strong>二、 账号安全</strong><br>您需对您账号下的所有行为负责。请妥善保管您的密码，切勿将账号借予他人使用。若发现账号被盗用，请立即联系官方邮箱 <strong>boss@lynli.me</strong> 冻结账号。</p>
          <p><strong>三、 商品与售后说明</strong><br>1. 鉴于成人用品的特殊卫生属性，根据《消费者权益保护法》，除商品本身存在质量缺陷外，所有私密接触类商品一经拆封，概不支持七天无理由退换货。<br>2. 若收到商品存在破损、漏发或功能故障，请在签收后48小时内联系客服，我们将提供无条件补发或退款。</p>
          <p><strong>四、 禁止行为</strong><br>您承诺在使用本站时不发布任何违法、违规、淫秽或侵犯他人权利的内容；不得利用技术手段恶意攻击、抓取本站数据或干扰本站正常运行。</p>
          <p><strong>五、 免责声明</strong><br>因不可抗力（如自然灾害、网络故障、黑客攻击）导致的服务中断，本站不承担直接或间接的赔偿责任，但将尽最大努力恢复服务并保障您的数据安全。</p>
          <p>本条款自您点击“登录/注册”按钮起生效。</p>
        </template>
      </div>

      <!-- 弹窗底部 -->
      <div style="padding: 15px 20px; border-top: 1px solid #eee; text-align: right;">
        <button @click="$emit('close')" style="background: #3b82f6; color: #fff; border: none; padding: 8px 24px; border-radius: 6px; cursor: pointer;">我知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  type: {
    type: String,
    default: 'privacy' // 'privacy' 或 'terms'
  }
})
defineEmits(['close'])
</script>
