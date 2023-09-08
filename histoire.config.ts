import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [
    HstVue(),
  ],
  tree: {
    file: 'path',
  },
  viteIgnorePlugins: [
    'vite-plugin-vue-component-preview',
  ],
  // setupFile: 'histoire.setup.ts',
})
