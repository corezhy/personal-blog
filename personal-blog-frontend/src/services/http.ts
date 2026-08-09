/**
 * API 层 —— axios 统一实例
 *
 * - 请求拦截：自动附加 Authorization 头
 * - 响应拦截：处理 HTTP 层错误（网络异常 / 401 会话失效）
 * - 业务码（code !== 200）的校验与解包在 request.ts 中完成
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

/** 认证信息在 localStorage 中的 key（与 stores/auth 保持同步） */
export const TOKEN_KEY = 'blog-token'
export const USER_KEY = 'blog-user'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000,
})

// 请求拦截：附加 Token
http.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// 响应拦截：HTTP 层错误统一处理
http.interceptors.response.use(
  response => response,
  error => {
    const status: number | undefined = error.response?.status
    const msg: string = error.response?.data?.msg || '网络异常，请稍后重试'

    if (status === 401) {
      // 会话失效：清除本地认证信息
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      ElMessage.error('登录已过期，请重新登录')
    } else if (!axios.isCancel(error)) {
      ElMessage.error(msg)
    }
    return Promise.reject(error)
  },
)

export default http
