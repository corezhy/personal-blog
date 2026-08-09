/**
 * 静态站点配置 —— 站点信息 / 关于 / 友链
 * 修改此处即可更新关于页与友链页内容，无需改动页面组件。
 */

export interface FriendLink {
  name: string
  url: string
  description: string
}

export interface SiteConfig {
  title: string
  subtitle: string
  author: string
  /** 关于页 Markdown 内容 */
  about: string
  friends: FriendLink[]
}

export const siteConfig: SiteConfig = {
  title: '望舒的博客',
  subtitle: '记录技术成长与生活思考',
  author: '管理员',
  about: [
    '# 关于我',
    '',
    '一个热爱前端工程化、追求优雅代码的开发者。',
    '',
    '## 技术栈',
    '',
    '- **前端**：Vue 3 / TypeScript / Vite / Tailwind CSS',
    '- **后端**：Node.js / Java / MySQL',
    '- **其他**：Docker / Git / Linux',
    '',
    '## 写博客的初衷',
    '',
    '写作是最好的思考方式。把零散的知识整理成体系，',
    '既是沉淀，也是与他人对话。',
    '',
    '## 联系我',
    '',
    '- GitHub：[github.com/yourname](https://github.com)',
    '- 邮箱：yourname@example.com',
    '',
    '> 本站全部内容仅供学习交流使用。',
  ].join('\n'),
  friends: [
    { name: 'Vue 官方文档', url: 'https://cn.vuejs.org', description: '渐进式 JavaScript 框架' },
    { name: 'Vite', url: 'https://vite.dev', description: '下一代前端构建工具' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com', description: '实用优先的 CSS 框架' },
    { name: 'Element Plus', url: 'https://element-plus.org', description: 'Vue 3 组件库' },
  ],
}
