<script setup lang="ts">
/**
 * 业务组件 —— 文章卡片
 * 仅负责展示；编辑/删除等操作由父级（ArticleList / 详情页）统一处理。
 */
import { Calendar, Folder, Star, View } from '@element-plus/icons-vue'
import { computed } from 'vue'

import { formatDate } from '@/utils/date'
import { formatCount } from '@/utils/format'
import type { ArticleSummary } from '@/types'

const props = defineProps<{
  article: ArticleSummary
}>()

const detailPath = computed(() => `/article/${props.article.id}`)
const categoryPath = computed(() => `/category/${props.article.category.id}`)
</script>

<template>
  <article
    class="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- 分类徽标 -->
    <div class="mb-3 flex items-center gap-2 text-xs">
      <router-link
        :to="categoryPath"
        class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
      >
        <el-icon :size="12"><Folder /></el-icon>
        {{ article.category.name }}
      </router-link>
    </div>

    <!-- 标题 -->
    <h2 class="text-lg leading-snug font-semibold">
      <router-link
        :to="detailPath"
        class="text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
      >
        {{ article.title }}
      </router-link>
    </h2>

    <!-- 摘要 -->
    <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
      {{ article.summary }}
    </p>

    <!-- 元信息 -->
    <div
      class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 dark:text-gray-500"
    >
      <span class="inline-flex items-center gap-1">
        <el-icon :size="13"><Calendar /></el-icon>
        {{ formatDate(article.createdAt) }}
      </span>
      <span class="inline-flex items-center gap-1">
        <el-icon :size="13"><View /></el-icon>
        {{ formatCount(article.views) }}
      </span>
      <span class="inline-flex items-center gap-1">
        <el-icon :size="13"><Star /></el-icon>
        {{ formatCount(article.likes) }}
      </span>
      <span class="ml-auto">{{ article.author.name }}</span>
    </div>

    <!-- 标签 + 管理操作 -->
    <div class="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
      <div class="flex flex-wrap items-center gap-1.5">
        <router-link
          v-for="tag in article.tags"
          :key="tag.id"
          :to="`/tag/${tag.id}`"
          class="rounded px-2 py-0.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
        >
          # {{ tag.name }}
        </router-link>
      </div>

      <!-- 管理操作（仅 admin 可见，由父级通过插槽注入交互） -->
      <div
        class="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <slot name="actions" :id="article.id" />
      </div>
    </div>
  </article>
</template>
