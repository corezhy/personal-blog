<script setup lang="ts">
/**
 * 业务组件 —— 点赞按钮（展示层）
 */
import { Star } from '@element-plus/icons-vue'

defineProps<{
  liked: boolean
  count: number
  loading?: boolean
}>()

defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<template>
  <el-button
    :type="liked ? 'warning' : 'default'"
    :loading="loading"
    :plain="!liked"
    class="rounded-full"
    @click="$emit('toggle')"
  >
    <el-icon :size="15"><Star :class="liked ? 'fill-current' : ''" /></el-icon>
    <span class="ml-1">{{ count }}</span>
  </el-button>
</template>
