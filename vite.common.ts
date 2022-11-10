// This is the common config and plugins for main Vite and Storybook's Vite to import.
// Since Storybook is using CommonJS format, we also have to.

import path from 'node:path'

import VueI18n from '@intlify/vite-plugin-vue-i18n'
import LinkAttributes from 'markdown-it-link-attributes'
import Shiki from 'markdown-it-shiki'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import type { PluginOption, UserConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import { VitePWA } from 'vite-plugin-pwa'
import Inspector from 'vite-plugin-vue-inspector'
import Markdown from 'vite-plugin-vue-markdown'

export const commonConfig: UserConfig = {
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
}

export const commonPlugins = [
  // https://github.com/antfu/unplugin-auto-import
  AutoImport({
    imports: [
      'vue',
      'vue-router',
      'vue-i18n',
      'vue/macros',
      '@vueuse/head',
      '@vueuse/core',
    ],
    dts: 'src/types/auto-imports.d.ts',
    dirs: ['src/composables', 'src/store'],
    vueTemplate: true,
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

  // https://github.com/antfu/vite-plugin-vue-markdown
  // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
  Markdown({
    wrapperClasses: 'prose prose-sm m-auto text-left',
    headEnabled: true,
    markdownItSetup(md) {
      // https://prismjs.com/
      md.use(Shiki, {
        theme: {
          light: 'vitesse-light',
          dark: 'vitesse-dark',
        },
      })
      md.use(LinkAttributes, {
        matcher: (link: string) => /^https?:\/\//.test(link),
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
    includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
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

  // https://github.com/webfansplz/vite-plugin-vue-inspector
  Inspector({
    enabled: false,
  }),
] as PluginOption[]
