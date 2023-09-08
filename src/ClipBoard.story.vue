<script setup>
import { ref } from 'vue'
import ClipBoard from './ClipBoard.vue'

const state = ref({
  source: '文本',
  copySuccess: '复制成功',
  copyError: '复制失败',
})
</script>

<template>
  <Story>
    <ClipBoard :source="state.source" :copy-success="state.copySuccess" :copy-error="state.copyError" />
    <template #controls>
      <HstText v-model="state.source" title="source" />
      <HstText v-model="state.copySuccess" title="copySuccess" />
      <HstText v-model="state.copyError" title="copyError" />
    </template>
  </Story>
</template>

<docs lang="md">
  # My documentation
  Checkout this [cool video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)!
</docs>
