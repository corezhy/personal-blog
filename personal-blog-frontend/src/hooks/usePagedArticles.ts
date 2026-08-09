/**
 * 逻辑层 —— 后台文章表格（服务端分页）
 */
import { ref, watch } from 'vue'

import { getArticles } from '@/services/article'
import type { ArticleSummary } from '@/types'

export function usePagedArticles(pageSize = 10) {
  const list = ref<ArticleSummary[]>([])
  const total = ref(0)
  const page = ref(1)
  const loading = ref(false)

  async function fetchList(): Promise<void> {
    loading.value = true
    try {
      const result = await getArticles({ page: page.value, pageSize })
      list.value = result.list
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  watch(page, fetchList)

  return { list, total, page, pageSize, loading, refresh: fetchList }
}
