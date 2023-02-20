<script setup lang="ts">
// Temporary disabled for error: `[vite] Internal server error: At least one <template> or <script> is required in a single file component.`
// const { modelValue } = defineModel<{
//   modelValue: string
// }>()
defineProps<{
  modelValue: string
}>()
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    id="input"
    :value="modelValue"
    type="text"
    v-bind="$attrs"
    p="x-4 y-2"
    w="250px"
    text="center"
    bg="transparent"
    border="~ rounded gray-200 dark:gray-700"
    outline="none active:none"
  >
</template>
