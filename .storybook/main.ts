import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'

import { commonConfig, commonPlugins } from '../vite.config'

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
  },
  framework: '@storybook/vue3-vite',
  // framework: {
  //   name: '@storybook/vue3-vite',
  //   options: {},
  // },
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  // features: {
  //   interactionsDebugger: true,
  //   buildStoriesJson: true,
  // },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  viteFinal(config /* , { configType } */) {
    return mergeConfig(config, {
      resolve: {
        ...commonConfig.resolve,
        dedupe: [
          ...(commonConfig.resolve?.dedupe ?? []),
          // Workaround for: https://github.com/storybookjs/storybook/issues/10887#issuecomment-901109891
          '@storybook/client-api',
          // Workaround for MDX error because React 16&17 are both in dependency tree causing conflict.
          'react',
          'react-dom',
        ],
      },
      plugins: commonPlugins('serve'),
    })
  },
}

export default config
