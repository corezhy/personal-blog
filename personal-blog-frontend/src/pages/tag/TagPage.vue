<script setup lang="ts">
/**
 * 标签页 —— 展示某标签下的文章列表
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import ArticleList from '@/components/business/ArticleList.vue'
import Sidebar from '@/components/business/Sidebar.vue'
import { useTaxonomy } from '@/hooks/useTaxonomy'
import type { ArticleFilter } from '@/hooks/useArticleList'

const route = useRoute()
const { tags } = useTaxonomy()

const tagId = computed(() => Number(route.params.id))
const current = computed(() => tags.value.find(t => t.id === tagId.value))

const filters = computed<ArticleFilter>(() => ({ tagId: tagId.value }))
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-6">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <h1 class="mb-4 text-xl font-bold">标签：#{{ current?.name ?? tagId }}</h1>
        <ArticleList :filters="filters" />
      </div>
      <Sidebar class="hidden lg:block" />
    </div>
  </div>
</template>
