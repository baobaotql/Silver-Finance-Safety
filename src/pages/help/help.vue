<template>
  <view class="page">
    <view class="tabs">
      <view
        class="tab"
        :class="{ active: activeTab === 'tutorial' }"
        @tap="activeTab = 'tutorial'"
      >
        使用教程
      </view>
      <view
        class="tab"
        :class="{ active: activeTab === 'knowledge' }"
        @tap="activeTab = 'knowledge'"
      >
        防骗知识
      </view>
    </view>

    <!-- 使用教程 -->
    <view v-if="activeTab === 'tutorial'" class="section">
      <view v-for="(step, idx) in tutorialSteps" :key="idx" class="step-card">
        <view class="step-num">{{ idx + 1 }}</view>
        <view class="step-content">
          <text class="step-title">{{ step.title }}</text>
          <text class="step-desc">{{ step.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 防骗知识 -->
    <view v-else class="section">
      <view
        v-for="(item, idx) in knowledgeList"
        :key="idx"
        class="knowledge-card"
        @tap="toggleKnowledge(idx)"
      >
        <view class="knowledge-header">
          <text class="knowledge-title">{{ item.title }}</text>
          <text class="arrow">{{ expanded[idx] ? '▲' : '▼' }}</text>
        </view>
        <text v-if="expanded[idx]" class="knowledge-body">{{ item.content }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('tutorial')
const expanded = ref({})

const tutorialSteps = [
  {
    title: '打开小程序',
    desc: '在微信中搜索或扫码进入「灵溪识险」。',
  },
  {
    title: '拍照或选图',
    desc: '点击首页「拍照识别」拍摄可疑信息，或点「相册上传」选择已有截图。',
  },
  {
    title: '等待识别',
    desc: '系统会自动识别图片中的文字，并分析是否存在诈骗风险，请稍等片刻。',
  },
  {
    title: '查看结果',
    desc: '结果页会显示风险等级、通俗解读和防骗建议，清晰明了方便查看。',
  },
  {
    title: '查看历史',
    desc: '在「历史记录」中可回看以往的识别结果，方便和家人一起核对。',
  },
]

const knowledgeList = [
  {
    title: '陌生链接不要点',
    content: '收到不明链接的短信或微信消息，千万不要随便点击。骗子常用假链接盗取您的账号和密码，甚至转走您的钱。',
  },
  {
    title: '验证码不能告诉别人',
    content: '短信验证码是保护您账户安全的钥匙。任何人以任何理由索要验证码，都是骗子，绝对不能给。',
  },
  {
    title: '高收益往往有陷阱',
    content: '宣称「保本保息」「年化收益十几二十个点」的理财宣传，很多是非法集资。天上不会掉馅饼，投资前一定让子女帮忙把关。',
  },
  {
    title: '公检法不会电话办案',
    content: '真正的公安、检察院、法院不会通过电话要求您转账到「安全账户」。接到这类电话，直接挂断，让家人帮忙报警核实。',
  },
  {
    title: '养老返利项目要警惕',
    content: '以「国家养老项目」「养老返利分红」为名的宣传，很多是骗局。正规养老政策不会要求您先交钱再返利。',
  },
  {
    title: '转账前多核实',
    content: '凡是要求您向陌生个人账户转账的，务必先和家人、社区工作人员核实。宁可多问一句，也不要急着转钱。',
  },
]

function toggleKnowledge(idx) {
  expanded.value[idx] = !expanded.value[idx]
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx;
  background: #f0f4f8;
}

.tabs {
  display: flex;
  background: #fff;
  border-radius: 20rpx;
  padding: 6rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.tab {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 34rpx;
  color: #718096;
  border-radius: 16rpx;
  font-weight: 600;
  transition: all 0.2s;

  &.active {
    background: linear-gradient(135deg, #2b6cb0, #4299e1);
    color: #fff;
    font-weight: 700;
    box-shadow: 0 2rpx 8rpx rgba(43, 108, 176, 0.3);
  }
}

.section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.step-card {
  display: flex;
  gap: 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid #e2e8f0;
}

.step-num {
  flex-shrink: 0;
  width: 64rpx;
  height: 64rpx;
  line-height: 64rpx;
  text-align: center;
  background: linear-gradient(135deg, #3182ce, #4299e1);
  color: #fff;
  border-radius: 50%;
  font-size: 36rpx;
  font-weight: 700;
}

.step-content {
  flex: 1;
}

.step-title {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12rpx;
}

.step-desc {
  font-size: 32rpx;
  color: #4a5568;
  line-height: 1.7;
}

.knowledge-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid #e2e8f0;
}

.knowledge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

.knowledge-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #1a1a2e;
  flex: 1;
}

.arrow {
  font-size: 24rpx;
  color: #a0aec0;
}

.knowledge-body {
  display: block;
  margin-top: 20rpx;
  font-size: 32rpx;
  color: #4a5568;
  line-height: 1.8;
  padding-top: 20rpx;
  border-top: 1rpx solid #e2e8f0;
}
</style>
