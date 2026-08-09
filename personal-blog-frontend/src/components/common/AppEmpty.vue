<script setup lang="ts">
/**
 * 通用组件 —— 空状态
 */
withDefaults(
  defineProps<{
    description?: string
  }>(),
  {
    description: '暂无内容',
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 py-12">
    <el-empty :description="description">
      <slot />
    </el-empty>
  </div>
</template>
