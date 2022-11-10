import path from 'node:path'

import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import Pages from 'vite-plugin-pages'
import Preview from 'vite-plugin-vue-component-preview'
// import Inspector from 'vite-plugin-vue-inspector'
import Layouts from 'vite-plugin-vue-layouts'
import generateSitemap from 'vite-ssg-sitemap'

import { commonConfig, commonPlugins } from './vite.common'

export default defineConfig({
  ...commonConfig,

  plugins: [
    Preview(),

    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),

    Pages({
      extensions: ['vue', 'md'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/qmhc/vite-plugin-dts
    dts({
      outputDir: 'dist/types',
      include: 'src',
      // rollupTypes: true,
    }),

    ...commonPlugins,
  ],

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
      name: 'vue-components',
    },
    rollupOptions: {
      external: ['vue', 'vue-i18n', 'vue-router'],
      output: {
        // Specifies id: variableName pairs necessary for external imports in umd/iife bundles.
        globals: {
          vue: 'Vue',
          'vue-i18n': 'VueI18n',
          'vue-router': 'VueRouter',
        },
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
    cssCodeSplit: true,
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    onFinished() {
      generateSitemap()
    },
  },

  ssr: {
    // TODO: workaround until they support native ESM
    noExternal: ['workbox-window', /vue-i18n/],
  },
})
