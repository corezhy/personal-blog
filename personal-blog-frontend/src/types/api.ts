/**
 * 契约层 —— 后端统一返回结构 & 通用分页结构
 *
 * 后端所有接口统一返回 { code, data, msg }，code === 200 表示成功。
 */

/** 后端统一返回结果 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  msg: string
}

/** 分页请求参数 */
export interface PageParams {
  page: number
  pageSize: number
}

/** 分页返回结构 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
