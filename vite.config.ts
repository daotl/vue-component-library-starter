import Vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-dts'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'

import { commonConfig, commonPlugins } from './vite.common'

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export default defineConfig({
  ...commonConfig,

  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Pages({
      extensions: ['vue', 'md'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/alloc/vite-dts
    dts(),

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...commonPlugins,
  ],

  server: {
    fs: {
      strict: true,
    },
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },

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
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'vue-components',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        // Specifies id: variableName pairs necessary for external imports in umd/iife bundles.
        globals: {
          vue: 'Vue',
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
  },
})
