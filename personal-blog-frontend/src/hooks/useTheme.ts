/**
 * 逻辑层 —— 主题切换
 * 封装主题 store 的响应式状态，组件无需直接操作 document。
 */
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useThemeStore } from '@/stores/useThemeStore'

export function useTheme() {
  const themeStore = useThemeStore()
  const { theme } = storeToRefs(themeStore)
  const isDark = computed(() => theme.value === 'dark')

  const toggle = () => themeStore.toggle()

  return { theme, isDark, toggle }
}
