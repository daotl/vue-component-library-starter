<script setup>
import { ref } from 'vue'
import { logEvent } from 'histoire/client'
import BaseButton from './BaseButton.vue'

const text = ref('Click me')
const state = ref({
  disabled: false,
  content: 'Hello world',
})
</script>

<template>
  <Story>
    <BaseButton @click="logEvent('click', $event)">
      {{ text }}
    </BaseButton>

    <template #controls>
      <HstText v-model="text" title="default slot" />
    </template>
    <!-- <template #controls>
        Content: <input type="text" v-model="state.content" />
        Disabled: <input type="checkbox" v-model="state.disabled" />
    </template> -->
  </Story>
</template>
