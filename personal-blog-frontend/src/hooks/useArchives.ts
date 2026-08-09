/**
 * 逻辑层 —— 归档数据
 */
import { onMounted, ref } from 'vue'

import { getArchives } from '@/services/archive'
import type { ArchiveYear } from '@/types'

export function useArchives() {
  const groups = ref<ArchiveYear[]>([])
  const loading = ref(true)

  async function load(): Promise<void> {
    loading.value = true
    try {
      groups.value = await getArchives()
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return { groups, loading, refresh: load }
}
