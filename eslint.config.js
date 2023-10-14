import config from '@daotl/eslint-config'
import unocss from '@unocss/eslint-plugin'

export default [
  {

    ignores: ['cypress', '**/*.md', '!.storybook', 'storybook-static'],
  },
  ...config(),
  unocss.configs.flat,
]
