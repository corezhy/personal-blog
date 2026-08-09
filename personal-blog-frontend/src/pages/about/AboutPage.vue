<script setup lang="ts">
/**
 * 关于页 —— 静态配置渲染
 */
import MarkdownRenderer from '@/components/business/MarkdownRenderer.vue'
import { siteConfig } from '@/config/site'
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-6">
    <div
      class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h1 class="mb-4 text-xl font-bold">关于</h1>
      <MarkdownRenderer :content="siteConfig.about" />
    </div>
  </div>
</template>
