<script setup lang="ts">
/**
 * 业务组件 —— 目录（TOC）导航
 * - 根据 heading 层级缩进
 * - 滚动时高亮当前阅读位置（scroll-spy）
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { TocItem } from '@/hooks/useMarkdown'

const props = defineProps<{
  items: TocItem[]
  /** Markdown 正文容器选择器（用于定位标题元素） */
  containerSelector: string
}>()

const activeId = ref('')

function updateActive(): void {
  const container = document.querySelector<HTMLElement>(props.containerSelector)
  if (!container) return
  const headings = container.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
  let current = ''
  const offset = 100
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top - offset <= 0) {
      current = heading.id
    } else {
      break
    }
  }
  activeId.value = current
}

function scrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  window.addEventListener('scroll', updateActive, { passive: true })
  updateActive()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActive)
})

watch(
  () => props.items,
  () => updateActive(),
  { deep: true },
)
</script>

<template>
  <nav v-if="items.length" class="text-sm">
    <ul class="space-y-0.5 border-l border-gray-200 dark:border-gray-700">
      <li v-for="item in items" :key="item.id">
        <a
          :href="`#${item.id}`"
          class="block border-l-2 py-1 text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          :style="{ paddingLeft: `${(item.level - 1) * 12 + 12}px`, marginLeft: '-1px' }"
          :class="
            activeId === item.id
              ? 'border-blue-500 font-medium text-blue-600 dark:text-blue-400'
              : 'border-transparent'
          "
          @click.prevent="scrollTo(item.id)"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
  <p v-else class="text-sm text-gray-400 dark:text-gray-500">暂无目录</p>
</template>
