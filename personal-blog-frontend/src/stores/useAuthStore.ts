/**
 * 状态层 —— 认证切片
 *
 * 保存 token 与用户信息，持久化到 localStorage。
 * 登录 / 退出等网络操作由 hooks/useAuth 编排，此处只负责状态。
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { TOKEN_KEY, USER_KEY } from '@/services/http'
import type { LoginResult, UserInfo } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)

  const isAuthenticated = computed(() => token.value !== '')
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  /** 登录成功后写入认证状态并持久化 */
  function setAuth(payload: LoginResult): void {
    token.value = payload.token
    userInfo.value = payload.userInfo
    localStorage.setItem(TOKEN_KEY, payload.token)
    localStorage.setItem(USER_KEY, JSON.stringify(payload.userInfo))
  }

  /** 退出登录 */
  function logout(): void {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  /** 应用启动时从 localStorage 恢复会话 */
  function init(): void {
    token.value = localStorage.getItem(TOKEN_KEY) ?? ''
    const raw = localStorage.getItem(USER_KEY)
    if (raw) {
      try {
        userInfo.value = JSON.parse(raw) as UserInfo
      } catch {
        logout()
      }
    }
  }

  return { token, userInfo, isAuthenticated, isAdmin, setAuth, logout, init }
})
