<script setup lang="ts">
/**
 * 通用组件 —— 回到顶部
 * 滚动超过阈值后显示浮层按钮，点击平滑回到顶部。
 * target：滚动容器选择器（默认 window），后台布局中用于定位自己的滚动容器。
 */
import { ArrowUp } from '@element-plus/icons-vue'

import { useBackToTop } from '@/hooks/useBackToTop'

const props = withDefaults(
  defineProps<{
    /** 滚动容器选择器，留空则监听 window 滚动 */
    target?: string
    /** 显示阈值（px） */
    threshold?: number
  }>(),
  {
    target: '',
    threshold: 320,
  },
)

const { visible, scrollToTop } = useBackToTop(props.threshold, () =>
  props.target ? document.querySelector(props.target) : null,
)
</script>

<template>
  <transition name="fade">
    <el-tooltip v-if="visible" content="回到顶部" placement="left">
      <el-button
        class="fixed right-6 bottom-6 z-50 !h-11 !w-11 !rounded-full shadow-lg"
        type="primary"
        circle
        aria-label="回到顶部"
        @click="scrollToTop"
      >
        <el-icon :size="18"><ArrowUp /></el-icon>
      </el-button>
    </el-tooltip>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
