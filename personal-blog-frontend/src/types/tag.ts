/**
 * 契约层 —— 标签
 */

export interface TagInfo {
  id: number
  name: string
  /** 该标签下文章数（标签云用） */
  count?: number
}
