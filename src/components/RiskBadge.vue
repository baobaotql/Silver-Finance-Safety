<template>
  <view class="risk-badge" :style="{ background: config.bgColor, borderColor: config.color }">
    <text class="risk-icon" :style="{ color: config.color }">{{ config.icon }}</text>
    <text class="risk-label" :style="{ color: config.color }">{{ config.label }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { RISK_LEVEL_CONFIG } from '../utils/constants'

const props = defineProps({
  level: { type: String, required: true },
  large: { type: Boolean, default: false },
})

const config = computed(() => RISK_LEVEL_CONFIG[props.level] || RISK_LEVEL_CONFIG.low)
</script>

<style lang="scss" scoped>
.risk-badge {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 8rpx 24rpx;
  border-radius: 48rpx;
  border: 2rpx solid;
}

.risk-icon {
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1;
}

.risk-label {
  font-size: 36rpx;
  font-weight: 700;
}
</style>
