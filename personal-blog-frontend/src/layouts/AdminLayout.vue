<script setup lang="ts">
/**
 * 后台布局 —— 左侧菜单 + 顶部栏 + 独立滚动内容区
 * 仅 admin 角色可达（路由守卫拦截）。
 */
import { DataAnalysis, Document, SwitchButton, User } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

import BackToTop from '@/components/common/BackToTop.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useAuth } from '@/hooks/useAuth'
import siteAvatar from '@/assets/images/my.jpg'

const route = useRoute()
const router = useRouter()
const { userInfo, logout } = useAuth()

function handleCommand(command: string | number | object): void {
  if (command === 'logout') {
    logout()
    router.push('/login')
  } else if (command === 'home') {
    router.push('/')
  }
}
</script>

<template>
  <div
    class="flex h-screen overflow-hidden bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
  >
    <!-- 侧边栏 -->
    <aside
      class="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <router-link to="/admin/dashboard" class="flex h-14 items-center gap-2 px-5">
        <img
          :src="siteAvatar"
          alt="logo"
          class="h-8 w-8 rounded-lg object-cover shadow"
        />
        <span class="font-semibold">后台管理</span>
      </router-link>

      <el-menu
        class="flex-1 !border-0"
        :default-active="route.path"
        router
        background-color="transparent"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- 右侧 -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- 顶部栏 -->
      <header
        class="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900"
      >
        <h1 class="text-base font-semibold">{{ route.meta.title ?? '后台' }}</h1>

        <div class="flex items-center gap-2">
          <ThemeToggle />
          <el-dropdown trigger="click" @command="handleCommand">
            <button
              class="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <el-avatar :size="28" class="!bg-blue-500">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="text-sm">{{ userInfo?.name }}</span>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="home">返回前台</el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容区（独立滚动容器） -->
      <main class="admin-scroll-container flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>

    <BackToTop target=".admin-scroll-container" />
  </div>
</template>
