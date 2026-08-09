<script setup lang="ts">
/**
 * 业务组件 —— 文章管理操作（编辑 / 删除，仅 admin 场景使用）
 * 删除前二次确认；删除成功后通知父级刷新。
 */
import { Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

import { deleteArticle } from '@/services/article'

const props = defineProps<{
  id: number
}>()

const emit = defineEmits<{
  (e: 'deleted', id: number): void
}>()

const router = useRouter()

function handleEdit(): void {
  router.push(`/admin/articles/${props.id}/edit`)
}

async function handleDelete(): Promise<void> {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？删除后不可恢复。', '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }
  await deleteArticle(props.id)
  ElMessage.success('删除成功')
  emit('deleted', props.id)
}
</script>

<template>
  <div class="flex items-center gap-1">
    <el-button size="small" :icon="Edit" @click="handleEdit">编辑</el-button>
    <el-button size="small" type="danger" :icon="Delete" plain @click="handleDelete">
      删除
    </el-button>
  </div>
</template>
