<script setup lang="ts">
/**
 * 后台仪表盘 —— 站点统计卡片 + 最近文章
 */
import { Collection, Document, Edit, TrendCharts, View } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'

import { getArticles } from '@/services/article'
import { getSiteStats } from '@/services/stats'
import { formatDate } from '@/utils/date'
import type { ArticleSummary, SiteStats } from '@/types'

const stats = ref<SiteStats | null>(null)
const recent = ref<ArticleSummary[]>([])
const loading = ref(true)

async function load(): Promise<void> {
  loading.value = true
  try {
    const [statsResult, recentResult] = await Promise.all([
      getSiteStats(),
      getArticles({ page: 1, pageSize: 5 }),
    ])
    stats.value = statsResult
    recent.value = recentResult.list
  } finally {
    loading.value = false
  }
}

onMounted(load)

const statCards = computed(() => [
  {
    label: '文章总数',
    value: stats.value?.articleCount ?? 0,
    icon: Document,
    color: 'text-blue-500',
  },
  {
    label: '分类数',
    value: stats.value?.categoryCount ?? 0,
    icon: Collection,
    color: 'text-emerald-500',
  },
  {
    label: '标签数',
    value: stats.value?.tagCount ?? 0,
    icon: TrendCharts,
    color: 'text-violet-500',
  },
  { label: '总浏览量', value: stats.value?.totalViews ?? 0, icon: View, color: 'text-amber-500' },
])
</script>

<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-400">{{ card.label }}</span>
          <el-icon :size="22" class="opacity-60" :class="card.color">
            <component :is="card.icon" />
          </el-icon>
        </div>
        <p class="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
          {{ stats ? card.value : '--' }}
        </p>
      </div>
    </div>

    <!-- 最近文章 -->
    <section
      class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <header
        class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
      >
        <h2 class="font-semibold text-gray-800 dark:text-gray-100">最近文章</h2>
        <router-link to="/admin/articles" class="text-sm text-blue-500 hover:underline">
          查看全部
        </router-link>
      </header>

      <el-table v-loading="loading" :data="recent" class="w-full">
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
        <el-table-column label="分类" width="120">
          <template #default="{ row }">{{ row.category.name }}</template>
        </el-table-column>
        <el-table-column prop="views" label="浏览" width="90" align="center" />
        <el-table-column label="创建时间" width="140">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <router-link :to="`/admin/articles/${row.id}/edit`">
              <el-button size="small" :icon="Edit" link type="primary">编辑</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>
