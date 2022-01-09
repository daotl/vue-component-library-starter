<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <main class="px-4 py-10 text-center text-teal-700 dark:text-gray-200">
    <div>
      <p class="text-4xl">
        <i-carbon-warning class="inline-block" />
      </p>
    </div>
    <router-view />
    <div>
      <el-button @click="router.back()">
        {{ t('button.back') }}
      </el-button>
    </div>
  </main>
</template>
