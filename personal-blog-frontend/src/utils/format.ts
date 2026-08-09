/**
 * 工具 —— 数字 / 文案格式化
 */

/** 数值缩写：1234 -> 1.2k */
export function formatCount(value: number): string {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return String(value)
}
