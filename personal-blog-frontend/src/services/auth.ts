/**
 * API 层 —— 认证接口
 */
import type { LoginParams, LoginResult, UserInfo } from '@/types'

import request from './request'

/** 登录（silent：登录失败的提示由页面统一控制为“用户名或密码错误”） */
export function login(params: LoginParams): Promise<LoginResult> {
  return request.post<LoginResult>('/auth/login', params, { silent: true })
}

/** 获取当前登录用户信息 */
export function getCurrentUser(): Promise<UserInfo> {
  return request.get<UserInfo>('/auth/me')
}
