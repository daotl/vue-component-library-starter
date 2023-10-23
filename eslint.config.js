import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from '@daotl/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'
import unocss from '@unocss/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  {
    ignores: ['cypress', 'storybook-static'],
  },
  ...config(),
  unocss.configs.flat,

  // Storybook
  ...compat.extends('plugin:storybook/recommended'),
  {
    files: ['.storybook/**/*.ts', './src/stories/**/*.*', '**/*.stories.ts'],
    rules: {
      'ts/no-unsafe-assignment': 'off',
    },
  },
]
