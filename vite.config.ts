/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkReadingTime from './scripts/remark-reading-time.mjs'

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkReadingTime, remarkMdxFrontmatter] }) },
    react({ include: /\.(mdx|tsx?)$/ }),
    tailwindcss(),
  ],
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
})
