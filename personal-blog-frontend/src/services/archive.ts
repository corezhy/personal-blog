/**
 * API 层 —— 归档接口
 */
import type { ArchiveYear } from '@/types'

import request from './request'

/** 按年月聚合的文章归档 */
export function getArchives(): Promise<ArchiveYear[]> {
  return request.get<ArchiveYear[]>('/archives')
}
