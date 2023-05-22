<script setup lang="ts">
import { ElButton } from 'element-plus'
// Temporary disabled for error: `[vite] Internal server error: At least one <template> or <script> is required in a single file component.`
// defineOptions({
//   name: 'IndexPage',
// })
const user = useUserStore()
const name = ref<string>(user.savedName)

const router = useRouter()
function go() {
  if (name.value) {
    void router.push(`/hi/${encodeURIComponent(name.value)}`)
  }
}

const { t } = useI18n()
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank">
        Vitesse
      </a>
    </p>
    <p>
      <em text-sm opacity-75>{{ t('intro.desc') }}</em>
    </p>

    <div py-4 />

    <TheInput
      v-model="name"
      :placeholder="t('intro.whats-your-name')"
      autocomplete="false"
      @keydown.enter="go"
    />
    <label class="hidden" for="input">{{ t('intro.whats-your-name') }}</label>

    <div>
      <ElButton :disabled="!name" @click="go">
        {{ t('button.go') }}
      </ElButton>
    </div>

    <Counter :initial="0" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
