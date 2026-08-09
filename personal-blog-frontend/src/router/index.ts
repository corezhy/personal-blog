/**
 * 路由配置
 *
 * 分层约定：
 * - /login 使用 AuthLayout（独立居中页面）
 * - 前台页面挂在 FrontLayout 下（导航 + 页脚）
 * - /admin/* 挂在 AdminLayout 下，由守卫拦截非 admin
 * - 页面组件按需懒加载
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { setupGuards } from './guards'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 需要登录 */
    requiresAuth?: boolean
    /** 需要 admin 角色 */
    requiresAdmin?: boolean
    /** 仅游客可访问（如登录页） */
    guestOnly?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { title: '登录' },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/home/HomePage.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'article/:id',
        name: 'article-detail',
        component: () => import('@/pages/article/ArticleDetailPage.vue'),
        meta: { title: '文章详情' },
      },
      {
        path: 'category/:id',
        name: 'category',
        component: () => import('@/pages/category/CategoryPage.vue'),
        meta: { title: '分类' },
      },
      {
        path: 'tag/:id',
        name: 'tag',
        component: () => import('@/pages/tag/TagPage.vue'),
        meta: { title: '标签' },
      },
      {
        path: 'archives',
        name: 'archives',
        component: () => import('@/pages/archives/ArchivesPage.vue'),
        meta: { title: '归档' },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/pages/about/AboutPage.vue'),
        meta: { title: '关于' },
      },
      {
        path: 'friends',
        name: 'friends',
        component: () => import('@/pages/friends/FriendsPage.vue'),
        meta: { title: '友链' },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/dashboard/DashboardPage.vue'),
        meta: { title: '仪表盘', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'articles',
        name: 'admin-articles',
        component: () => import('@/pages/admin/articles/ArticleListPage.vue'),
        meta: { title: '文章管理', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'articles/new',
        name: 'admin-article-new',
        component: () => import('@/pages/admin/articles/ArticleEditPage.vue'),
        meta: { title: '新建文章', requiresAuth: true, requiresAdmin: true },
      },
      {
        path: 'articles/:id/edit',
        name: 'admin-article-edit',
        component: () => import('@/pages/admin/articles/ArticleEditPage.vue'),
        meta: { title: '编辑文章', requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/error/NotFoundPage.vue'),
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

setupGuards(router)

export default router
