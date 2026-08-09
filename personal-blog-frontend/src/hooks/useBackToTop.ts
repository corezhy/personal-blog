/**
 * 逻辑层 —— 回到顶部
 * 监听滚动容器的 scroll，超过阈值时显示浮层；点击平滑回到顶部。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useBackToTop(threshold = 320, target?: () => Element | null) {
  const visible = ref(false)

  function handleScroll(): void {
    const el = target?.() ?? null
    const top = el ? el.scrollTop : window.scrollY
    visible.value = top > threshold
  }

  function scrollToTop(): void {
    const el = target?.() ?? null
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    const el = (target?.() ?? window) as Window | Element
    el.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onBeforeUnmount(() => {
    const el = (target?.() ?? window) as Window | Element
    el.removeEventListener('scroll', handleScroll)
  })

  return { visible, scrollToTop }
}
