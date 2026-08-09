<script setup lang="ts">
/**
 * 业务组件 —— 分类云
 * 点击跳转对应分类文章列表；当前分类高亮。
 */
import { Folder } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

import type { CategoryInfo } from '@/types'

defineProps<{
  categories: CategoryInfo[]
  loading?: boolean
}>()

const route = useRoute()
</script>

<template>
  <div v-if="loading" class="space-y-2">
    <div v-for="i in 3" :key="i" class="h-6 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
  </div>

  <div v-else-if="categories.length" class="flex flex-wrap gap-2">
    <router-link
      v-for="category in categories"
      :key="category.id"
      :to="`/category/${category.id}`"
      class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors"
      :class="
        String(route.params.id) === String(category.id)
          ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-400'
          : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400'
      "
    >
      <el-icon :size="12"><Folder /></el-icon>
      {{ category.name }}
      <span v-if="category.count != null" class="text-xs opacity-60">{{ category.count }}</span>
    </router-link>
  </div>

  <p v-else class="text-sm text-gray-400">暂无分类</p>
</template>
