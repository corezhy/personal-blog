/**
 * API 层 —— 类型安全请求封装
 *
 * 后端统一返回 { code, data, msg }。此处封装后：
 * - code === 200 时直接解包返回 data（调用方拿到的是真正的业务数据）
 * - code !== 200 时抛出 ApiError，默认弹出 msg 提示，可用 silent 关闭
 */
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types'

import http from './http'

/** 业务错误（后端 code !== 200） */
export class ApiError extends Error {
  code: number

  constructor(code: number, msg: string) {
    super(msg)
    this.name = 'ApiError'
    this.code = code
  }
}

export interface RequestOptions {
  /** 为 true 时不自动弹出错误提示，由调用方自行处理 */
  silent?: boolean
}

/** 请求体（接口等结构体均可直接传入） */
type RequestData = object | null | undefined

async function handle<T>(
  promise: Promise<{ data: ApiResponse<T> }>,
  options?: RequestOptions,
): Promise<T> {
  const { data } = await promise
  if (data.code === 200) {
    return data.data
  }
  // 业务码非 200：默认弹出 msg，silent 场景由调用方自行提示
  const error = new ApiError(data.code, data.msg || '请求失败')
  if (!options?.silent) {
    ElMessage.error(error.message)
  }
  throw error
}

export const request = {
  get<T>(url: string, params?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
    return handle<T>(http.get<ApiResponse<T>>(url, { params }), options)
  },

  post<T>(url: string, data?: RequestData, options?: RequestOptions): Promise<T> {
    return handle<T>(http.post<ApiResponse<T>>(url, data), options)
  },

  put<T>(url: string, data?: RequestData, options?: RequestOptions): Promise<T> {
    return handle<T>(http.put<ApiResponse<T>>(url, data), options)
  },

  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return handle<T>(http.delete<ApiResponse<T>>(url), options)
  },
}

export default request
