/**
 * 逻辑层 —— Markdown 渲染与目录（TOC）生成
 *
 * - 基于 markdown-it 渲染 HTML（code 高亮交给 highlight.js）
 * - markdown-it-anchor 为各级标题生成锚点 id
 * - 从渲染结果中提取目录，保证 id 与标题一一对应
 */
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
// 只注册常用语言，避免把 highlight.js 全部语言打进包
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import plaintext from 'highlight.js/lib/languages/plaintext'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import { computed } from 'vue'
import type { Ref } from 'vue'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('plaintext', plaintext)

/** 常见语言别名归一化 */
const LANGUAGE_ALIAS: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  html: 'xml',
  xhtml: 'xml',
  md: 'markdown',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
}

/** 目录项 */
export interface TocItem {
  level: number
  id: string
  text: string
}

let headingSeq = 0

/** 标题 slug：优先保留 ASCII 与中文，纯中文标题回退为顺序 id */
function slugify(input: string): string {
  const s = String(input).trim().toLowerCase()
  const ascii = s.replace(/[^\w一-龥]+/g, '-').replace(/^-+|-+$/g, '')
  if (ascii) return ascii
  headingSeq += 1
  return `heading-${headingSeq}`
}

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight(code, lang): string {
    const normalized = lang ? (LANGUAGE_ALIAS[lang.toLowerCase()] ?? lang) : ''
    if (normalized && hljs.getLanguage(normalized)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(code, {
            language: normalized,
            ignoreIllegals: true,
          }).value
        }</code></pre>`
      } catch {
        /* 语言不支持时走默认转义 */
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`
  },
}).use(anchor, {
  level: [1, 2, 3, 4, 5, 6],
  slugify,
  uniqueSlug: true,
  tabIndex: false,
})

function render(content: string): string {
  headingSeq = 0
  return md.render(content)
}

const TOC_RE = /<h([1-6])\s+id="([^"]+)"[^>]*>(.*?)<\/h\1>/gi

function decodeEntities(s: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = s
  return textarea.value
}

function extractToc(html: string): TocItem[] {
  const items: TocItem[] = []
  let m: RegExpExecArray | null
  TOC_RE.lastIndex = 0
  while ((m = TOC_RE.exec(html))) {
    items.push({
      level: Number(m[1]),
      id: m[2],
      text: decodeEntities(m[3].replace(/<[^>]+>/g, '').trim()),
    })
  }
  return items
}

/** 传入 Markdown 正文 ref，得到 html 与 toc 两个计算属性 */
export function useMarkdown(source: Ref<string | null | undefined>) {
  const html = computed(() => render(source.value ?? ''))
  const toc = computed<TocItem[]>(() => extractToc(html.value))
  return { html, toc }
}
