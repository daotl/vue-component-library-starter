import path from 'node:path'

import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import Vue from '@vitejs/plugin-vue'
import LinkAttributes from 'markdown-it-link-attributes'
// import Shiki from 'markdown-it-shikiji'
import Unocss from 'unocss/vite'
// g pug push
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
// Temporary disabled for error: `[vite] Internal server error: At least one <template> or <script> is required in a single file component.`
// import VueMacros from 'unplugin-vue-macros'
import {
  defineConfig,
  type PluginOption,
  type UserConfig,
} from 'vite'
import dts from 'vite-plugin-dts'
import Inspect from 'vite-plugin-inspect'
import { VitePWA } from 'vite-plugin-pwa'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'
import WebfontDownload from 'vite-plugin-webfont-dl'
import generateSitemap from 'vite-ssg-sitemap'

// Common config for both library and Storybook
export const commonConfig: UserConfig = {
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
    // Fix issue when component libraries in the workspace are using different versions of deps like Vue
    // See: https://github.com/vuejs/core/issues/4344#issuecomment-1023220225
    dedupe: ['vue', 'vue-i18n', 'vue-router'],
  },
}

// Common plugins for both library and Storybook
export function commonPlugins(command: 'build' | 'serve'): PluginOption[] {
  return (
    [
      // VueMacros({
      //   plugins: {
      //     vue: Vue({
      //       include: [/\.vue$/, /\.md$/],
      //       reactivityTransform: true,
      //     }),
      //   },
      // }),

      // https://github.com/posva/unplugin-vue-router
      VueRouter({
        extensions: ['.vue', '.md'],
        exclude: ['**/components/*'],
        dts: 'src/types/typed-router.d.ts',
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          'vue/macros',
          '@vueuse/head',
          '@vueuse/core',
          VueRouterAutoImports,
          {
            // add any other imports you were relying on
            'vue-router/auto': ['useLink'],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
        dirs: ['src/composables', 'src/stores'],
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
      // see uno.config.ts for config
      Unocss(),

      // https://github.com/unplugin/unplugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: 'prose prose-sm m-auto text-left',
        headEnabled: true,
        markdownItSetup(md) {
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })
          // Temporarily disabled for error in Storybook:
          //   ./node_modules/.pnpm/markdown-it-shikiji@0.6.10/node_modules/markdown-it-shikiji/dist/index.mjs:1
          //   import { getHighlighter, bundledLanguages } from 'shikiji';
          //   ^^^^^^
          //   SyntaxError: Cannot use import statement outside a module
          // md.use(await Shiki({
          //   defaultColor: false,
          //   themes: {
          //     light: 'vitesse-light',
          //     dark: 'vitesse-dark',
          //   },
          // }))
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
        ] as PluginOption[])
      : [],
  )
}

// https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
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
      fullInstall: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),
    // https://github.com/feat-agency/vite-plugin-webfont-dl
    WebfontDownload(),
    ...commonPlugins(command),
  ].concat(
    command === 'serve'
      ? [
          // https://github.com/webfansplz/vite-plugin-vue-devtools
          VueDevTools(),

          // Disabled for building the library for not generating sourcemap
          // (Preview as unknown as { default: () => Plugin }).default(),
          VueRouter({
            extensions: ['.vue'],
            exclude: ['**/components/*'],
            dts: 'src/types/typed-router.d.ts',
          }),

          // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
          Layouts(),
        ]
      : [
          // https://github.com/qmhc/vite-plugin-dts
          dts({
            // TODO: Vite should use `tsconfig.build.json` as well when it supports configuring
            // See: https://github.com/vitejs/vite/discussions/8483
            tsconfigPath: 'tsconfig.build.json',
            outDir: 'dist/types',
            include: 'src',
          // rollupTypes: true,
          }),
        ],
  ),

  optimizeDeps: {
    include: ['vue', 'vue-i18n', 'vue-router', '@vueuse/core', '@vueuse/head'],
    exclude: ['vue-Devi'],
  },

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
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
        'cjs',
        // Not needed for now
        // 'umd',
      ],
    },
    rollupOptions: {
      external: ['vue', 'vue-i18n', 'vue-router'],
      output: {
        manualChunks(id): string | void {
          if (id.includes('node_modules')) {
            return 'vendor'
          }

          // Vite internal / virtual modules / plugins
          if (
            /___?vite/.test(id)
            || id.startsWith('virtual:')
            || id.includes('plugin-vue:')
            || id === '/__uno.css'
          ) {
            return 'index'
          }

          // Put Vue SFC `<script>` tag and the corresponding component in one chunk
          // Reference: https://github.com/vitejs/vite/issues/9213#issuecomment-1200248524
          if (id.includes('?vue&type=')) {
            id = id.split('?')[0] ?? id
          }

          return `${path.relative(__dirname, id)}`
        },

        // `preserveModules` results in modules in `node_modules` also being splitted
        // preserveModules: true,
        // preserveModulesRoot: '.',
        // entryFileNames: ({ name }: PreRenderedChunk): string => {
        //   if (name?.includes('node_modules/') || name === '__uno.css') {
        //     return `[format]/vendor/${name.replace(/.*node_modules\//, '')}.js`
        //   }

        //   return `[format]/${name}.js`
        // },

        // Specifies id: variableName pairs necessary for external imports in umd/iife bundles.
        // globals: {
        //   vue: 'Vue',
        //   'vue-i18n': 'VueI18n',
        //   'vue-router': 'VueRouter',
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
    crittersOptions: {
      reduceInlineStyles: false,
    },
    onFinished() {
      generateSitemap()
    },
  },

  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ['workbox-window', /vue-i18n/],
  },
}))
