module.exports = {
  root: true,
  extends: '@daotl/vue/typescript',
  overrides: [
    {
      files: '*.{ts,tsx,vue}',
      excludedFiles: ['*.mdx', '**/*.md/*.ts'],
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
    {
      files: '*.stories.ts',
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'off',
      },
    },
  ],
  rules: {
    'no-undef': 'off', // Turned off for `unplugin-auto-import`
  },
}
