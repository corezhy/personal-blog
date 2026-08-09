<script setup lang="ts">
/**
 * 业务组件 —— 前台侧边栏（站点信息 + 分类云 + 标签云）
 * 首页 / 分类页 / 标签页共用。
 */
import { useTaxonomy } from '@/hooks/useTaxonomy'
import { siteConfig } from '@/config/site'
import siteAvatar from '@/assets/images/my.jpg'

import CategoryCloud from './CategoryCloud.vue'
import TagCloud from './TagCloud.vue'

const { categories, tags, loading } = useTaxonomy()
</script>

<template>
  <aside class="space-y-4">
    <!-- 站点信息卡片 -->
    <section
      class="rounded-xl border border-gray-200 bg-white p-5 text-center dark:border-gray-800 dark:bg-gray-900"
    >
      <img
        :src="siteAvatar"
        alt="站点头像"
        class="mx-auto h-16 w-16 rounded-2xl object-cover shadow"
      />
      <h3 class="mt-3 text-base font-semibold text-gray-800 dark:text-gray-100">
        {{ siteConfig.title }}
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ siteConfig.subtitle }}</p>
    </section>

    <!-- 分类 -->
    <section
      class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">分类</h4>
      <CategoryCloud :categories="categories" :loading="loading" />
    </section>

    <!-- 标签 -->
    <section
      class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">标签</h4>
      <TagCloud :tags="tags" :loading="loading" />
    </section>
  </aside>
</template>
