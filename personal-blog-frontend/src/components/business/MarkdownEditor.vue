<script setup lang="ts">
/**
 * 业务组件 —— Markdown 编辑器
 *
 * 顶部工具栏：鼠标悬停显示功能名，点击在光标处插入/包裹对应 Markdown 语法。
 * 覆盖常用 Markdown 与 GFM 语法：标题、加粗、斜体、删除线、引用、无序/有序/任务列表、
 * 行内代码、代码块、分割线、表格、链接、图片。
 * 内部复用 el-input(type=textarea)，兼容 el-form 表单校验。
 */
import {
  ChatLineSquare,
  Grid,
  Link as LinkIcon,
  List,
  Loading,
  Minus,
  Picture,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ElInput } from 'element-plus'
import { nextTick, ref, watch } from 'vue'

import { isImageFile, MAX_IMAGE_SIZE, uploadImage } from '@/services/upload'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    rows?: number
    placeholder?: string
  }>(),
  {
    modelValue: '',
    rows: 16,
    placeholder: '',
  },
)
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const elInputRef = ref<InstanceType<typeof ElInput>>()
const local = ref(props.modelValue)
const headingVisible = ref(false)

/** 隐藏的图片文件选择框 */
const imageInputRef = ref<HTMLInputElement>()
/** 图片上传中（按钮置灰 + loading） */
const uploading = ref(false)
/** 点击"图片"按钮时记录的光标选区与默认 alt，上传完成后据此插入 markdown */
let pendingImage: { start: number; end: number; alt: string } | null = null

watch(
  () => props.modelValue,
  (v) => {
    if (v !== local.value) local.value = v
  },
)

function handleInput(value: string): void {
  local.value = value
  emit('update:modelValue', value)
}

/** 取内部 textarea DOM，用于读写光标选区 */
function getTextarea(): HTMLTextAreaElement | null {
  const el = elInputRef.value?.$el
  return el ? (el as HTMLElement).querySelector('textarea') : null
}

/**
 * 写入新内容并保持光标选区与滚动位置不跳变。
 * 先直接改 DOM，再同步 Vue 状态；el-input 的 setNativeInputValue 在值一致时
 * 不会重写 DOM，因此 Vue 重渲染不会重置光标或把滚动框滑到底部。
 */
function emitAndSet(newValue: string, selStart: number, selEnd: number): void {
  const ta = getTextarea()
  if (!ta) return
  const scrollTop = ta.scrollTop

  ta.value = newValue
  ta.setSelectionRange(selStart, selEnd)
  ta.scrollTop = scrollTop

  local.value = newValue
  emit('update:modelValue', newValue)

  // 兜底：Vue 渲染完成后再次确认选区与滚动位置
  void nextTick(() => {
    const el = getTextarea()
    if (!el || el.value !== newValue) return
    el.setSelectionRange(selStart, selEnd)
    el.scrollTop = scrollTop
  })
}

/** 包裹选区：加粗 / 斜体 / 删除线 / 行内代码 / 图片（无选区时选中占位符） */
function wrapSelection(prefix: string, suffix: string, placeholder: string): void {
  const ta = getTextarea()
  if (!ta) return
  const { selectionStart: s, selectionEnd: e, value } = ta
  const selected = value.slice(s, e)
  const inner = selected || placeholder
  const newValue = value.slice(0, s) + prefix + inner + suffix + value.slice(e)
  emitAndSet(newValue, s + prefix.length, s + prefix.length + inner.length)
}

/** 行首前缀开关：标题 / 引用 / 无序列表 / 任务列表（再次点击可取消） */
function toggleLinePrefix(prefix: string): void {
  const ta = getTextarea()
  if (!ta) return
  const { selectionStart: s, selectionEnd: e, value } = ta
  const lineStart = value.lastIndexOf('\n', s - 1) + 1
  const relEnd = value.indexOf('\n', e)
  const lineEnd = relEnd === -1 ? value.length : relEnd
  const block = value.slice(lineStart, lineEnd)
  const lines = block.split('\n')
  const allPrefixed = lines.length > 0 && lines.every((l) => l.startsWith(prefix))
  const out = lines.map((l) => (allPrefixed ? l.slice(prefix.length) : prefix + l)).join('\n')
  const newValue = value.slice(0, lineStart) + out + value.slice(lineEnd)
  emitAndSet(newValue, lineStart, lineStart + out.length)
}

/** 有序列表：识别任意数字编号，支持开关 */
function toggleOrderedList(): void {
  const ta = getTextarea()
  if (!ta) return
  const { selectionStart: s, selectionEnd: e, value } = ta
  const lineStart = value.lastIndexOf('\n', s - 1) + 1
  const relEnd = value.indexOf('\n', e)
  const lineEnd = relEnd === -1 ? value.length : relEnd
  const block = value.slice(lineStart, lineEnd)
  const lines = block.split('\n')
  const allOrdered = lines.length > 0 && lines.every((l) => /^\d+\.\s/.test(l))
  const out = lines.map((l) => (allOrdered ? l.replace(/^\d+\.\s/, '') : `1. ${l}`)).join('\n')
  const newValue = value.slice(0, lineStart) + out + value.slice(lineEnd)
  emitAndSet(newValue, lineStart, lineStart + out.length)
}

/** 标题：一级 ~ 六级（同级别再点取消，其他级别则替换级别） */
const HEADING_RE = /^#{1,6}\s/
const HEADING_NAMES = ['一级标题', '二级标题', '三级标题', '四级标题', '五级标题', '六级标题']
function applyHeading(level: number): void {
  headingVisible.value = false
  const ta = getTextarea()
  if (!ta) return
  const prefix = '#'.repeat(level) + ' '
  const { selectionStart: s, selectionEnd: e, value } = ta
  const lineStart = value.lastIndexOf('\n', s - 1) + 1
  const relEnd = value.indexOf('\n', e)
  const lineEnd = relEnd === -1 ? value.length : relEnd
  const block = value.slice(lineStart, lineEnd)
  const out = block
    .split('\n')
    .map((l) => {
      if (l.startsWith(prefix)) return l.slice(prefix.length) // 同级别 → 取消
      if (HEADING_RE.test(l)) return l.replace(HEADING_RE, prefix) // 其他级别 → 换级
      return prefix + l // 普通行 → 添加
    })
    .join('\n')
  const newValue = value.slice(0, lineStart) + out + value.slice(lineEnd)
  emitAndSet(newValue, lineStart, lineStart + out.length)
}

/** 分割线 */
function insertDivider(): void {
  const ta = getTextarea()
  if (!ta) return
  const { selectionStart: s, value } = ta
  const lineStart = value.lastIndexOf('\n', s - 1) + 1
  const atLineStart = s === lineStart
  const insert = atLineStart ? '---\n' : '\n---\n'
  const newValue = value.slice(0, s) + insert + value.slice(s)
  emitAndSet(newValue, s + insert.length, s + insert.length)
}

/** 代码块：无选区时插入带占位符的示例，有选区时包裹选区 */
function insertCodeBlock(): void {
  const ta = getTextarea()
  if (!ta) return
  const { selectionStart: s, selectionEnd: e, value } = ta
  const selected = value.slice(s, e)
  const fence = '```'
  const code = selected || '在这里输入代码'
  const insert = fence + 'js\n' + code + '\n' + fence
  const newValue = value.slice(0, s) + insert + value.slice(e)
  const codeStart = s + (fence + 'js\n').length
  emitAndSet(newValue, codeStart, codeStart + code.length)
}

/** 表格：插入 GFM 表格并选中第一个表头单元格 */
function insertTable(): void {
  const ta = getTextarea()
  if (!ta) return
  const { selectionStart: s, value } = ta
  const lineStart = value.lastIndexOf('\n', s - 1) + 1
  const atLineStart = s === lineStart
  const rows = ['| 列1 | 列2 | 列3 |', '| --- | --- | --- |', '| 内容 | 内容 | 内容 |', ''].join(
    '\n',
  )
  const insert = (atLineStart ? '' : '\n') + rows
  const newValue = value.slice(0, s) + insert + value.slice(s)
  const headerStart = s + (atLineStart ? 0 : 1) + '| '.length
  emitAndSet(newValue, headerStart, headerStart + '列1'.length)
}

/** 链接：有选区时作为链接文字并选中 URL，无选区时插入占位符 */
function insertLink(): void {
  const ta = getTextarea()
  if (!ta) return
  const { selectionStart: s, selectionEnd: e, value } = ta
  const selected = value.slice(s, e)
  const url = 'https://'
  if (selected) {
    const newValue = value.slice(0, s) + '[' + selected + '](' + url + ')' + value.slice(e)
    const selStart = s + selected.length + 3
    emitAndSet(newValue, selStart, selStart + url.length)
  } else {
    const text = '链接文字'
    const newValue = value.slice(0, s) + '[' + text + '](' + url + ')' + value.slice(e)
    emitAndSet(newValue, s + 1, s + 1 + text.length)
  }
}

/** 图片：点击后选择本地图片 → 上传获取 URL → 在光标处插入 ![alt](url) */
function pickImage(): void {
  const ta = getTextarea()
  if (ta) {
    pendingImage = { start: ta.selectionStart, end: ta.selectionEnd, alt: '图片' }
  }
  imageInputRef.value?.click()
}

/** 选择图片后的处理：校验 → 上传 → 插入 markdown 图片语法 */
async function handleImageFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  if (!isImageFile(file)) {
    ElMessage.warning('请选择图片文件（jpg / png / gif / webp 等）')
    return
  }
  if (file.size > MAX_IMAGE_SIZE) {
    ElMessage.warning('图片大小不能超过 5MB')
    return
  }
  if (pendingImage) {
    // 默认 alt 取文件名（去扩展名），上传后自动选中便于改名
    const alt = file.name.replace(/\.[^.]+$/, '').replace(/[\]\\]/g, '').slice(0, 30)
    pendingImage.alt = alt || '图片'
  }

  uploading.value = true
  try {
    const { url } = await uploadImage(file)
    insertImageUrl(url)
  } catch {
    // 上传失败已由 request 层统一弹错，这里仅清理光标记录，避免下次插错位置
    pendingImage = null
  } finally {
    uploading.value = false
  }
}

/** 把上传返回的 URL 在之前光标处插成 markdown 图片语法，并选中 alt 文本 */
function insertImageUrl(url: string): void {
  const ta = getTextarea()
  if (!ta) return
  const pos = pendingImage ?? { start: ta.selectionStart, end: ta.selectionEnd, alt: '图片' }
  const markdown = `![${pos.alt}](${url})`
  const newValue = ta.value.slice(0, pos.start) + markdown + ta.value.slice(pos.end)
  const selStart = pos.start + 2 // '![' 之后，选中 alt 便于直接修改
  ta.focus()
  emitAndSet(newValue, selStart, selStart + pos.alt.length)
  pendingImage = null
}
</script>

<template>
  <div
    class="md-editor overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- 工具栏 -->
    <div
      class="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-gray-800 dark:bg-gray-800/50"
    >
      <!-- 标题 -->
      <el-popover
        v-model:visible="headingVisible"
        placement="bottom-start"
        trigger="click"
        :width="150"
        :show-arrow="false"
      >
        <template #reference>
          <button type="button" class="tb-btn font-bold" title="标题">H</button>
        </template>
        <div class="flex flex-col gap-0.5 py-0.5">
          <button
            v-for="n in 6"
            :key="n"
            type="button"
            class="flex items-center justify-between rounded px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="applyHeading(n)"
          >
            <span>{{ HEADING_NAMES[n - 1] }}</span>
            <span class="ml-3 font-mono text-xs text-gray-400">{{ '#'.repeat(n) }}</span>
          </button>
        </div>
      </el-popover>

      <span class="mx-0.5 h-4 w-px bg-gray-300 dark:bg-gray-600" />

      <!-- 文本样式 -->
      <el-tooltip content="加粗" placement="top">
        <button type="button" class="tb-btn" @click="wrapSelection('**', '**', '加粗文字')">
          <span class="font-black">B</span>
        </button>
      </el-tooltip>
      <el-tooltip content="斜体" placement="top">
        <button type="button" class="tb-btn" @click="wrapSelection('*', '*', '斜体文字')">
          <span class="font-serif italic">I</span>
        </button>
      </el-tooltip>
      <el-tooltip content="删除线" placement="top">
        <button type="button" class="tb-btn" @click="wrapSelection('~~', '~~', '删除线文字')">
          <span class="line-through">S</span>
        </button>
      </el-tooltip>
      <el-tooltip content="行内代码" placement="top">
        <button type="button" class="tb-btn" @click="wrapSelection('`', '`', 'code')">
          <code class="font-mono text-xs">code</code>
        </button>
      </el-tooltip>

      <span class="mx-0.5 h-4 w-px bg-gray-300 dark:bg-gray-600" />

      <!-- 段落与列表 -->
      <el-tooltip content="引用" placement="top">
        <button type="button" class="tb-btn" @click="toggleLinePrefix('> ')">
          <el-icon><ChatLineSquare /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="无序列表" placement="top">
        <button type="button" class="tb-btn" @click="toggleLinePrefix('- ')">
          <el-icon><List /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="有序列表" placement="top">
        <button type="button" class="tb-btn" @click="toggleOrderedList">
          <span class="font-mono text-xs">1.</span>
        </button>
      </el-tooltip>
      <el-tooltip content="任务列表" placement="top">
        <button type="button" class="tb-btn" @click="toggleLinePrefix('- [ ] ')">
          <span class="inline-block h-3 w-3 rounded-[3px] border border-current align-middle" />
        </button>
      </el-tooltip>
      <el-tooltip content="分割线" placement="top">
        <button type="button" class="tb-btn" @click="insertDivider">
          <el-icon><Minus /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip content="代码块" placement="top">
        <button type="button" class="tb-btn" @click="insertCodeBlock">
          <code class="font-mono text-xs">&lt;/&gt;</code>
        </button>
      </el-tooltip>
      <el-tooltip content="表格" placement="top">
        <button type="button" class="tb-btn" @click="insertTable">
          <el-icon><Grid /></el-icon>
        </button>
      </el-tooltip>

      <span class="mx-0.5 h-4 w-px bg-gray-300 dark:bg-gray-600" />

      <!-- 插入 -->
      <el-tooltip content="链接" placement="top">
        <button type="button" class="tb-btn" @click="insertLink">
          <el-icon><LinkIcon /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip :content="uploading ? '上传中…' : '图片'" placement="top">
        <button type="button" class="tb-btn" :disabled="uploading" @click="pickImage">
          <el-icon v-if="!uploading"><Picture /></el-icon>
          <el-icon v-else class="is-loading"><Loading /></el-icon>
        </button>
      </el-tooltip>
    </div>

    <!-- 编辑区：复用 el-input 以接入 el-form 校验 -->
    <el-input
      ref="elInputRef"
      :model-value="local"
      type="textarea"
      :rows="rows"
      :placeholder="placeholder"
      resize="vertical"
      class="font-mono"
      @update:model-value="handleInput"
    />

    <!-- 隐藏的图片文件选择框：仅当点击工具栏"图片"按钮时触发 -->
    <input
      ref="imageInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageFile"
    />
  </div>
</template>

<style scoped>
/* 工具栏按钮：统一尺寸，颜色跟随 Element Plus 主题变量（含暗色） */
.tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.tb-btn:hover {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}

.tb-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 去掉 el-input 自带边框，由外层容器统一提供，避免出现双边框 */
.md-editor :deep(.el-textarea__inner) {
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 12px 16px;
  background: transparent;
}

/* 编辑区聚焦时给整个编辑器描边 */
.md-editor:focus-within {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px var(--el-color-primary);
}
</style>
