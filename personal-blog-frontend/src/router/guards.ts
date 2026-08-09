/**
 * 路由守卫
 *
 * 权限模型：
 * - requiresAuth    未登录 -> 跳转登录页（携带 redirect 回跳）
 * - requiresAdmin   非 admin -> 回到首页
 * - guestOnly       已登录访问登录页 -> 按角色跳到对应首页/后台
 */
import type { Router } from 'vue-router'

import { siteConfig } from '@/config/site'
import { useAuthStore } from '@/stores/useAuthStore'

export function setupGuards(router: Router): void {
  router.beforeEach(to => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    if (to.meta.requiresAdmin && auth.userInfo?.role !== 'admin') {
      return { path: '/', replace: true }
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { path: auth.isAdmin ? '/admin/dashboard' : '/', replace: true }
    }

    return true
  })

  router.afterEach(to => {
    const base = siteConfig.title
    document.title = to.meta.title ? `${to.meta.title} - ${base}` : base
  })
}
