/**
 * API 层 —— 文章接口
 */
import type {
  ArticleDetail,
  ArticlePayload,
  ArticleQuery,
  ArticleSummary,
  LikeResult,
  PageResult,
} from '@/types'

import request from './request'

/** 分页获取文章列表（支持按分类/标签/关键词筛选） */
export function getArticles(params: ArticleQuery): Promise<PageResult<ArticleSummary>> {
  return request.get<PageResult<ArticleSummary>>('/articles', { ...params })
}

/** 文章详情 */
export function getArticleDetail(id: number): Promise<ArticleDetail> {
  return request.get<ArticleDetail>(`/articles/${id}`)
}

/** 点赞 */
export function likeArticle(id: number): Promise<LikeResult> {
  return request.post<LikeResult>(`/articles/${id}/like`)
}

/** 取消点赞 */
export function unlikeArticle(id: number): Promise<LikeResult> {
  return request.delete<LikeResult>(`/articles/${id}/like`)
}

/* ---------- 以下仅 admin 可用 ---------- */

/** 新建文章 */
export function createArticle(payload: ArticlePayload): Promise<ArticleDetail> {
  return request.post<ArticleDetail>('/articles', payload)
}

/** 更新文章 */
export function updateArticle(id: number, payload: ArticlePayload): Promise<ArticleDetail> {
  return request.put<ArticleDetail>(`/articles/${id}`, payload)
}

/** 删除文章 */
export function deleteArticle(id: number): Promise<null> {
  return request.delete<null>(`/articles/${id}`)
}
