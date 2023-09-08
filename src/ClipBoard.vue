<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { /* Component, */ FunctionalComponent /* , VNode */ } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

const props = withDefaults(
  defineProps<{
    /**
     * 要复制的文本
     */
    source: string
    /**
     * 复制成功之后的文案（空字符串时不弹窗）
     */
    copySuccess?: string
    /**
     * 复制失败之后的文案（空字符串时不弹窗）
     */
    copyError?: string
    /**
     * 触发的元素
     */
    trigger?: /* Component | VNode | */ ReturnType<FunctionalComponent>
  }>(),
  {
    trigger: h(Icon, { icon: 'clarity:copy-to-clipboard-line' }),
    copySuccess: '复制成功',
    copyError: '浏览器不支持自动复制',
  }
)
const emit = defineEmits<{
  (e: 'onSuccess'): void
  (e: 'onError'): void
}>()

const { copy, copied, isSupported } = useClipboard({
  source: props.source,
})

const handleClipboard = async (): Promise<void> => {
  if (!isSupported) {
    ElNotification.error(props.copyError)
    return
  }

  if (!copied) {
    return
  }

  try {
    await copy(props.source)
    emit('onSuccess')
    props.copySuccess && ElMessage.success(props.copySuccess)
  }
  catch {
    emit('onError')
    props.copyError && ElNotification.error(props.copyError)
  }
}
</script>

<template>
  <Component :is="props.trigger" class="clipboard-trigger" @click="handleClipboard" />
</template>
