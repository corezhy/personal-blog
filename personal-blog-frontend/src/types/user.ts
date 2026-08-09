/**
 * 契约层 —— 用户 / 认证相关类型
 */

export type UserRole = 'admin' | 'user'

export interface UserInfo {
  id: number
  name: string
  role: UserRole
}

/** 登录请求参数 */
export interface LoginParams {
  username: string
  password: string
}

/** 登录成功返回 */
export interface LoginResult {
  token: string
  userInfo: UserInfo
}
