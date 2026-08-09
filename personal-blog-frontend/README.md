# 望舒的博客前端 (Wangshu Blog Frontend)

基于 **Vue 3 + TypeScript 5 + Vite 8 + Pinia + Element Plus + Tailwind CSS 4** 的望舒的博客前端，遵循分层、可扩展的前端架构设计。

## 技术栈

| 分类     | 技术                                            | 说明                                    |
| -------- | ----------------------------------------------- | --------------------------------------- |
| 核心框架 | Vue 3.5 + TypeScript 5.9                        | 组合式 API + `<script setup lang="ts">` |
| 构建工具 | Vite 8                                          | 开发代理、按需构建                      |
| 路由     | Vue Router 4                                    | 嵌套路由 + 权限守卫                     |
| 状态管理 | Pinia 3                                         | 按功能切片（auth / theme）              |
| HTTP     | Axios                                           | 统一实例 + 拦截器 + 业务码解包          |
| UI       | Element Plus 2.14                               | 全局注册，中文语言包                    |
| 样式     | Tailwind CSS 4                                  | CSS-first 配置 + 暗色变体               |
| 代码规范 | ESLint 9 + Prettier 3                           | flat config + 统一格式化                |
| Markdown | markdown-it + markdown-it-anchor + highlight.js | 渲染 / TOC / 代码高亮                   |

## 快速开始

```bash
npm install
npm run dev       # http://localhost:5173
```

- 后端地址 `http://localhost:8080`，前端 `5173` 通过 Vite 代理 `/api` 解决跨域（见 `vite.config.ts`）。
- 开发环境默认开启 **Mock**（`VITE_ENABLE_MOCK=true`），无后端也能跑通全流程：
  - 管理员：`admin` / `admin123`
  - 普通用户：`user` / `user123`
- 接入真实后端：将 `.env.development` 中 `VITE_ENABLE_MOCK=false`，并保证后端接口契约一致即可。

## 目录结构（分层架构）

```
src/
├── api / services/          # API 层：axios 实例 + 拦截器 + 模块化接口 + Mock
│   └── mock/                # Mock 数据与适配器（仅开发环境启用）
├── types/                   # 契约层：全部数据结构（文章/分类/标签/用户/API 统一返回）
├── stores/                  # 状态层：按功能切片（useAuthStore / useThemeStore）
├── hooks/                   # 逻辑层：网络请求与可复用行为封装（useMarkdown / useInfiniteScroll ...）
├── components/
│   ├── common/              # 通用 UI：导航栏、主题切换、返回顶部、空状态、骨架屏
│   ├── business/            # 业务组件：文章卡片、文章列表、侧边栏、Markdown 渲染器、TOC、点赞
│   └── layouts/             # 布局：前台 FrontLayout / 后台 AdminLayout / 认证 AuthLayout
├── pages/                   # 路由层：仅负责组装布局与组件，不写业务逻辑
│   ├── home / article / category / tag / archives / about / friends / auth / error
│   └── admin/               # 后台页面（仪表盘、文章管理、文章编辑）
├── router/                  # 路由配置 + 权限守卫（requiresAuth / requiresAdmin / guestOnly）
├── config/                  # 静态站点配置（站点信息、关于、友链）
├── assets/styles/           # 全局样式：Tailwind 入口 + Markdown 正文样式
└── utils/                   # 工具函数（storage 封装等）
```

### 分层职责（严禁"面条式"）

- **pages/（路由层）**：只做"组装布局 + 挂载组件"，不写网络请求、不直接操作 store 业务逻辑（页面内的少量 `onMounted` 编排交给 hooks）。
- **components/**：`common/` 为无业务、可复用 UI；`business/` 为与领域模型强绑定的组件。
- **hooks/（逻辑层）**：所有网络请求、状态编排（无限滚动、Markdown 渲染、返回顶部、点赞）封装为自定义 Hook。
- **stores/（状态层）**：Pinia 按功能切片，auth / theme 各自独立，持久化到 localStorage。
- **services/（API 层）**：统一 axios 实例、请求/响应拦截器、业务码 `code===200` 自动解包出 `data`。
- **types/（契约层）**：先定义后端返回结构，页面与组件只面向类型编程。

## 后端接口契约

后端统一返回：`{ code: number; data: T; msg: string }`，`code === 200` 表示成功。

主要接口（均以 `/api` 为前缀）：

| 方法            | 路径                    | 说明                                             |
| --------------- | ----------------------- | ------------------------------------------------ |
| POST            | `/auth/login`           | 登录，返回 `{ token, userInfo }`                 |
| GET             | `/articles`             | 文章分页列表（`page/pageSize/categoryId/tagId`） |
| GET             | `/articles/:id`         | 文章详情（含 Markdown `content`）                |
| POST/DELETE     | `/articles/:id/like`    | 点赞 / 取消点赞                                  |
| GET             | `/categories` / `/tags` | 分类 / 标签云                                    |
| GET             | `/archives`             | 按年月聚合的时间线                               |
| GET             | `/stats`                | 站点统计（文章/分类/标签/浏览量/点赞量）         |
| POST/PUT/DELETE | `/articles`             | 新建 / 更新 / 删除文章（仅 admin）               |

## 权限模型

| 角色             | 权限                                               |
| ---------------- | -------------------------------------------------- |
| 游客（无 Token） | 正常浏览文章列表、详情；不支持点赞                 |
| user             | 浏览 + 点赞；不可修改 / 发布 / 删除                |
| admin            | 额外获得"新增 / 编辑 / 删除"按钮与 `/admin/*` 后台 |

- 登录成功后：`role === 'admin'` → 跳转 `/admin/dashboard`；`role === 'user'` → 跳转 `/`。
- 登录失败统一提示 `用户名或密码错误`。
- 未登录访问 `/admin/*` 会被守卫重定向到登录页。
