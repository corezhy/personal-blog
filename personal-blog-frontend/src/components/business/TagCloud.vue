<script setup lang="ts">
/**
 * 业务组件 —— 标签云
 * 标签大小随文章数缩放；点击跳转对应标签文章列表。
 */
import { useRoute } from 'vue-router'

import type { TagInfo } from '@/types'

defineProps<{
  tags: TagInfo[]
  loading?: boolean
}>()

const route = useRoute()

/** 按文章数计算字号（12 ~ 18px） */
function fontSize(count?: number): string {
  const n = Math.min(count ?? 1, 20)
  return `${Math.round(12 + (n / 20) * 6)}px`
}
</script>

<template>
  <div v-if="loading" class="space-y-2">
    <div v-for="i in 4" :key="i" class="h-5 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
  </div>

  <div v-else-if="tags.length" class="flex flex-wrap gap-x-3 gap-y-2">
    <router-link
      v-for="tag in tags"
      :key="tag.id"
      :to="`/tag/${tag.id}`"
      :style="{ fontSize: fontSize(tag.count) }"
      class="leading-relaxed text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      :class="
        String(route.params.id) === String(tag.id) ? '!text-blue-600 dark:!text-blue-400' : ''
      "
    >
      # {{ tag.name }}
    </router-link>
  </div>

  <p v-else class="text-sm text-gray-400">暂无标签</p>
</template>
