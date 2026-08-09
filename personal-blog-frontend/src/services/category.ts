/**
 * API 层 —— 分类接口
 */
import type { CategoryInfo } from '@/types'

import request from './request'

/** 获取全部分类（含文章数，供分类云使用） */
export function getCategories(): Promise<CategoryInfo[]> {
  return request.get<CategoryInfo[]>('/categories')
}
