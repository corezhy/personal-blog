<script setup lang="ts">
/**
 * 友链页 —— 静态配置渲染
 */
import { siteConfig } from '@/config/site'
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-6">
    <h1 class="mb-2 text-xl font-bold">友情链接</h1>
    <p class="mb-6 text-sm text-gray-400">交换友链请联系站长，长期互访优先。</p>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <a
        v-for="friend in siteConfig.friends"
        :key="friend.url"
        :href="friend.url"
        target="_blank"
        rel="noopener"
        class="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500"
      >
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white"
        >
          {{ friend.name.slice(0, 1) }}
        </span>
        <div class="min-w-0">
          <h3
            class="font-semibold text-gray-800 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400"
          >
            {{ friend.name }}
          </h3>
          <p class="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {{ friend.description }}
          </p>
        </div>
      </a>
    </div>
  </div>
</template>
