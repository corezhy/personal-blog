/**
 * 契约层 —— 分类
 */

export interface CategoryInfo {
  id: number
  name: string
  /** 分类描述（可选） */
  description?: string
  /** 该分类下文章数（分类云用） */
  count?: number
}
