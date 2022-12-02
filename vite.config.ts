import path from 'node:path'

import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Vue from '@vitejs/plugin-vue'
import LinkAttributes from 'markdown-it-link-attributes'
// import Shiki from 'markdown-it-shiki'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
// Cannot use this for UI libraries, or code of element-plus components will be included in the build output
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { type PluginOption, type UserConfig, defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import Inspect from 'vite-plugin-inspect'
import Pages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'
import Preview from 'vite-plugin-vue-component-preview'
import Inspector from 'vite-plugin-vue-inspector'
// import Inspector from 'vite-plugin-vue-inspector'
import Layouts from 'vite-plugin-vue-layouts'
import Markdown from 'vite-plugin-vue-markdown'
import generateSitemap from 'vite-ssg-sitemap'

// Common config for both library and Storybook
export const commonConfig: UserConfig = {
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
    // Fix issue when component libraries in the workspace are using different versions of deps like Vue
    // See: https://github.com/vuejs/core/issues/4344#issuecomment-1023220225
    dedupe: ['vue', 'vue-i18n', 'vue-router', 'element-plus'],
  },
}

// Common plugins for both library and Storybook
export function commonPlugins(command: 'build' | 'serve'): PluginOption[] {
  return (
    [
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'vue-i18n',
          'vue/macros',
          '@vueuse/head',
          '@vueuse/core',
          // auto import Element Plus functions
          // resolvers: [ElementPlusResolver()],
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
        // custom resolvers
        resolvers: [
          // auto import Element Plus components with styles
          // ElementPlusResolver(),
        ],
        dts: 'src/types/components.d.ts',
      }),

      // https://github.com/element-plus/unplugin-element-plus/
      ElementPlus(),

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
          // Temporarily disabled for error in Storybook:
          // See: https://github.com/storybookjs/storybook/issues/11587#issuecomment-1310017216
          // md.use(Shiki, {
          //   theme: {
          //     light: 'vitesse-light',
          //     dark: 'vitesse-dark',
          //   },
          // })
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
    ] as PluginOption[]
  ).concat(
    command === 'serve'
      ? ([
          // https://github.com/antfu/vite-plugin-inspect
          // Visit http://localhost:3333/__inspect/ to see the inspector
          Inspect(),

          // https://github.com/webfansplz/vite-plugin-vue-inspector
          Inspector({
            enabled: false,
          }),
        ] as PluginOption[])
      : [],
  )
}

export default defineConfig(({ command }) => ({
  ...commonConfig,

  plugins: [
    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    // Should've be put in `commonPlugins` but temporarily disabled for Storybook for error:
    //   All collection items must start at the same column
    //   [vite] Internal server error: All collection items must start at the same column
    //   Plugin: vite-plugin-vue-i18n
    //   File: locales/en.yml
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),

    ...commonPlugins(command),
  ].concat(
    command === 'serve'
      ? [
          // Disabled for building the library for not generating sourcemap
          Preview(),

          Pages({
            extensions: ['vue', 'md'],
          }),

          // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
          Layouts(),
        ]
      : [
          // https://github.com/qmhc/vite-plugin-dts
          dts({
            outputDir: 'dist/types',
            include: 'src',
            // rollupTypes: true,
            skipDiagnostics: true, // `vue-tsc` already checks types
          }),
        ],
  ),

  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head'],
    exclude: ['vue-Devi'],
  },

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      // name: 'vue-components',
      formats: [
        'es',
        // Temporary disabled for UnoCSS issues:
        //   error during build:
        //   Error: [unocss] does not found CSS placeholder in the generated chunks
        // 'cjs',
        // Not needed for now
        // 'umd',
      ],
    },
    rollupOptions: {
      external: ['vue', 'vue-i18n', 'vue-router', 'element-plus'],
      output: {
        preserveModules: true,
        preserveModulesRoot: '.',
        entryFileNames: ({ name }: { name: string }): string => {
          if (name?.includes('node_modules/') || name === '__uno.css') {
            return `[format]/vendor/${name.replace(/.*node_modules\//, '')}.js`
          }

          return `[format]/${name}.js`
        },
        // Specifies id: variableName pairs necessary for external imports in umd/iife bundles.
        // globals: {
        //   vue: 'Vue',
        //   'vue-i18n': 'VueI18n',
        //   'vue-router': 'VueRouter',
        //   'element-plus': 'ElementPlus',
        // },
        // Since we publish our ./src folder, there's no point
        // in bloating sourcemaps with another copy of it.
        sourcemapExcludeSources: true,
      },
    },
    sourcemap: true,
    // Reduce bloat from legacy polyfills.
    target: 'esnext',
    // Leave minification up to applications.
    minify: false,
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    onFinished(): void {
      generateSitemap()
    },
  },

  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: [
      'workbox-window',
      /vue-i18n/,
      // Fix `TypeError: Unknown file extension ".css" for .../element-plus/theme-chalk/el-button.css`
      // See: https://github.com/antfu/vite-ssg/issues/171#issuecomment-1212862501
      'element-plus',
    ],
  },
}))
