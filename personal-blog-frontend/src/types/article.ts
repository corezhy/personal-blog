/**
 * 契约层 —— 文章
 */
import type { CategoryInfo } from './category'
import type { TagInfo } from './tag'

/** 文章作者 */
export interface ArticleAuthor {
  id: number
  name: string
}

/** 文章基础信息（列表项） */
export interface ArticleSummary {
  id: number
  title: string
  /** 摘要 */
  summary: string
  /** 封面图 URL（可选） */
  cover?: string
  category: CategoryInfo
  tags: TagInfo[]
  author: ArticleAuthor
  views: number
  likes: number
  /** 当前用户是否已点赞 */
  liked: boolean
  createdAt: string
  updatedAt: string
  published: boolean
}

/** 文章详情（含 Markdown 正文） */
export interface ArticleDetail extends ArticleSummary {
  content: string
}

/** 文章列表查询参数 */
export interface ArticleQuery {
  page: number
  pageSize: number
  categoryId?: number
  tagId?: number
  keyword?: string
}

/** 点赞/取消点赞返回 */
export interface LikeResult {
  liked: boolean
  likes: number
}

/** 新建 / 编辑文章提交数据（admin） */
export interface ArticlePayload {
  title: string
  summary: string
  content: string
  categoryId: number
  tagIds: number[]
  cover?: string
}
