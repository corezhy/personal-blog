/**
 * 工具 —— 日期格式化
 * 后端时间形如 "2026-07-28 10:24:00"，需兼容 Safari 的解析（将 - 替换为 /）。
 */

/** 解析后端时间字符串 */
function parse(input: string | Date): Date {
  if (input instanceof Date) return input
  return new Date(input.replace(/-/g, '/'))
}

const pad = (n: number) => String(n).padStart(2, '0')

/** 格式化日期：2026-07-28 */
export function formatDate(input: string | Date, sep = '-'): string {
  const d = parse(input)
  return `${d.getFullYear()}${sep}${pad(d.getMonth() + 1)}${sep}${pad(d.getDate())}`
}

/** 格式化日期时间：2026-07-28 10:24 */
export function formatDateTime(input: string | Date): string {
  const d = parse(input)
  return `${formatDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 归档用：2026年7月 */
export function formatYearMonth(year: number, month: number): string {
  return `${year}年${month}月`
}
