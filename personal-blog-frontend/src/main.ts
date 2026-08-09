/**
 * 应用入口
 *
 * 初始化顺序：
 * 1. 按环境变量开启 Mock（仅开发环境）
 * 2. 挂载 Pinia，并初始化 auth / theme 两个切片
 * 3. 挂载路由（守卫依赖已就绪的 Pinia）
 * 4. 全局注册 Element Plus（含中文语言包）
 */
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import '@/assets/styles/main.css'
import '@/assets/styles/markdown.css'

import App from './App.vue'
import router from './router'
import { setupMock } from './services/mock'
import { useAuthStore } from './stores/useAuthStore'
import { useThemeStore } from './stores/useThemeStore'

// 开发环境：无后端时启用 Mock
if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
  setupMock()
}

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

// 恢复持久化的会话与主题
useThemeStore().init()
useAuthStore().init()

app.use(router)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
