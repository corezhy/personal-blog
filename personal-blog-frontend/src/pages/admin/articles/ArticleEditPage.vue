<script setup lang="ts">
/**
 * 后台文章编辑 —— 新建 / 编辑（编辑/预览 Tab 切换）
 */
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadRawFile, UploadRequestOptions } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import MarkdownEditor from '@/components/business/MarkdownEditor.vue'
import MarkdownRenderer from '@/components/business/MarkdownRenderer.vue'
import { useTaxonomy } from '@/hooks/useTaxonomy'
import { createArticle, getArticleDetail, updateArticle } from '@/services/article'
import { MAX_IMAGE_SIZE, uploadImage } from '@/services/upload'
import type { ArticlePayload } from '@/types'

const route = useRoute()
const router = useRouter()
const { categories, tags } = useTaxonomy()

const editId = Number(route.params.id) || null
const loading = ref(false)
const saving = ref(false)
const activeTab = ref('edit')

const formRef = ref<FormInstance>()

/** 封面上传中 */
const coverUploading = ref(false)

const form = reactive<ArticlePayload>({
  title: '',
  summary: '',
  cover: '',
  categoryId: 0,
  tagIds: [],
  content: '',
})

const rules: FormRules<ArticlePayload> = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

onMounted(async () => {
  if (!editId) return
  loading.value = true
  try {
    const detail = await getArticleDetail(editId)
    form.title = detail.title
    form.summary = detail.summary
    form.cover = detail.cover ?? ''
    form.categoryId = detail.category.id
    form.tagIds = detail.tags.map(t => t.id)
    form.content = detail.content
  } finally {
    loading.value = false
  }
})

/** 封面图片上传前置校验：仅图片且 ≤5MB */
function beforeCoverUpload(file: UploadRawFile): boolean {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('封面必须是图片文件（jpg / png / gif / webp 等）')
    return false
  }
  if (file.size > MAX_IMAGE_SIZE) {
    ElMessage.error('封面图片不能超过 5MB')
    return false
  }
  return true
}

/**
 * 自定义上传：走统一 /upload 接口，成功后把返回的 URL 回填到 cover。
 * 失败时不调用 onError（其类型需 UploadAjaxError），直接让错误向上抛出，
 * 由 Element Plus 内部标记上传失败；错误提示已由 request 层统一弹出。
 */
async function uploadCover(options: UploadRequestOptions): Promise<void> {
  coverUploading.value = true
  try {
    const { url } = await uploadImage(options.file)
    form.cover = url
    options.onSuccess(url)
  } finally {
    coverUploading.value = false
  }
}

/** 移除已上传的封面 */
function removeCover(): void {
  form.cover = ''
}

async function handleSave(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    const payload: ArticlePayload = {
      ...form,
      cover: form.cover || undefined,
    }
    if (editId) {
      await updateArticle(editId, payload)
    } else {
      await createArticle(payload)
    }
    ElMessage.success(editId ? '更新成功' : '创建成功')
    router.push('/admin/articles')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div
    v-loading="loading"
    class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入文章标题"
          maxlength="80"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="摘要" prop="summary">
        <el-input
          v-model="form.summary"
          type="textarea"
          :rows="2"
          placeholder="一句话概括文章内容（列表页展示）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="选择分类" class="w-full">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tagIds">
          <el-select
            v-model="form.tagIds"
            multiple
            filterable
            allow-create
            collapse-tags
            placeholder="选择或输入标签"
            class="w-full"
          >
            <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
          </el-select>
        </el-form-item>

      </div>

      <el-form-item label="封面图（可选）" prop="cover">
        <div class="flex w-full items-start gap-4">
          <el-upload
            action="#"
            :show-file-list="false"
            :before-upload="beforeCoverUpload"
            :http-request="uploadCover"
            accept="image/*"
          >
            <div
              v-loading="coverUploading"
              class="relative flex h-24 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 transition-colors hover:border-gray-400 dark:border-gray-600 dark:text-gray-500 dark:hover:border-gray-400"
            >
              <img
                v-if="form.cover"
                :src="form.cover"
                class="h-full w-full object-cover"
                alt="封面预览"
              />
              <span v-else>点击上传封面</span>
            </div>
          </el-upload>
          <div class="min-w-0 flex-1 pt-1">
            <p class="text-xs leading-relaxed text-gray-400 dark:text-gray-500">
              建议使用 ≤5MB 的 jpg / png / gif / webp 图片，点击缩略图可重新上传。
            </p>
            <button
              v-if="form.cover"
              type="button"
              class="mt-2 text-xs text-gray-400 transition-colors hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
              @click="removeCover"
            >
              移除封面
            </button>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="内容（Markdown）" prop="content">
        <el-tabs v-model="activeTab" class="w-full">
          <el-tab-pane label="编辑" name="edit">
            <MarkdownEditor
              v-model="form.content"
              :rows="16"
              placeholder="支持 Markdown 语法，标题会自动生成目录"
            />
          </el-tab-pane>
          <el-tab-pane label="预览" name="preview">
            <div class="min-h-64 rounded-lg border border-gray-100 p-4 dark:border-gray-800">
              <MarkdownRenderer v-if="form.content" :content="form.content" />
              <p v-else class="text-gray-400">暂无内容</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>

      <div class="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <el-button @click="router.back()">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          {{ editId ? '保存修改' : '发布文章' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>
