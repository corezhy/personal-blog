<script setup lang="ts">
/**
 * 分类页 —— 展示某分类下的文章列表
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import ArticleList from '@/components/business/ArticleList.vue'
import Sidebar from '@/components/business/Sidebar.vue'
import { useTaxonomy } from '@/hooks/useTaxonomy'
import type { ArticleFilter } from '@/hooks/useArticleList'

const route = useRoute()
const { categories } = useTaxonomy()

const categoryId = computed(() => Number(route.params.id))
const current = computed(() => categories.value.find(c => c.id === categoryId.value))

const filters = computed<ArticleFilter>(() => ({ categoryId: categoryId.value }))
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-6">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <div class="mb-4 flex items-center gap-2">
          <h1 class="text-xl font-bold">分类：{{ current?.name ?? categoryId }}</h1>
          <span class="text-sm text-gray-400">{{ current?.description }}</span>
        </div>
        <ArticleList :filters="filters" />
      </div>
      <Sidebar class="hidden lg:block" />
    </div>
  </div>
</template>
