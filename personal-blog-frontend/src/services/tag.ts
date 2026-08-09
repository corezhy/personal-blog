/**
 * API 层 —— 标签接口
 */
import type { TagInfo } from '@/types'

import request from './request'

/** 获取全部标签（含文章数，供标签云使用） */
export function getTags(): Promise<TagInfo[]> {
  return request.get<TagInfo[]>('/tags')
}
