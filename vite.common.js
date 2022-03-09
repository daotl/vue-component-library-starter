/* eslint-disable  */
// This is the common config and plugins for main Vite and Storybook's Vite to import.
// Since Storybook is using CommonJS format, we also have to.

const path = require('path')

const VueI18n = require('@intlify/vite-plugin-vue-i18n').default
const LinkAttributes = require('markdown-it-link-attributes')
const Prism = require('markdown-it-prism')
const AutoImport = require('unplugin-auto-import/vite')
const Components = require('unplugin-vue-components/vite')
const Unocss = require('unocss/vite').default
const Inspect = require('vite-plugin-inspect')
const Markdown = require('vite-plugin-md').default
const { VitePWA } = require('vite-plugin-pwa')

const markdownWrapperClasses = 'prose prose-sm m-auto text-left'

exports.commonConfig = {
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
}

exports.commonPlugins = [
  // https://github.com/antfu/unplugin-auto-import
  AutoImport({
    imports: [
      'vue',
      'vue-router',
      'vue-i18n',
      '@vueuse/head',
      '@vueuse/core',
    ],
    dts: 'src/types/auto-imports.d.ts',
  }),

  // https://github.com/antfu/unplugin-vue-components
  Components({
    // allow auto load markdown components under `./src/components/`
    extensions: ['vue', 'md'],
    // allow auto import and register components used in markdown
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    dts: 'src/types/components.d.ts',
  }),

  // https://github.com/unocss/unocss
  // see unocss.config.ts for config
  Unocss(),

  // https://github.com/antfu/vite-plugin-md
  // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
  Markdown({
    wrapperClasses: markdownWrapperClasses,
    headEnabled: true,
    markdownItSetup(md) {
      // https://prismjs.com/
      // @ts-expect-error types mismatch
      md.use(Prism)
      // @ts-expect-error types mismatch
      md.use(LinkAttributes, {
        matcher: (link) => /^https?:\/\//.test(link),
        attrs: {
          target: '_blank',
          rel: 'noopener',
        },
      })
    },
  }),

  // https://github.com/antfu/vite-plugin-pwa
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt', 'safari-pinned-tab.svg'],
    manifest: {
      name: 'Vitesse',
      short_name: 'Vitesse',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  }),

  // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
  VueI18n({
    runtimeOnly: true,
    compositionOnly: true,
    include: [path.resolve(__dirname, 'locales/**')],
  }),

  // https://github.com/antfu/vite-plugin-inspect
  // Visit http://localhost:3333/__inspect/ to see the inspector
  Inspect(),
]