<template>
  <view class="page">
    <!-- 顶部区域 -->
    <view class="header-section">
      <view class="header-content">
        <text class="app-title">灵溪识险</text>
        <text class="app-slogan">拍一拍，让诈骗信息无处可藏</text>
      </view>
    </view>

    <!-- 核心功能按钮 -->
    <view class="main-actions">
      <button class="action-btn btn-camera" hover-class="btn-camera-hover" @tap="onCamera">
        <view class="camera-btn-body">
          <view class="cam-icon-lg">
            <view class="cam-body-rect" />
            <view class="cam-lens-big" />
            <view class="cam-flash" />
          </view>
          <text class="btn-main-text">拍照识别</text>
          <text class="btn-sub-text">拍摄可疑信息进行风险分析</text>
          <text class="btn-action-hint">点击立即识别</text>
        </view>
      </button>
      <button class="action-btn btn-album" hover-class="btn-album-hover" @tap="onAlbum">
        <view class="album-btn-body">
          <view class="alb-icon-lg">
            <view class="alb-frame" />
            <view class="alb-mountain" />
            <view class="alb-sun" />
          </view>
          <text class="btn-main-text">相册上传</text>
          <text class="btn-sub-text">从相册选择图片进行识别</text>
        </view>
      </button>
    </view>

    <!-- 辅助功能卡片 -->
    <view class="sub-actions">
      <view class="sub-card" hover-class="sub-card-hover" @tap="goHistory">
        <view class="card-icon-box history-icon-box">
          <view class="doc-icon">
            <view class="doc-cover" />
            <view class="doc-line l1" />
            <view class="doc-line l2" />
            <view class="doc-line l3" />
          </view>
        </view>
        <text class="sub-label">我的识别</text>
        <text class="sub-desc">查看过往识别结果</text>
      </view>
      <view class="sub-card" hover-class="sub-card-hover" @tap="goHelp">
        <view class="card-icon-box class-icon-box">
          <view class="book-icon">
            <view class="bk-page-l" />
            <view class="bk-page-r" />
            <view class="bk-spine" />
            <view class="bk-star" />
          </view>
        </view>
        <text class="sub-label class-label">防骗课堂</text>
        <text class="sub-desc">学习防骗知识与技巧</text>
      </view>
    </view>

    <!-- 温馨提示 -->
    <view class="tips-card">
      <text class="tips-title">温馨提示</text>
      <text class="tips-text">您可以拍摄聊天记录、短信、宣传单、合同、APP页面等照片，帮您快速识别金融风险。</text>
    </view>

    <!-- 底部隐私提示 -->
    <view class="footer-safe">
      <view class="lock-icon">
        <view class="lk-shackle" />
        <view class="lk-body" />
      </view>
      <text class="safe-text">您的隐私数据全程加密保护</text>
    </view>

    <PrivacyModal
      :visible="showPrivacy"
      @confirm="onPrivacyConfirm"
      @cancel="onPrivacyCancel"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PrivacyModal from '../../components/PrivacyModal.vue'
import { chooseImage } from '../../utils/image'
import { isPrivacyAgreed, setPrivacyAgreed } from '../../utils/storage'

const showPrivacy = ref(false)
let pendingAction = null

onMounted(() => {
  if (!isPrivacyAgreed()) {
    showPrivacy.value = true
  }
})

function onPrivacyConfirm() {
  setPrivacyAgreed()
  showPrivacy.value = false
  if (pendingAction) {
    pendingAction()
    pendingAction = null
  }
}

function onPrivacyCancel() {
  showPrivacy.value = false
  pendingAction = null
}

function ensurePrivacy(callback) {
  if (isPrivacyAgreed()) {
    callback()
  } else {
    pendingAction = callback
    showPrivacy.value = true
  }
}

async function startRecognize(sourceType) {
  try {
    const imagePath = await chooseImage(sourceType)
    uni.navigateTo({
      url: `/pages/analyzing/analyzing?imagePath=${encodeURIComponent(imagePath)}`,
    })
  } catch (err) {
    if (err.message !== 'cancel') {
      uni.showToast({ title: '选择图片失败，请重试', icon: 'none', duration: 2500 })
    }
  }
}

function onCamera() {
  ensurePrivacy(() => startRecognize('camera'))
}

function onAlbum() {
  ensurePrivacy(() => startRecognize('album'))
}

function goHistory() {
  uni.navigateTo({ url: '/pages/history/history' })
}

function goHelp() {
  uni.navigateTo({ url: '/pages/help/help' })
}
</script>

<style lang="scss" scoped>
/* ==================== 设计系统 ==================== */
// 主色：#0047AB  辅助色：#D4AF37  警示：#E53935
// 圆角系统：按钮32rpx(16px)  卡片24rpx(12px)
// 字体：PingFang SC / 无衬线系统字体

.page {
  min-height: 100vh;
  padding-bottom: 48rpx;
  box-sizing: border-box;
  position: relative;
  background: #ffffff;
}

/* ===== 顶部区域（白底 + 官方蓝点缀） ===== */
.header-section {
  background: #ffffff;
  padding: 36rpx 40rpx 36rpx;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14rpx;
}

/* 标题 - 加大 */
.app-title {
  font-size: 54rpx;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 4rpx;
  line-height: 1.2;
}

.app-slogan {
  font-size: 34rpx;
  color: #4a6078;
  text-align: center;
  line-height: 1.4;
}

/* ===== 核心功能按钮 ===== */
.main-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18rpx;
  padding: 0 36rpx;
  margin-top: 10rpx;
  position: relative;
  z-index: 2;
}

.action-btn {
  width: 100%;
  border: none;
  padding: 0;
  line-height: normal;
  &::after { border: none; }
}

/* ── 一级主按钮：拍照识别（渐变 + 柔和阴影）── */
.btn-camera {
  border-radius: 32rpx;
  overflow: hidden;
}

.camera-btn-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 32rpx 26rpx;
  background: linear-gradient(160deg, #0047ab 0%, #0066cc 100%);
  box-shadow: 0 8rpx 24rpx rgba(0, 71, 171, 0.25);
  border-radius: 32rpx;
  transition: all 0.15s;
}

.btn-camera-hover .camera-btn-body {
  background: linear-gradient(160deg, #003380 0%, #0047ab 100%);
  box-shadow: 0 6rpx 20rpx rgba(0, 71, 171, 0.35);
  transform: scale(0.98);
}

/* 相机图标 */
.cam-icon-lg {
  position: relative;
  width: 52rpx;
  height: 40rpx;
  margin-bottom: 2rpx;
}

.cam-body-rect {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.15);
  border: 2.5rpx solid rgba(255, 255, 255, 0.6);
  border-radius: 9rpx;
}

.cam-lens-big {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rpx;
  height: 20rpx;
  border: 2.5rpx solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5rpx;
    height: 5rpx;
    background: #ffffff;
    border-radius: 50%;
  }
}

.cam-flash {
  position: absolute;
  top: 5rpx;
  right: 6rpx;
  width: 6rpx;
  height: 6rpx;
  background: #ffffff;
  border-radius: 50%;
  opacity: 0.7;
}

/* ── 二级按钮：虚线边框上传区域 ── */
.btn-album {
  border-radius: 32rpx;
  overflow: hidden;
}

.album-btn-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  padding: 32rpx 26rpx;
  background: #ffffff;
  border: 2.5rpx dashed #0047ab;
  border-radius: 32rpx;
  transition: all 0.15s;
}

.btn-album-hover .album-btn-body {
  background: #f0f5fb;
  border-color: #003380;
}

/* 相册图标 */
.alb-icon-lg {
  position: relative;
  width: 52rpx;
  height: 44rpx;
  margin-bottom: 2rpx;
}

.alb-frame {
  position: absolute;
  inset: 0;
  border: 2.5rpx solid #0047ab;
  border-radius: 8rpx;
}

.alb-mountain {
  position: absolute;
  bottom: 7rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12rpx solid transparent;
  border-right: 12rpx solid transparent;
  border-bottom: 15rpx solid rgba(0, 71, 171, 0.15);
}

.alb-sun {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 8rpx;
  height: 8rpx;
  border: 2rpx solid #0047ab;
  border-radius: 50%;
  opacity: 0.4;
}

/* 按钮文字 */
.btn-main-text {
  font-size: 42rpx;
  font-weight: 700;
  line-height: 1.2;
}

.btn-camera .btn-main-text {
  color: #ffffff;
}

.btn-album .btn-main-text {
  color: #0047ab;
}

.btn-sub-text {
  font-size: 28rpx;
  line-height: 1.4;
}

.btn-camera .btn-sub-text {
  color: rgba(255, 255, 255, 0.75);
}

.btn-album .btn-sub-text {
  color: #5a6b7d;
}

.btn-action-hint {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  line-height: 1;
  margin-top: 2rpx;
}

/* ===== 辅助功能卡片（圆角24rpx/12px系统） ===== */
.sub-actions {
  display: flex;
  gap: 22rpx;
  padding: 0 36rpx;
  margin-top: 20rpx;
}

.sub-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  background: #f7f9fc;
  border-radius: 24rpx;
  padding: 40rpx 20rpx;
  min-height: 240rpx;
  box-sizing: border-box;
  border: 1rpx solid #e8ecf1;
  transition: all 0.15s;
}

.sub-card-hover {
  background: #edf2f8;
  border-color: #bccddd;
}

/* 卡片图标底座 */
.card-icon-box {
  width: 72rpx;
  height: 72rpx;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rpx;
}

.history-icon-box {
  background: #eaf0f8;
}

.class-icon-box {
  background: #faf6ed;
  border: 1rpx solid rgba(212, 175, 55, 0.3);
}

/* ── 文档图标（我的识别）── */
.doc-icon {
  position: relative;
  width: 34rpx;
  height: 40rpx;
}

.doc-cover {
  position: absolute;
  inset: 0;
  border: 2.5rpx solid #2b6cb0;
  border-radius: 4rpx;
}

.doc-line {
  position: absolute;
  left: 7rpx;
  right: 7rpx;
  height: 2rpx;
  background: #2b6cb0;
  border-radius: 1rpx;
}
.l1 { top: 14rpx; }
.l2 { top: 20rpx; }
.l3 { top: 26rpx; width: 14rpx; left: 7rpx; right: auto; }

/* ── 书本图标（防骗课堂）── */
.book-icon {
  position: relative;
  width: 40rpx;
  height: 34rpx;
}

.bk-page-l {
  position: absolute;
  left: 0;
  top: 2rpx;
  width: 18rpx;
  height: 30rpx;
  border: 2rpx solid #D4AF37;
  border-radius: 3rpx 0 0 3rpx;
  border-right: none;
}

.bk-page-r {
  position: absolute;
  right: 0;
  top: 0;
  width: 18rpx;
  height: 32rpx;
  border: 2rpx solid #D4AF37;
  border-radius: 0 3rpx 3rpx 0;
  border-left: 2rpx solid rgba(212, 175, 55, 0.5);
}

.bk-spine {
  position: absolute;
  left: 50%;
  top: 2rpx;
  transform: translateX(-50%);
  width: 2rpx;
  height: 28rpx;
  background: rgba(212, 175, 55, 0.5);
}

.bk-star {
  position: absolute;
  top: 4rpx;
  right: 2rpx;
  width: 8rpx;
  height: 8rpx;
  background: #D4AF37;
  border-radius: 50%;
}

.sub-label {
  font-size: 36rpx;
  color: #1e293b;
  font-weight: 700;
  line-height: 1.3;
}

.class-label {
  color: #8b6914;
}

.sub-desc {
  font-size: 28rpx;
  color: #7c8ba0;
  text-align: center;
  line-height: 1.4;
}

/* ===== 温馨提示 ===== */
.tips-card {
  margin: 22rpx 36rpx 0;
  background: #eef4fa;
  border-radius: 20rpx;
  padding: 20rpx 28rpx;
}

.tips-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 10rpx;
  line-height: 1.3;
}

.tips-text {
  display: block;
  font-size: 28rpx;
  color: #4a6078;
  line-height: 1.8;
}

/* ===== 底部隐私提示（锁 + 文字两行居中） ===== */
.footer-safe {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  padding: 44rpx 32rpx 28rpx;
}

.lock-icon {
  width: 28rpx;
  height: 34rpx;
  position: relative;
  flex-shrink: 0;
}

.lk-shackle {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16rpx;
  height: 12rpx;
  border: 2.5rpx solid #7c8ba0;
  border-radius: 8rpx 8rpx 0 0;
  border-bottom: none;
}

.lk-body {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20rpx;
  border: 2.5rpx solid #7c8ba0;
  border-radius: 3rpx 3rpx 0 0;
  border-top: none;
  background: rgba(124, 139, 160, 0.06);
}

.safe-text {
  font-size: 28rpx;
  color: #7c8ba0;
  line-height: 1.4;
  text-align: center;
}
</style>
