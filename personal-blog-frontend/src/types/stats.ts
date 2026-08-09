/**
 * 契约层 —— 站点统计（后台仪表盘）
 */

export interface SiteStats {
  articleCount: number
  categoryCount: number
  tagCount: number
  totalViews: number
  totalLikes: number
}
