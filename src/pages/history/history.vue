<template>
  <view class="page">
    <view v-if="list.length === 0" class="empty">
      <view class="empty-illustration">
        <view class="empty-ring" />
      </view>
      <text class="empty-text">暂无识别记录</text>
      <text class="empty-hint">拍照或上传图片后，分析结果会保存在这里</text>
      <button class="btn-go" @tap="goHome">去识别</button>
    </view>

    <view v-else class="has-data">
      <view class="toolbar">
        <view class="count-badge">
          <text class="count-num">{{ list.length }}</text>
          <text class="count-label">条记录</text>
        </view>
        <view class="clear-btn" @tap="onClearAll">
          <text class="clear-text">清空全部</text>
        </view>
      </view>

      <view class="list">
        <view
          v-for="item in list"
          :key="item.id"
          class="list-item"
          @tap="goDetail(item.id)"
        >
          <view class="item-left">
            <view class="item-risk-dot" :class="'dot-' + item.riskLevel" />
            <view class="item-info">
              <view class="item-top">
                <RiskBadge :level="item.riskLevel" />
              </view>
              <text class="item-type">{{ item.riskType }}</text>
              <text class="item-time">{{ formatTime(item.createdAt) }}</text>
            </view>
          </view>
          <view class="item-right">
            <view class="delete-btn" @tap.stop="onDelete(item.id)">
              <text class="delete-icon">✕</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import RiskBadge from '../../components/RiskBadge.vue'
import { getHistory, deleteHistory, clearHistory } from '../../utils/storage'

const list = ref([])

onShow(() => {
  list.value = getHistory()
})

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/result/result?id=${id}` })
}

function onDelete(id) {
  uni.showModal({
    title: '确认删除',
    content: '确定删除这条记录吗？',
    confirmText: '删除',
    success: (res) => {
      if (res.confirm) {
        deleteHistory(id)
        list.value = getHistory()
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    },
  })
}

function onClearAll() {
  uni.showModal({
    title: '确认清空',
    content: '确定清空全部历史记录吗？此操作不可恢复。',
    confirmText: '清空',
    success: (res) => {
      if (res.confirm) {
        clearHistory()
        list.value = []
        uni.showToast({ title: '已清空', icon: 'success' })
      }
    },
  })
}

function goHome() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx;
  background: #f0f4f8;
}

/* ===== 空状态 ===== */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 160rpx;
  gap: 20rpx;
}

.empty-illustration {
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  background: #edf2f7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.empty-ring {
  width: 80rpx;
  height: 80rpx;
  border: 5rpx solid #cbd5e0;
  border-radius: 50%;
  border-top-color: transparent;
  border-right-color: transparent;
}

.empty-text {
  font-size: 44rpx;
  font-weight: 700;
  color: #1a1a2e;
}

.empty-hint {
  font-size: 32rpx;
  color: #718096;
  text-align: center;
  padding: 0 48rpx;
  line-height: 1.6;
}

.btn-go {
  margin-top: 24rpx;
  width: 320rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: linear-gradient(135deg, #2b6cb0, #4299e1);
  color: #fff;
  font-size: 36rpx;
  border-radius: 48rpx;
  border: none;
  font-weight: 600;
  box-shadow: 0 4rpx 16rpx rgba(43, 108, 176, 0.3);
  &::after { border: none; }
}

/* ===== 有数据状态 ===== */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding: 0 4rpx;
}

.count-badge {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.count-num {
  font-size: 40rpx;
  font-weight: 800;
  color: #2b6cb0;
}

.count-label {
  font-size: 32rpx;
  color: #718096;
}

.clear-btn {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  background: #fff5f5;
  border-radius: 32rpx;
  border: 1rpx solid #fed7d7;
}

.clear-text {
  font-size: 28rpx;
  color: #e53e3e;
  font-weight: 600;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.list-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 28rpx 28rpx 32rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  border: 1rpx solid #e2e8f0;
}

.item-left {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.item-risk-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 6rpx;
  margin-top: 10rpx;
  flex-shrink: 0;
}

.dot-low { background: #38a169; }
.dot-caution { background: #d69e2e; }
.dot-high { background: #e53e3e; }

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.item-top {
  display: flex;
  align-items: center;
}

.item-type {
  font-size: 36rpx;
  color: #1a1a2e;
  font-weight: 700;
}

.item-time {
  font-size: 28rpx;
  color: #a0aec0;
}

.item-right {
  flex-shrink: 0;
  margin-left: 16rpx;
}

.delete-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  background: #fff5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  font-size: 28rpx;
  color: #e53e3e;
  font-weight: 700;
}
</style>
