<script setup lang="ts">
/**
 * 404 页面
 */
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <p
      class="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-8xl font-black text-transparent"
    >
      404
    </p>
    <h1 class="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">页面不存在</h1>
    <p class="mt-2 text-sm text-gray-400">你访问的页面可能已被移动或删除</p>
    <el-button type="primary" class="mt-6" round @click="$router.push('/')">返回首页</el-button>
  </div>
</template>
