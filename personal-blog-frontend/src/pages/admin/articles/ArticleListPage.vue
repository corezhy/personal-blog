<script setup lang="ts">
/**
 * 后台文章管理 —— 表格 + 服务端分页 + 新增/编辑/删除
 */
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

import { usePagedArticles } from '@/hooks/usePagedArticles'
import { deleteArticle } from '@/services/article'
import { formatDateTime } from '@/utils/date'
import { formatCount } from '@/utils/format'

const router = useRouter()
const { list, total, page, pageSize, loading, refresh } = usePagedArticles(10)

async function handleDelete(id: number): Promise<void> {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？删除后不可恢复。', '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  await deleteArticle(id)
  ElMessage.success('删除成功')
  refresh()
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <header
      class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
    >
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">文章管理</h2>
      <el-button type="primary" :icon="Plus" @click="router.push('/admin/articles/new')">
        新增文章
      </el-button>
    </header>

    <el-table v-loading="loading" :data="list" class="w-full">
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
      <el-table-column label="分类" width="110">
        <template #default="{ row }">{{ row.category.name }}</template>
      </el-table-column>
      <el-table-column label="标签" min-width="160">
        <template #default="{ row }">
          <el-tag v-for="tag in row.tags" :key="tag.id" size="small" class="mr-1" effect="plain">
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="浏览" width="90" align="center">
        <template #default="{ row }">{{ formatCount(row.views) }}</template>
      </el-table-column>
      <el-table-column label="点赞" width="90" align="center">
        <template #default="{ row }">{{ formatCount(row.likes) }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template #default="{ row }">
          <el-button
            size="small"
            :icon="Edit"
            link
            type="primary"
            @click="router.push(`/admin/articles/${row.id}/edit`)"
          >
            编辑
          </el-button>
          <el-button size="small" :icon="Delete" link type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end px-5 py-4">
      <el-pagination
        v-model:current-page="page"
        background
        layout="prev, pager, next, total"
        :total="total"
        :page-size="pageSize"
      />
    </div>
  </div>
</template>
