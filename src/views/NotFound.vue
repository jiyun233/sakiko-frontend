<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <h1 class="text-6xl font-bold text-muted-foreground">404</h1>
    <p class="text-lg text-muted-foreground">页面不存在</p>
    <button
      class="mt-4 rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
      @click="router.push('/')"
    >
      返回首页
    </button>
  </div>
</template>
