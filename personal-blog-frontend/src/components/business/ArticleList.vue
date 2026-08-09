<script setup lang="ts">
/**
 * 业务组件 —— 文章列表（无限滚动 + 回到顶部 + admin 管理操作）
 *
 * 首页 / 分类页 / 标签页共用：传入筛选条件，内部完成分页、加载、占位。
 */
import { ref, watch } from 'vue'

import AppEmpty from '@/components/common/AppEmpty.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import { useArticleList } from '@/hooks/useArticleList'
import type { ArticleFilter } from '@/hooks/useArticleList'
import { useAuth } from '@/hooks/useAuth'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

import ArticleActions from './ArticleActions.vue'
import ArticleCard from './ArticleCard.vue'

const props = withDefaults(
  defineProps<{
    filters?: ArticleFilter
  }>(),
  {
    filters: () => ({}),
  },
)

// 过滤条件以 ref 形式传给 Hook，变化时自动刷新
const filterRef = ref<ArticleFilter>(props.filters)
watch(
  () => props.filters,
  value => {
    filterRef.value = value ?? {}
  },
)

const { list, loading, loadingMore, finished, refresh, loadMore } = useArticleList(filterRef)
const { isAdmin } = useAuth()

const sentinelRef = ref<HTMLElement | null>(null)
useInfiniteScroll(sentinelRef, { loading, loadingMore, finished, loadMore })

function handleDeleted(): void {
  refresh()
}
</script>

<template>
  <div>
    <!-- 首屏加载 -->
    <AppSkeleton v-if="loading && list.length === 0" :count="3" />

    <!-- 列表 -->
    <template v-else-if="list.length > 0">
      <div class="space-y-4">
        <ArticleCard v-for="article in list" :key="article.id" :article="article">
          <template v-if="isAdmin" #actions="{ id }">
            <ArticleActions :id="id" @deleted="handleDeleted" />
          </template>
        </ArticleCard>
      </div>

      <!-- 无限滚动哨兵 -->
      <div ref="sentinelRef" class="h-px" />

      <div class="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
        <span v-if="loadingMore">加载中…</span>
        <span v-else-if="finished">— 已经到底啦 —</span>
      </div>
    </template>

    <!-- 空状态 -->
    <AppEmpty v-else description="暂无文章" />

    <BackToTop />
  </div>
</template>
