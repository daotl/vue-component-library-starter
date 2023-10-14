import '~/main-lib'

import { setup } from '@storybook/vue3'
import type { ViteSSGContext } from 'vite-ssg'
import type { App } from 'vue'

import * as i18n from '~/modules/i18n'

setup((app: App<Element>) => {
  i18n.install({ app } as ViteSSGContext)
})

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  // Global layout: https://storybook.js.org/docs/react/configure/story-layout#global-layout
  layout: 'centered', // 'padded',
  controls: {
    // Show full documentation for each property
    // https://storybook.js.org/docs/react/essentials/controls#show-full-documentation-for-each-property
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
