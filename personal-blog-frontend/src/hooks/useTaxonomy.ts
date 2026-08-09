/**
 * 逻辑层 —— 分类 & 标签（侧边栏数据源）
 */
import { onMounted, ref } from 'vue'

import { getCategories } from '@/services/category'
import { getTags } from '@/services/tag'
import type { CategoryInfo, TagInfo } from '@/types'

export function useTaxonomy() {
  const categories = ref<CategoryInfo[]>([])
  const tags = ref<TagInfo[]>([])
  const loading = ref(true)

  async function load(): Promise<void> {
    loading.value = true
    try {
      const [categoryResult, tagResult] = await Promise.all([getCategories(), getTags()])
      categories.value = categoryResult
      tags.value = tagResult
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { categories, tags, loading, refresh: load }
}
