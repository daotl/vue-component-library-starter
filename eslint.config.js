import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from '@daotl/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default config(
  {
    unocss: true,
  },
  {
    ignores: ['cypress', 'storybook-static', '.nx', 'nx.json', '**/*.md', 'tsconfig.*'],
  },
  {
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.eslint.json'],
      },
    },
  },
  // Storybook
  ...compat.extends('plugin:storybook/recommended'),
  {
    files: ['.storybook/**/*.ts', './src/stories/**/*.*', '**/*.stories.ts'],
    rules: {
      'ts/no-unsafe-assignment': 'off',
    },
  },
)
