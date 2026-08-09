/**
 * 逻辑层 —— 无限滚动
 * 监听哨兵元素进入视口，触发 loadMore。
 */
import { onBeforeUnmount, onMounted } from 'vue'
import type { Ref } from 'vue'

export interface InfiniteScrollOptions {
  loading: Ref<boolean>
  loadingMore?: Ref<boolean>
  finished: Ref<boolean>
  loadMore: () => void | Promise<void>
  /** 滚动容器（默认视口） */
  root?: Element | null
  /** 提前加载的距离 */
  rootMargin?: string
}

export function useInfiniteScroll(
  sentinelRef: Ref<HTMLElement | null>,
  options: InfiniteScrollOptions,
) {
  const { loading, loadingMore, finished, loadMore, root = null, rootMargin = '240px' } = options

  let observer: IntersectionObserver | null = null

  function handleEntries(entries: IntersectionObserverEntry[]): void {
    const entry = entries[0]
    if (entry?.isIntersecting && !loading.value && !loadingMore?.value && !finished.value) {
      void loadMore()
    }
  }

  onMounted(() => {
    observer = new IntersectionObserver(handleEntries, { root, rootMargin })
    if (sentinelRef.value) {
      observer.observe(sentinelRef.value)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
