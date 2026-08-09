<script setup lang="ts">
/**
 * 归档页 —— 按年 / 月聚合文章的时间线
 */
import { Calendar } from '@element-plus/icons-vue'

import AppEmpty from '@/components/common/AppEmpty.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import { useArchives } from '@/hooks/useArchives'
import { formatDate } from '@/utils/date'

const { groups, loading } = useArchives()
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-6">
    <h1 class="mb-6 text-xl font-bold">归档</h1>

    <AppSkeleton v-if="loading" :count="2" />

    <AppEmpty v-else-if="groups.length === 0" description="暂无归档" />

    <div v-else class="space-y-8">
      <section v-for="year in groups" :key="year.year">
        <h2
          class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100"
        >
          <el-icon :size="18" class="text-blue-500"><Calendar /></el-icon>
          {{ year.year }}
          <span class="text-sm font-normal text-gray-400">
            {{ year.months.reduce((sum, m) => sum + m.articles.length, 0) }} 篇
          </span>
        </h2>

        <div class="relative ml-2 border-l border-gray-200 pl-6 dark:border-gray-700">
          <template v-for="month in year.months" :key="month.month">
            <h3 class="mt-5 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ month.month }}月
            </h3>
            <ul class="space-y-2">
              <li
                v-for="item in month.articles"
                :key="item.id"
                class="relative flex items-center gap-3"
              >
                <!-- 时间轴圆点 -->
                <span
                  class="absolute top-1/2 -left-[31px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 shadow dark:border-gray-900"
                />
                <router-link
                  :to="`/article/${item.id}`"
                  class="flex-1 truncate text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  {{ item.title }}
                </router-link>
                <span class="shrink-0 text-xs text-gray-400">{{ formatDate(item.createdAt) }}</span>
              </li>
            </ul>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>
