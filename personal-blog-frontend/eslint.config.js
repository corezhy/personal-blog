import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'src/auto-imports.d.ts',
      'src/components.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // 组件名为多单词、props 非必填等放宽，博客场景偏实用
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/attributes-order': 'off',
      // Markdown 内容经服务端约束，此处信任渲染
      'vue/no-v-html': 'off',
    },
  },
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      // 类型由 TS 负责，ESLint 层面的 no-undef 会误报运行时 API / 宏
      'no-undef': 'off',
      // 服务层解包、部分工具允许显式 any，保持可用性
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
)
