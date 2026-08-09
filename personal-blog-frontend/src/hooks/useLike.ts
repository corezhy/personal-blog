/**
 * 逻辑层 —— 文章点赞
 * 游客不可点赞；登录用户可切换点赞状态，实时更新点赞数。
 */
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import type { Ref } from 'vue'

import { likeArticle, unlikeArticle } from '@/services/article'
import { useAuthStore } from '@/stores/useAuthStore'
import type { ArticleDetail } from '@/types'

export function useLike(article: Ref<ArticleDetail | null>) {
  const authStore = useAuthStore()

  const liked = ref(false)
  const likes = ref(0)
  const liking = ref(false)

  // 文章加载后同步点赞状态
  watch(
    article,
    value => {
      if (value) {
        liked.value = value.liked
        likes.value = value.likes
      }
    },
    { immediate: true },
  )

  async function toggleLike(): Promise<void> {
    if (!authStore.isAuthenticated) {
      ElMessage.info('登录后才能点赞哦')
      return
    }
    const id = article.value?.id
    if (!id || liking.value) return

    liking.value = true
    try {
      const result = liked.value ? await unlikeArticle(id) : await likeArticle(id)
      liked.value = result.liked
      likes.value = result.likes
    } finally {
      liking.value = false
    }
  }

  return { liked, likes, liking, toggleLike }
}
