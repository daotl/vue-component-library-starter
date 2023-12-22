import config from '@daotl/eslint-config'

export default config({
  unocss: true,
}, {
  ignores: ['cypress', '.nx', '**/*.md', 'tsconfig.*'],
}, {
  languageOptions: {
    parserOptions: {
      project: ['tsconfig.eslint.json'],
    },
  },
})
