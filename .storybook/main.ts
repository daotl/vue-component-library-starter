import type { StorybookConfig } from '@storybook/builder-vite'

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
    return {
      ...commonConfig,
      ...config,
      resolve: {
        ...commonConfig.resolve,
        ...config.resolve,
        alias: {
          ...commonConfig.resolve?.alias,
          ...config.resolve?.alias,
        },
        dedupe: [
          ...(commonConfig.resolve?.dedupe ?? []),
          ...(config.resolve?.dedupe || []),
          // Workaround for: https://github.com/storybookjs/storybook/issues/10887#issuecomment-901109891
          '@storybook/client-api',
          // Workaround for MDX error because React 16&17 are both in dependency tree causing conflict.
          'react',
          'react-dom',
        ],
      },
      plugins: [...commonPlugins('serve'), ...(config.plugins ?? [])],
    }
  },
}

export default config
