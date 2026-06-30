<template>
  <view class="result-card">
    <text class="card-title">{{ title }}</text>
    <view class="card-body">
      <slot>
        <text class="card-text">{{ content }}</text>
      </slot>
    </view>
  </view>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  content: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.result-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid #e2e8f0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 38rpx;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 20rpx;
  padding-left: 16rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8rpx;
    height: 36rpx;
    background: linear-gradient(180deg, #3182ce, #4299e1);
    border-radius: 4rpx;
  }
}

.card-body {
  padding-left: 24rpx;
}

.card-text {
  font-size: 36rpx;
  color: #4a5568;
  line-height: 1.8;
}
</style>
