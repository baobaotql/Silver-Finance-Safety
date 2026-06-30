<template>
  <view v-if="visible" class="modal-mask" @tap.stop>
    <view class="modal-card" @tap.stop>
      <text class="modal-title">使用授权说明</text>
      <text class="modal-content">{{ privacyText }}</text>
      <view class="modal-actions">
        <button class="btn-cancel" @tap="onCancel">暂不使用</button>
        <button class="btn-confirm" @tap="onConfirm">同意并继续</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { PRIVACY_TEXT } from '../utils/constants'

defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])
const privacyText = PRIVACY_TEXT

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 48rpx;
  backdrop-filter: blur(4rpx);
}

.modal-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 48rpx 40rpx;
  width: 100%;
  max-width: 640rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.12);
}

.modal-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  font-size: 44rpx;
  font-weight: 800;
  color: #1a1a2e;
  text-align: center;
  margin-bottom: 28rpx;
}

.modal-content {
  display: block;
  font-size: 34rpx;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 40rpx;
  background: #f7fafc;
  padding: 24rpx;
  border-radius: 16rpx;
}

.modal-actions {
  display: flex;
  gap: 20rpx;
}

.btn-cancel,
.btn-confirm {
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

.btn-cancel {
  background: #edf2f7;
  color: #718096;
}

.btn-confirm {
  background: linear-gradient(135deg, #2b6cb0, #4299e1);
  color: #fff;
  box-shadow: 0 4rpx 16rpx rgba(43, 108, 176, 0.3);
}
</style>
