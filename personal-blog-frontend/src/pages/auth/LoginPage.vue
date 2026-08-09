<script setup lang="ts">
/**
 * 登录页 —— 仅用户名 + 密码，无任何多余表单元素
 *
 * 登录成功：admin -> /admin/dashboard，user -> 原目标页或首页
 * 登录失败：统一提示「用户名或密码错误」
 */
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

import { useAuth } from '@/hooks/useAuth'
import { siteConfig } from '@/config/site'
import siteAvatar from '@/assets/images/my.jpg'
import type { LoginParams } from '@/types'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive<LoginParams>({
  username: '',
  password: '',
})

const rules: FormRules<LoginParams> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleSubmit(): Promise<void> {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const user = await login({ username: form.username, password: form.password })
    ElMessage.success(`欢迎回来，${user.name}`)

    if (user.role === 'admin') {
      router.replace('/admin/dashboard')
    } else {
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      router.replace(redirect)
    }
  } catch {
    // 登录失败统一提示（后端返回的具体错误不展示）
    ElMessage.error('用户名或密码错误')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-sm">
    <div
      class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
      <!-- 品牌 -->
      <div class="mb-6 text-center">
        <img
          :src="siteAvatar"
          alt="logo"
          class="mx-auto h-14 w-14 rounded-2xl object-cover shadow"
        />
        <h1 class="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
          登录 {{ siteConfig.title }}
        </h1>
      </div>

      <!-- 表单：只有用户名和密码 -->
      <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="handleSubmit">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            :prefix-icon="User"
            autocomplete="username"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            autocomplete="current-password"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          class="w-full"
          size="large"
          :loading="loading"
          @click="handleSubmit"
        >
          登 录
        </el-button>
      </el-form>
    </div>

    <!-- 演示账号提示 -->
    <p class="mt-4 text-center text-xs text-gray-400">
      演示账号：admin / admin123 · user / user123
    </p>
  </div>
</template>
