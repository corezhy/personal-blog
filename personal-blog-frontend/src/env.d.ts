/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 是否启用 Mock（开发环境） */
  readonly VITE_ENABLE_MOCK: string
  /** 接口统一前缀 */
  readonly VITE_API_BASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
