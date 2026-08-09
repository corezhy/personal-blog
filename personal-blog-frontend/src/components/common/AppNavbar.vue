<script setup lang="ts">
/**
 * 通用组件 —— 前台顶部导航栏
 * 包含：品牌 Logo、导航菜单、主题切换、登录态展示。
 * 该组件只负责"组装"，用户态来自 useAuth，不做任何业务计算。
 */
import { ArrowDown, Menu, SwitchButton, User } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

import { useAuth } from '@/hooks/useAuth'
import { siteConfig } from '@/config/site'
import siteAvatar from '@/assets/images/my.jpg'

import ThemeToggle from './ThemeToggle.vue'

interface NavItem {
  label: string
  path: string
}

const navItems: NavItem[] = [
  { label: '首页', path: '/' },
  { label: '归档', path: '/archives' },
  { label: '关于', path: '/about' },
  { label: '友链', path: '/friends' },
]

const route = useRoute()
const router = useRouter()
const { isAuthenticated, isAdmin, userInfo, logout } = useAuth()

/** 判断当前菜单是否激活 */
function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

/** 移动端菜单开合 */
const mobileOpen = ref(false)

function handleCommand(command: string | number | object): void {
  if (command === 'logout') {
    logout()
    router.push('/')
  } else if (command === 'admin') {
    router.push('/admin/dashboard')
  } else if (typeof command === 'string') {
    router.push(command)
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur transition-colors dark:border-gray-800 dark:bg-gray-900/80"
  >
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
      <!-- 品牌 -->
      <router-link to="/" class="flex shrink-0 items-center gap-2">
        <img
          :src="siteAvatar"
          alt="logo"
          class="h-8 w-8 rounded-lg object-cover shadow"
        />
        <span class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {{ siteConfig.title }}
        </span>
      </router-link>

      <!-- 桌面端导航 -->
      <ul class="hidden items-center gap-1 md:flex">
        <li v-for="item in navItems" :key="item.path">
          <router-link
            :to="item.path"
            class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="
              isActive(item.path)
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
            "
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>

      <!-- 右侧操作区 -->
      <div class="flex shrink-0 items-center gap-2">
        <!-- 移动端菜单开关 -->
        <el-button class="md:hidden" circle aria-label="菜单" @click="mobileOpen = !mobileOpen">
          <el-icon :size="18"><Menu /></el-icon>
        </el-button>

        <ThemeToggle />

        <!-- 已登录：头像下拉 -->
        <el-dropdown v-if="isAuthenticated" trigger="click" @command="handleCommand">
          <button
            class="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <el-avatar :size="30" class="!bg-blue-500">
              <el-icon><User /></el-icon>
            </el-avatar>
            <span class="text-sm text-gray-700 dark:text-gray-200">{{ userInfo?.name }}</span>
            <el-icon class="text-gray-400" :size="12"><ArrowDown /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="isAdmin" command="admin">后台管理</el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 未登录：登录按钮 -->
        <router-link v-else to="/login">
          <el-button type="primary" size="default">登录</el-button>
        </router-link>
      </div>
    </nav>

    <!-- 移动端导航 -->
    <div
      v-if="mobileOpen"
      class="border-t border-gray-200 px-4 py-2 md:hidden dark:border-gray-800"
    >
      <ul class="flex flex-col gap-1">
        <li v-for="item in navItems" :key="item.path">
          <router-link
            :to="item.path"
            class="block rounded-lg px-3 py-2 text-sm font-medium"
            :class="
              isActive(item.path)
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-300'
            "
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </header>
</template>
