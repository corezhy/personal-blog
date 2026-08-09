<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'

import { useTheme } from '@/hooks/useTheme'

const { isDark, toggle } = useTheme()
</script>

<template>
  <el-tooltip :content="isDark ? '切换到亮色模式' : '切换到暗色模式'" placement="bottom">
    <el-button circle :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'" @click="toggle">
      <el-icon :size="18">
        <Sunny v-if="!isDark" />
        <Moon v-else />
      </el-icon>
    </el-button>
  </el-tooltip>
</template>
