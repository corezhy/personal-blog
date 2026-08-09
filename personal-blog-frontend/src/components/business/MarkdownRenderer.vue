<script setup lang="ts">
/**
 * 业务组件 —— Markdown 渲染
 * 复用 useMarkdown Hook 完成 HTML 渲染 + 目录生成。
 * 样式见 assets/styles/markdown.css 的 .markdown-body。
 */
import { computed } from 'vue'

import { useMarkdown } from '@/hooks/useMarkdown'

const props = defineProps<{
  content: string
}>()

const source = computed(() => props.content)
const { html, toc } = useMarkdown(source)

defineExpose({ toc })
</script>

<template>
  <div class="markdown-body" v-html="html" />
</template>
