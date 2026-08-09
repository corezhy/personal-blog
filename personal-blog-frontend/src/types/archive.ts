/**
 * 契约层 —— 归档
 */

/** 归档中的单篇文章 */
export interface ArchiveItem {
  id: number
  title: string
  createdAt: string
}

/** 某年某月的文章 */
export interface ArchiveMonth {
  month: number
  articles: ArchiveItem[]
}

/** 按年份归档 */
export interface ArchiveYear {
  year: number
  months: ArchiveMonth[]
}
