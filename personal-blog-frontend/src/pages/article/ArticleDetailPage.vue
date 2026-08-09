<script setup lang="ts">
/**
 * 文章详情页 —— Markdown 渲染 + 代码高亮 + TOC 锚点 + 点赞
 * 游客可正常浏览；登录用户可点赞；admin 额外看到编辑/删除。
 */
import { Calendar, User, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppEmpty from '@/components/common/AppEmpty.vue'
import AppSkeleton from '@/components/common/AppSkeleton.vue'
import ArticleActions from '@/components/business/ArticleActions.vue'
import LikeButton from '@/components/business/LikeButton.vue'
import TocList from '@/components/business/TocList.vue'
import { useAuth } from '@/hooks/useAuth'
import { useLike } from '@/hooks/useLike'
import { useMarkdown } from '@/hooks/useMarkdown'
import { getArticleDetail } from '@/services/article'
import { formatDateTime } from '@/utils/date'
import type { ArticleDetail } from '@/types'

const route = useRoute()
const router = useRouter()
const { isAdmin } = useAuth()

const article = ref<ArticleDetail | null>(null)
const loading = ref(true)
const notFound = ref(false)

async function load(): Promise<void> {
  const id = Number(route.params.id)
  loading.value = true
  notFound.value = false
  try {
    article.value = await getArticleDetail(id)
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)

const { liked, likes, liking, toggleLike } = useLike(article)

const content = computed(() => article.value?.content ?? '')
const { html, toc } = useMarkdown(content)

function handleDeleted(_id: number): void {
  ElMessage.success('文章已删除')
  router.replace('/')
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-6">
    <!-- 加载中 -->
    <AppSkeleton v-if="loading" :count="1" />

    <!-- 不存在 -->
    <AppEmpty v-else-if="notFound" description="文章不存在或已被删除" />

    <div v-else-if="article" class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
      <!-- 正文 -->
      <article
        class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <h1 class="text-2xl leading-snug font-bold text-gray-900 dark:text-gray-100">
          {{ article.title }}
        </h1>

        <!-- 元信息 -->
        <div
          class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400 dark:text-gray-500"
        >
          <span class="inline-flex items-center gap-1">
            <el-icon :size="14"><User /></el-icon>
            {{ article.author.name }}
          </span>
          <span class="inline-flex items-center gap-1">
            <el-icon :size="14"><Calendar /></el-icon>
            {{ formatDateTime(article.createdAt) }}
          </span>
          <span class="inline-flex items-center gap-1">
            <el-icon :size="14"><View /></el-icon>
            {{ article.views }} 阅读
          </span>
        </div>

        <!-- 标签 -->
        <div class="mt-3 flex flex-wrap gap-2">
          <router-link
            v-for="tag in article.tags"
            :key="tag.id"
            :to="`/tag/${tag.id}`"
            class="rounded-full bg-gray-100 px-3 py-0.5 text-xs text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
          >
            # {{ tag.name }}
          </router-link>
        </div>

        <!-- 管理操作（仅 admin） -->
        <div v-if="isAdmin" class="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <ArticleActions :id="article.id" @deleted="handleDeleted" />
        </div>

        <!-- Markdown 正文 -->
        <div class="markdown-body mt-6" v-html="html" />

        <!-- 点赞 -->
        <div class="mt-10 flex justify-center border-t border-gray-100 pt-8 dark:border-gray-800">
          <LikeButton :liked="liked" :count="likes" :loading="liking" @toggle="toggleLike" />
        </div>
      </article>

      <!-- 目录（TOC） -->
      <aside class="hidden lg:block">
        <div
          class="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <h4 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">目录</h4>
          <TocList :items="toc" container-selector=".markdown-body" />
        </div>
      </aside>
    </div>
  </div>
</template>
