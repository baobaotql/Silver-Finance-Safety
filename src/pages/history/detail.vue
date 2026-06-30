<template>
  <view v-if="record" class="page">
    <view class="risk-header" :class="riskClass">
      <view class="risk-header-bg" />
      <view class="risk-header-content">
        <view class="risk-icon-circle" :class="riskClass">
          <text class="risk-icon-text">{{ riskConfig.icon }}</text>
        </view>
        <text class="risk-level-label">{{ riskConfig.label }}</text>
        <text class="time-text">{{ formatTime(record.createdAt) }}</text>
      </view>
    </view>

    <view class="content">
      <ResultCard title="风险类型" :content="record.riskType" />
      <ResultCard title="风险原因" :content="record.riskReason" />
      <ResultCard title="通俗解读">
        <text class="plain-text">{{ record.plainExplanation }}</text>
      </ResultCard>
      <ResultCard title="防骗建议">
        <view class="suggestion-list">
          <view v-for="(item, idx) in record.suggestions" :key="idx" class="suggestion-item">
            <view class="suggestion-num-wrap">
              <text class="suggestion-num">{{ idx + 1 }}</text>
            </view>
            <text class="suggestion-text">{{ item }}</text>
          </view>
        </view>
      </ResultCard>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ResultCard from '../../components/ResultCard.vue'
import { RISK_LEVEL_CONFIG } from '../../utils/constants'
import { getHistoryById } from '../../utils/storage'

const record = ref(null)

const riskConfig = computed(() =>
  RISK_LEVEL_CONFIG[record.value?.riskLevel] || RISK_LEVEL_CONFIG.low,
)

const riskClass = computed(() => {
  const level = record.value?.riskLevel
  if (level === 'high') return 'risk-high'
  if (level === 'caution') return 'risk-caution'
  return 'risk-low'
})

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

onLoad((query) => {
  if (query.id) {
    record.value = getHistoryById(query.id)
  }
  if (!record.value) {
    uni.showToast({ title: '记录不存在', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: 48rpx;
  background: #f0f4f8;
}

/* ===== 风险头部 ===== */
.risk-header {
  position: relative;
  padding: 48rpx 40rpx 40rpx;
  overflow: hidden;
}

.risk-header-bg {
  position: absolute;
  inset: 0;
  border-radius: 0 0 48rpx 48rpx;
}

.risk-high .risk-header-bg {
  background: linear-gradient(180deg, #e53e3e 0%, #fc8181 100%);
}

.risk-caution .risk-header-bg {
  background: linear-gradient(180deg, #d69e2e 0%, #ecc94b 100%);
}

.risk-low .risk-header-bg {
  background: linear-gradient(180deg, #38a169 0%, #48bb78 100%);
}

.risk-header-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.risk-icon-circle {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.risk-icon-text {
  font-size: 44rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.risk-level-label {
  font-size: 44rpx;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 4rpx;
}

.time-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
}

.content {
  padding: 24rpx 32rpx 0;
}

.plain-text {
  font-size: 40rpx;
  color: #1a1a2e;
  line-height: 1.8;
  font-weight: 500;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.suggestion-item {
  display: flex;
  gap: 16rpx;
  align-items: flex-start;
}

.suggestion-num-wrap {
  flex-shrink: 0;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #3182ce, #4299e1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4rpx;
}

.suggestion-num {
  color: #fff;
  font-size: 28rpx;
  font-weight: 700;
}

.suggestion-text {
  flex: 1;
  font-size: 36rpx;
  color: #4a5568;
  line-height: 1.7;
}
</style>
