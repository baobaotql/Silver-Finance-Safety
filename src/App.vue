<script setup>
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('灵溪识险启动')
})
</script>

<style lang="scss">
@import './uni.scss';

page {
  background-color: $bg-page;
  color: $text-primary;
  font-size: $font-base;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* 全局按钮重置 */
button {
  &::after {
    border: none;
  }
}
</style>
