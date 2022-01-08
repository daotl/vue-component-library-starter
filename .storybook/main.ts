const  { commonConfig, commonPlugins } = require('../vite.common')

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials'
  ],
  framework: '@storybook/vue3',
  core: {
    builder: 'storybook-builder-vite'
  },
  async viteFinal(config, { configType }) {
    return {
      ...commonConfig,
      ...config,
      resolve: {
        ...commonConfig.resolve,
        ...config.resolve,
        alias: {
          ...commonConfig.resolve.alias,
          ...config.resolve.alias,
        },
        dedupe: [
          ...(commonConfig.resolve.dedupe || []),
          ...(config.resolve.dedupe || []),
          // Workaround for: https://github.com/storybookjs/storybook/issues/10887#issuecomment-901109891
          '@storybook/client-api',
          // Workaround for MDX error because React 16&17 are both in dependency tree causing conflict.
          'react',
          'react-dom',
        ],
      },
      plugins: [...commonPlugins, ...config.plugins]
    }
  },
}
