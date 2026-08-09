<script setup lang="ts">
/**
 * 通用组件 —— 骨架屏（文章列表加载占位）
 */
withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 3,
  },
)
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="i in count"
      :key="i"
      class="animate-pulse rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="mb-3 h-5 w-3/5 rounded bg-gray-200 dark:bg-gray-700" />
      <div class="mb-2 h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
      <div class="mb-2 h-4 w-4/5 rounded bg-gray-100 dark:bg-gray-800" />
      <div class="mt-4 flex items-center gap-3">
        <div class="h-4 w-16 rounded bg-gray-100 dark:bg-gray-800" />
        <div class="h-4 w-24 rounded bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  </div>
</template>
