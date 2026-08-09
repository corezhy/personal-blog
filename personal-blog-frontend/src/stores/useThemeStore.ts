/**
 * 状态层 —— 主题切片
 *
 * 通过 html 元素的 .dark 类切换明暗主题，同时兼容 Tailwind（@custom-variant dark）
 * 与 Element Plus（element-plus/theme-chalk/dark/css-vars.css）。
 * 持久化到 localStorage，index.html 中的内联脚本会在应用挂载前同步，避免闪烁。
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'blog-theme'

/** 获取当前主题模式 */
function detectTheme(): ThemeMode {
  const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null
  if (saved === 'light' || saved === 'dark') return saved
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeMode>('light')

  function apply(mode: ThemeMode): void {
    theme.value = mode
    document.documentElement.classList.toggle('dark', mode === 'dark')
    document.documentElement.dataset.theme = mode
    localStorage.setItem(THEME_KEY, mode)
  }

  function init(): void {
    apply(detectTheme())
  }

  function toggle(): void {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, init, toggle, apply }
})
