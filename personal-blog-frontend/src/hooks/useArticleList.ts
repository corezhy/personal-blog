/**
 * 逻辑层 —— 文章列表（分页 + 无限滚动数据源）
 *
 * 页面只需传入筛选条件 ref，本 Hook 负责：首屏加载、滚动加载下一页、按时间倒序。
 * 当筛选条件变化时自动刷新。首页 / 分类页 / 标签页共用。
 */
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

import { getArticles } from '@/services/article'
import type { ArticleQuery, ArticleSummary } from '@/types'

const DEFAULT_PAGE_SIZE = 6

/** 筛选条件（分页由 Hook 内部维护） */
export type ArticleFilter = Partial<Pick<ArticleQuery, 'categoryId' | 'tagId' | 'keyword'>>

export function useArticleList(filters: Ref<ArticleFilter>, pageSize = DEFAULT_PAGE_SIZE) {
  const list = ref<ArticleSummary[]>([])
  const total = ref(0)
  const loading = ref(false)
  const loadingMore = ref(false)
  const finished = ref(false)

  const page = ref(1)

  async function loadPage(targetPage: number): Promise<void> {
    const isFirst = targetPage === 1
    if (isFirst) loading.value = true
    else loadingMore.value = true

    try {
      const result = await getArticles({
        ...filters.value,
        page: targetPage,
        pageSize,
      })
      list.value = isFirst ? result.list : [...list.value, ...result.list]
      total.value = result.total
      finished.value = list.value.length >= result.total
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  /** 刷新（回到第一页） */
  function refresh(): Promise<void> {
    page.value = 1
    return loadPage(1)
  }

  /** 加载下一页（由无限滚动触发） */
  async function loadMore(): Promise<void> {
    if (loading.value || loadingMore.value || finished.value) return
    page.value += 1
    await loadPage(page.value)
  }

  /** 筛选条件变化自动回到第一页 */
  watch(() => filters.value, refresh, { deep: true, immediate: true })

  return { list, total, loading, loadingMore, finished, refresh, loadMore }
}
