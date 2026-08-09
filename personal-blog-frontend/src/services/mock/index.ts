/**
 * Mock 适配器 —— 仅开发环境启用（VITE_ENABLE_MOCK=true）
 *
 * 在 axios 实例上注册接口模拟，返回与后端完全一致的 { code, data, msg } 结构，
 * 因此前端 API 层、拦截器逻辑与真实后端共用同一套代码，接入真实后端时删除本目录即可。
 *
 * 演示账号：
 *   admin / admin123  -> 管理员
 *   user  / user123   -> 普通用户
 */
import MockAdapter from 'axios-mock-adapter'
import type { AxiosRequestConfig } from 'axios'

import http from '@/services/http'
import type { ArticlePayload, LoginResult, UserInfo } from '@/types'

import { categoriesWithCount, mockArticles, tagsWithCount } from './data'

let adapter: MockAdapter | null = null

/* -------------------------------------------------------------------------- */
/* 工具                                                                        */
/* -------------------------------------------------------------------------- */

function ok<T>(data: T): { code: number; data: T; msg: string } {
  return { code: 200, data, msg: '' }
}

function fail(code: number, msg: string) {
  return { code, data: null, msg }
}

/** 从请求头中解析 Bearer Token */
function readToken(config: AxiosRequestConfig): string {
  const headers = config.headers as
    (Record<string, unknown> & { get?: (name: string) => string | null | undefined }) | undefined
  const raw = headers?.get?.('Authorization') ?? headers?.['Authorization']
  return typeof raw === 'string' ? raw.replace(/^Bearer\s+/i, '') : ''
}

/* -------------------------------------------------------------------------- */
/* 登录态（内存模拟）                                                          */
/* -------------------------------------------------------------------------- */

interface MockAccount {
  username: string
  password: string
  userInfo: UserInfo
}

const MOCK_ACCOUNTS: MockAccount[] = [
  { username: 'admin', password: 'admin123', userInfo: { id: 1, name: '管理员', role: 'admin' } },
  { username: 'user', password: 'user123', userInfo: { id: 2, name: '普通用户', role: 'user' } },
]

/** token -> 用户 */
const tokenUserMap = new Map<string, UserInfo>()

function currentUser(config: AxiosRequestConfig): UserInfo | null {
  const token = readToken(config)
  return tokenUserMap.get(token) ?? null
}

/** Mock 失败响应：HTTP 状态码 + 业务码 JSON */
type MockFail = [number, { code: number; data: null; msg: string }]

/** 文章点赞集合（会话级模拟） */
const likedIds = new Set<number>()

/* -------------------------------------------------------------------------- */
/* 注册全部 Mock 接口                                                          */
/* -------------------------------------------------------------------------- */

export function setupMock(): void {
  if (adapter) return
  adapter = new MockAdapter(http, { delayResponse: 300 })

  /* ---------- 认证 ---------- */

  adapter.onPost(/\/auth\/login$/).reply(config => {
    const body = JSON.parse(config.data ?? '{}') as { username: string; password: string }
    const account = MOCK_ACCOUNTS.find(
      a => a.username === body.username && a.password === body.password,
    )

    if (!account) {
      return [200, fail(400, '用户名或密码错误')]
    }

    const { userInfo } = account
    const token = `mock-token-${userInfo.role}-${userInfo.id}`
    tokenUserMap.set(token, userInfo)
    const result: LoginResult = { token, userInfo }
    return [200, ok(result)]
  })

  adapter.onGet(/\/auth\/me$/).reply(config => {
    const user = currentUser(config)
    if (!user) return [401, fail(401, '未登录')]
    return [200, ok(user)]
  })

  /* ---------- 文章列表 / 详情 / 点赞 ---------- */

  adapter.onGet(/\/articles$/).reply(config => {
    const params = (config.params ?? {}) as {
      page?: number
      pageSize?: number
      categoryId?: string | number
      tagId?: string | number
      keyword?: string
    }
    const page = Number(params.page ?? 1)
    const pageSize = Number(params.pageSize ?? 6)
    const categoryId = params.categoryId ? Number(params.categoryId) : null
    const tagId = params.tagId ? Number(params.tagId) : null
    const keyword = params.keyword?.trim()

    let filtered = [...mockArticles]
    if (categoryId) filtered = filtered.filter(a => a.category.id === categoryId)
    if (tagId) filtered = filtered.filter(a => a.tags.some(t => t.id === tagId))
    if (keyword) {
      filtered = filtered.filter(a => a.title.includes(keyword) || a.summary.includes(keyword))
    }
    // 按发布时间倒序
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    const total = filtered.length
    const start = (page - 1) * pageSize
    const list = filtered
      .slice(start, start + pageSize)
      .map(({ content: _content, ...rest }) => ({ ...rest, liked: likedIds.has(rest.id) }))

    return [200, ok({ list, total, page, pageSize })]
  })

  adapter.onGet(/\/articles\/\d+$/).reply(config => {
    const id = Number(config.url?.match(/\/articles\/(\d+)$/)?.[1])
    const article = mockArticles.find(a => a.id === id)
    if (!article) return [404, fail(404, '文章不存在')]
    return [200, ok({ ...article, liked: likedIds.has(article.id) })]
  })

  adapter.onPost(/\/articles\/\d+\/like$/).reply(config => {
    const id = Number(config.url?.match(/\/articles\/(\d+)\/like$/)?.[1])
    const article = mockArticles.find(a => a.id === id)
    if (!article) return [404, fail(404, '文章不存在')]
    if (likedIds.has(id)) return [200, ok({ liked: true, likes: article.likes })]
    likedIds.add(id)
    article.likes += 1
    return [200, ok({ liked: true, likes: article.likes })]
  })

  adapter.onDelete(/\/articles\/\d+\/like$/).reply(config => {
    const id = Number(config.url?.match(/\/articles\/(\d+)\/like$/)?.[1])
    const article = mockArticles.find(a => a.id === id)
    if (!article) return [404, fail(404, '文章不存在')]
    likedIds.delete(id)
    if (article.likes > 0) article.likes -= 1
    return [200, ok({ liked: false, likes: article.likes })]
  })

  /* ---------- 管理端：文章增删改（仅 admin） ---------- */

  const requireAdmin = (config: AxiosRequestConfig): MockFail | null => {
    const user = currentUser(config)
    if (!user) return [401, fail(401, '未登录')]
    if (user.role !== 'admin') return [403, fail(403, '没有权限')]
    return null
  }

  adapter.onPost(/\/articles$/).reply(config => {
    const denied = requireAdmin(config)
    if (denied) return denied
    const payload = JSON.parse(config.data ?? '{}') as ArticlePayload
    const category = categoriesWithCount().find(c => c.id === payload.categoryId)
    if (!category) return [400, fail(400, '分类不存在')]
    const id = Math.max(0, ...mockArticles.map(a => a.id)) + 1
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const article = {
      id,
      title: payload.title,
      summary: payload.summary,
      cover: payload.cover,
      category,
      tags: tagsWithCount().filter(t => payload.tagIds.includes(t.id)),
      author: { id: 1, name: '管理员' },
      views: 0,
      likes: 0,
      liked: false,
      createdAt,
      updatedAt: createdAt,
      published: true,
      content: payload.content,
    }
    mockArticles.unshift(article)
    return [200, ok(article)]
  })

  adapter.onPut(/\/articles\/\d+$/).reply(config => {
    const denied = requireAdmin(config)
    if (denied) return denied
    const id = Number(config.url?.match(/\/articles\/(\d+)$/)?.[1])
    const index = mockArticles.findIndex(a => a.id === id)
    if (index === -1) return [404, fail(404, '文章不存在')]
    const payload = JSON.parse(config.data ?? '{}') as ArticlePayload
    const category = categoriesWithCount().find(c => c.id === payload.categoryId)
    if (!category) return [400, fail(400, '分类不存在')]
    mockArticles[index] = {
      ...mockArticles[index],
      title: payload.title,
      summary: payload.summary,
      cover: payload.cover,
      category,
      tags: tagsWithCount().filter(t => payload.tagIds.includes(t.id)),
      content: payload.content,
    }
    return [200, ok(mockArticles[index])]
  })

  adapter.onDelete(/\/articles\/\d+$/).reply(config => {
    const denied = requireAdmin(config)
    if (denied) return denied
    const id = Number(config.url?.match(/\/articles\/(\d+)$/)?.[1])
    const index = mockArticles.findIndex(a => a.id === id)
    if (index === -1) return [404, fail(404, '文章不存在')]
    mockArticles.splice(index, 1)
    return [200, ok(null)]
  })

  /* ---------- 分类 / 标签 / 归档 / 统计 ---------- */

  adapter.onGet(/\/categories$/).reply(() => [200, ok(categoriesWithCount())])

  adapter.onGet(/\/tags$/).reply(() => [200, ok(tagsWithCount())])

  adapter.onGet(/\/archives$/).reply(() => {
    const byYear = new Map<
      number,
      Map<number, { id: number; title: string; createdAt: string }[]>
    >()
    for (const a of mockArticles) {
      const [datePart] = a.createdAt.split(' ')
      const [y, m] = datePart.split('-').map(Number)
      if (!byYear.has(y)) byYear.set(y, new Map())
      const months = byYear.get(y)!
      if (!months.has(m)) months.set(m, [])
      months.get(m)!.push({ id: a.id, title: a.title, createdAt: a.createdAt })
    }
    const years = [...byYear.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([year, months]) => ({
        year,
        months: [...months.entries()]
          .sort((a, b) => b[0] - a[0])
          .map(([month, articles]) => ({ month, articles })),
      }))
    return [200, ok(years)]
  })

  adapter.onGet(/\/stats$/).reply(() => {
    return [
      200,
      ok({
        articleCount: mockArticles.length,
        categoryCount: categoriesWithCount().length,
        tagCount: tagsWithCount().length,
        totalViews: mockArticles.reduce((sum, a) => sum + a.views, 0),
        totalLikes: mockArticles.reduce((sum, a) => sum + a.likes, 0),
      }),
    ]
  })
}
