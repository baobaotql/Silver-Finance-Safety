<template>
  <view v-if="result" class="page">
    <!-- 风险等级头部 -->
    <view class="risk-header" :class="riskClass">
      <view class="risk-header-bg" />
      <view class="risk-header-content">
        <view class="risk-icon-circle" :class="riskClass">
          <text class="risk-icon-text">{{ riskConfig.icon }}</text>
        </view>
        <text class="risk-level-label">{{ riskConfig.label }}</text>
        <text class="risk-desc">{{ riskConfig.desc }}</text>
      </view>
    </view>

    <!-- 时间信息 -->
    <view class="time-info">
      <text class="time-label">分析时间</text>
      <text class="time-value">{{ formatTime(result.analyzedAt) }}</text>
    </view>

    <view class="content">
      <ResultCard title="风险类型" :content="result.riskType" />
      <ResultCard title="风险原因" :content="result.riskReason" />

      <!-- 案例库匹配：真实案例警示 -->
      <view v-if="matchedCase" class="case-alert">
        <view class="case-alert-header">
          <text class="case-alert-icon">🔍</text>
          <text class="case-alert-title">真实案例警示</text>
          <view class="case-alert-badge">案例库匹配</view>
        </view>
        <view class="case-alert-body">
          <text class="case-title">{{ matchedCase.title }}</text>
          <text class="case-brief">{{ matchedCase.brief }}</text>
          <view class="case-tags">
            <text class="case-tag">{{ matchedCase.category }}</text>
            <text class="case-tag risk-tag">高风险</text>
          </view>
        </view>
        <view class="case-alert-footer">
          <text class="case-alert-warn">⚠ 您的识别内容与上述真实诈骗案例高度相似，请务必提高警惕！</text>
        </view>
      </view>

      <ResultCard title="通俗解读">
        <text class="plain-text">{{ result.plainExplanation }}</text>
      </ResultCard>
      <ResultCard title="防骗建议">
        <view class="suggestion-list">
          <view v-for="(item, idx) in result.suggestions" :key="idx" class="suggestion-item">
            <view class="suggestion-num-wrap">
              <text class="suggestion-num">{{ idx + 1 }}</text>
            </view>
            <text class="suggestion-text">{{ item }}</text>
          </view>
        </view>
      </ResultCard>

      <ResultCard v-if="result.riskLevel !== 'low'" title="识别原文">
        <view class="ocr-text">
          <text
            v-for="(seg, idx) in result.ocrSegments"
            :key="idx"
            :class="{ highlight: seg.highlight }"
          >{{ seg.text }}</text>
        </view>
      </ResultCard>
    </view>

    <!-- 真实性提醒（所有风险等级统一展示） -->
    <view class="authenticity-reminder">
      <view class="reminder-icon-wrap">
        <text class="reminder-icon">⚠</text>
      </view>
      <text class="reminder-text">{{ authenticityText }}</text>
    </view>

    <!-- 底部操作区 -->
    <view class="footer-section">
      <view class="footer-actions">
        <button class="btn-back" @tap="goHome">返回首页</button>
        <button class="btn-again" @tap="goAgain">再识别一张</button>
      </view>
    </view>

    <!-- 风险结果免责声明（固定展示） -->
    <view class="disclaimer-bar">
      <text class="disclaimer-text">{{ disclaimerText }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ResultCard from '../../components/ResultCard.vue'
import { RISK_LEVEL_CONFIG, AUTHENTICITY_REMINDER, RISK_DISCLAIMER } from '../../utils/constants'
import { getHistoryById } from '../../utils/storage'

const result = ref(null)
const authenticityText = AUTHENTICITY_REMINDER
const disclaimerText = RISK_DISCLAIMER

const matchedCase = computed(() => result.value?.matchedCase || null)

const riskConfig = computed(() =>
  RISK_LEVEL_CONFIG[result.value?.riskLevel] || RISK_LEVEL_CONFIG.low,
)

const riskClass = computed(() => {
  const level = result.value?.riskLevel
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
  // 优先从历史记录获取（保证数据完整，避免 latest_result 残留旧数据）
  if (query.id) {
    const record = getHistoryById(query.id)
    if (record) {
      result.value = record
      // 同步更新 latest_result 为最新版本
      uni.setStorageSync('latest_result', record)
      return
    }
  }
  // 兜底：latest_result（正常情况不应走到这里，但保留兼容）
  const latest = uni.getStorageSync('latest_result')
  if (latest) {
    result.value = latest
    return
  }
  if (!result.value) {
    uni.showToast({ title: '未找到结果', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
})

function goHome() {
  uni.reLaunch({ url: '/pages/index/index' })
}

function goAgain() {
  uni.reLaunch({ url: '/pages/index/index' })
}
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
  padding: 56rpx 40rpx 48rpx;
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
  gap: 16rpx;
}

.risk-icon-circle {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
}

.risk-icon-text {
  font-size: 52rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.risk-level-label {
  font-size: 48rpx;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 4rpx;
}

.risk-desc {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 1.5;
}

/* ===== 时间信息 ===== */
.time-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  margin: -24rpx 32rpx 0;
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 2;
}

.time-label {
  font-size: 28rpx;
  color: #a0aec0;
}

.time-value {
  font-size: 28rpx;
  color: #4a5568;
  font-weight: 600;
}

/* ===== 内容区 ===== */
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

.ocr-text {
  font-size: 34rpx;
  color: #4a5568;
  line-height: 1.8;
}

.highlight {
  color: #e53e3e;
  font-weight: 700;
  background: #fff5f5;
  padding: 2rpx 6rpx;
  border-radius: 4rpx;
}

/* ===== 案例库匹配警示卡 ===== */
.case-alert {
  background: #fff5f5;
  border-radius: 20rpx;
  padding: 0;
  margin-bottom: 20rpx;
  border: 2rpx solid #e53e3e;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(229, 62, 62, 0.12);
}

.case-alert-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx 28rpx 0;
}

.case-alert-icon {
  font-size: 36rpx;
}

.case-alert-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #c53030;
  flex: 1;
}

.case-alert-badge {
  font-size: 24rpx;
  color: #e53e3e;
  background: #fff;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  border: 1rpx solid #feb2b2;
  font-weight: 600;
}

.case-alert-body {
  padding: 20rpx 28rpx 16rpx;
}

.case-title {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12rpx;
  line-height: 1.4;
}

.case-brief {
  display: block;
  font-size: 34rpx;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 16rpx;
}

.case-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.case-tag {
  font-size: 26rpx;
  padding: 6rpx 18rpx;
  border-radius: 8rpx;
  background: #edf2f7;
  color: #4a5568;
  font-weight: 600;
}

.case-tag.risk-tag {
  background: #fed7d7;
  color: #c53030;
}

.case-alert-footer {
  padding: 18rpx 28rpx;
  background: rgba(229, 62, 62, 0.08);
  border-top: 1rpx solid #feb2b2;
}

.case-alert-warn {
  font-size: 30rpx;
  color: #c53030;
  font-weight: 700;
  line-height: 1.6;
  display: block;
  text-align: center;
}

/* ===== 真实性提醒 ===== */
.authenticity-reminder {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin: 24rpx 32rpx 0;
  padding: 24rpx 28rpx;
  background: #f7f8fa;
  border-radius: 16rpx;
  border: 1rpx solid #e8ecf1;
}

.reminder-icon-wrap {
  flex-shrink: 0;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reminder-icon {
  font-size: 32rpx;
  line-height: 1;
}

.reminder-text {
  flex: 1;
  font-size: 26rpx;
  color: #7c8ba0;
  line-height: 1.7;
}

/* ===== 底部操作区 ===== */
.footer-section {
  padding: 32rpx 32rpx 16rpx;
}

.footer-actions {
  display: flex;
  gap: 24rpx;
}

.btn-back,
.btn-again {
  flex: 1;
  height: 96rpx;
  line-height: 96rpx;
  font-size: 36rpx;
  border-radius: 48rpx;
  border: none;
  padding: 0;
  font-weight: 600;
  &::after { border: none; }
}

.btn-back {
  background: #edf2f7;
  color: #4a5568;
}

.btn-again {
  background: linear-gradient(135deg, #2b6cb0, #4299e1);
  color: #fff;
  box-shadow: 0 4rpx 16rpx rgba(43, 108, 176, 0.3);
}

/* ===== 免责声明 ===== */
.disclaimer-bar {
  margin: 16rpx 32rpx 48rpx;
  padding: 20rpx 28rpx;
  background: #fafafa;
  border-radius: 12rpx;
  border: 1rpx solid #e8ecf1;
}

.disclaimer-text {
  font-size: 26rpx;
  color: #a0aec0;
  line-height: 1.7;
  text-align: center;
  display: block;
}
</style>
