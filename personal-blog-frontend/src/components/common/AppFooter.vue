<script setup lang="ts">
/**
 * 通用组件 —— 页脚
 */
import { siteConfig } from '@/config/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-200 py-6 dark:border-gray-800">
    <div class="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>
        © {{ year }} {{ siteConfig.title }} · {{ siteConfig.author }} · Powered by Vue3 &amp; Vite
      </p>
      <p class="mt-1">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener"
          class="hover:text-blue-500"
        >
          京ICP备xxxxxxxx号
        </a>
      </p>
    </div>
  </footer>
</template>
