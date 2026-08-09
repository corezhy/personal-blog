/**
 * 逻辑层 —— 登录 / 退出编排
 * 页面不直接调用 authApi，也不直接写 store，统一走这里。
 */
import { storeToRefs } from 'pinia'

import { login as loginApi } from '@/services/auth'
import { useAuthStore } from '@/stores/useAuthStore'
import type { LoginParams, UserInfo } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  const { userInfo, isAuthenticated, isAdmin, token } = storeToRefs(authStore)

  /** 登录：成功后写入 store（跳转由页面决定，便于区分 admin / user） */
  async function login(params: LoginParams): Promise<UserInfo> {
    const result = await loginApi(params)
    authStore.setAuth(result)
    return result.userInfo
  }

  /** 退出登录 */
  function logout(): void {
    authStore.logout()
  }

  return { userInfo, isAuthenticated, isAdmin, token, login, logout }
}
