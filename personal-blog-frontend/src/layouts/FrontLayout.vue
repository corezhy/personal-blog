<script setup lang="ts">
/**
 * 前台布局 —— 顶部导航 + 内容区 + 页脚
 * 子路由在这里渲染，页面无需重复写导航与页脚。
 */
import AppFooter from '@/components/common/AppFooter.vue'
import AppNavbar from '@/components/common/AppNavbar.vue'
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100"
  >
    <AppNavbar />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>
