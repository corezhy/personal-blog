<script setup lang="ts">
/**
 * 首页 —— 文章列表（无限滚动）+ 侧边栏分类/标签云
 */
import ArticleList from '@/components/business/ArticleList.vue'
import Sidebar from '@/components/business/Sidebar.vue'
import type { ArticleFilter } from '@/hooks/useArticleList'

// 稳定引用，避免每次渲染触发 ArticleList 刷新
const homeFilters: ArticleFilter = {}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-6">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <h1 class="mb-4 text-xl font-bold">最新文章</h1>
        <ArticleList :filters="homeFilters" />
      </div>
      <Sidebar class="hidden lg:block" />
    </div>
  </div>
</template>
