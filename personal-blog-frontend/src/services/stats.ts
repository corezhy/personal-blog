/**
 * API 层 —— 站点统计接口
 */
import type { SiteStats } from '@/types'

import request from './request'

/** 站点统计（后台仪表盘） */
export function getSiteStats(): Promise<SiteStats> {
  return request.get<SiteStats>('/stats')
}
