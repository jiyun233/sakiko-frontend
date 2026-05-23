<script setup lang="ts">
import { useTheme } from "@/composables/useTheme"
import { Sun, Moon } from "@lucide/vue"

const { theme, toggle } = useTheme()

const icon = {
  light: Sun,
  dark: Moon
} as const

const label = {
  light: "亮色模式",
  dark: "暗色模式",
} as const
</script>

<template>
  <button
    class="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-all duration-300 ease-spring hover:bg-accent hover:text-foreground hover:scale-110"
    :title="label[theme]" aria-label="切换主题" @click="toggle()">
    <Transition enter-active-class="transition-all duration-300 ease-spring"
      enter-from-class="opacity-0 scale-50 -translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-50 translate-y-2" mode="out-in">
      <component :is="icon[theme]" :key="theme" class="size-[18px]" />
    </Transition>
  </button>
</template>
