<template>
  <view class="page">
    <!-- 顶部导航区 -->
    <view class="top-bar">
      <text class="top-title">正在识别</text>
    </view>

    <!-- 图片预览 -->
    <view class="preview-wrap">
      <image v-if="imagePath" class="preview" :src="imagePath" mode="aspectFit" />
      <view v-else class="preview-placeholder">
        <view class="placeholder-frame" />
      </view>
      <view class="preview-overlay">
        <view class="scan-line" />
      </view>
    </view>

    <!-- 加载动画区 -->
    <view class="loading-area">
      <view class="spinner-wrap">
        <view class="spinner-ring" />
        <view class="spinner-core" />
      </view>
      <text class="loading-title">{{ stageText }}</text>
      <text class="loading-hint">请稍候，正在为您智能分析风险</text>
      <view class="progress-dots">
        <view class="dot" :class="{ active: step >= 0 }" />
        <view class="dot-line" :class="{ active: step >= 1 }" />
        <view class="dot" :class="{ active: step >= 1 }" />
        <view class="dot-line" :class="{ active: step >= 2 }" />
        <view class="dot" :class="{ active: step >= 2 }" />
      </view>
      <view class="step-labels">
        <text class="step-label" :class="{ active: step >= 0 }">图片识别</text>
        <text class="step-label" :class="{ active: step >= 1 }">文字提取</text>
        <text class="step-label" :class="{ active: step >= 2 }">风险分析</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { analyzeImage } from '../../utils/api'
import { saveHistory } from '../../utils/storage'

const imagePath = ref('')
const stageText = ref('正在识别图片文字…')
const step = ref(0)

onLoad(async (query) => {
  imagePath.value = decodeURIComponent(query.imagePath || '')

  try {
    // 步骤1: 上传图片进行 OCR 和 AI 分析
    step.value = 0
    stageText.value = '正在读取图片…'

    const result = await analyzeImage(imagePath.value, (progress) => {
      if (progress.stage === 'ocr') {
        step.value = 1
        stageText.value = '正在识别图片文字…'
      } else if (progress.stage === 'analyzing') {
        step.value = 2
        stageText.value = '正在分析金融风险…'
      }
    })

    if (!result || !result.ocrText || typeof result.ocrText !== 'string' || result.ocrText.trim().length === 0) {
      uni.showModal({
        title: '识别提示',
        content: '未识别到有效文字，请重新拍摄或上传',
        showCancel: false,
        confirmText: '知道了',
        success: () => uni.navigateBack(),
      })
      return
    }

    // 🔧 临时诊断：matchedCase 状态
    const hasCase = !!result.matchedCase
    console.log('[诊断] analyzeImage 返回结果中 matchedCase:', hasCase, result.matchedCase)

    const saved = saveHistory({
      imagePath: imagePath.value,
      ...result,
    })

    console.log('[诊断] saveHistory 后 matchedCase:', !!saved.matchedCase, saved.matchedCase)
    console.log('[诊断] saved 完整 keys:', Object.keys(saved).join(', '))

    uni.setStorageSync('latest_result', saved)
    uni.redirectTo({
      url: `/pages/result/result?id=${saved.id}`,
    })
  } catch (err) {
    console.error('分析失败:', err)
    uni.showModal({
      title: '识别失败',
      content: err.message || '未知错误，请重试',
      showCancel: false,
      confirmText: '返回',
      success: () => uni.navigateBack(),
    })
  }
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f4f8;
}

/* ===== 顶部 ===== */
.top-bar {
  width: 100%;
  padding: 32rpx 40rpx;
  text-align: center;
}

.top-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #1a1a2e;
}

/* ===== 图片预览 ===== */
.preview-wrap {
  width: 520rpx;
  height: 520rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  position: relative;
}

.preview {
  width: 100%;
  height: 100%;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #edf2f7;
}

.placeholder-frame {
  width: 120rpx;
  height: 120rpx;
  border: 4rpx dashed #cbd5e0;
  border-radius: 20rpx;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  border-radius: 24rpx;
  overflow: hidden;
  pointer-events: none;
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 3rpx;
  background: linear-gradient(90deg, transparent, #3182ce, transparent);
  animation: scanMove 2s ease-in-out infinite;
  box-shadow: 0 0 20rpx rgba(49, 130, 206, 0.5);
}

@keyframes scanMove {
  0%, 100% { top: 10%; }
  50% { top: 85%; }
}

/* ===== 加载动画区 ===== */
.loading-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  margin-top: 56rpx;
  padding: 0 48rpx;
}

.spinner-wrap {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 12rpx;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 6rpx solid #e2e8f0;
  border-top-color: #3182ce;
  border-right-color: #63b3ed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-core {
  position: absolute;
  inset: 24rpx;
  background: #ebf8ff;
  border-radius: 50%;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #1a1a2e;
}

.loading-hint {
  font-size: 32rpx;
  color: #718096;
}

/* ===== 步骤指示器 ===== */
.progress-dots {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: 12rpx;
}

.dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 12rpx;
  background: #e2e8f0;
  transition: all 0.3s;

  &.active {
    background: #3182ce;
    box-shadow: 0 0 12rpx rgba(49, 130, 206, 0.5);
  }
}

.dot-line {
  width: 80rpx;
  height: 4rpx;
  background: #e2e8f0;
  transition: all 0.3s;

  &.active {
    background: #3182ce;
  }
}

.step-labels {
  display: flex;
  justify-content: space-between;
  width: 400rpx;
}

.step-label {
  font-size: 26rpx;
  color: #a0aec0;
  transition: color 0.3s;

  &.active {
    color: #3182ce;
    font-weight: 600;
  }
}
</style>
