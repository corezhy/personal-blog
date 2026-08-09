<script setup lang="ts">
/**
 * 认证布局 —— 登录页等独立页面，居中展示，右上角提供主题切换
 */
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>

<template>
  <div
    class="relative flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950"
  >
    <div class="absolute top-4 right-4">
      <ThemeToggle />
    </div>
    <router-view />
  </div>
</template>
