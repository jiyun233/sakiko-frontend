<script setup lang="ts">
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Bot, Menu, X } from "@lucide/vue"
import { ref } from "vue"

const open = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <a href="#" class="flex items-center gap-2 font-semibold">
        <div class="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <img :src="siteConfig.bot.avatar" class="size-5" :alt="siteConfig.bot.name" />
        </div>
        <span>{{ siteConfig.bot.name }}</span>
      </a>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-6 sm:flex">
        <a v-for="item in siteConfig.nav" :key="item.label" :href="item.href"
          class="text-sm text-muted-foreground transition-colors hover:text-foreground">
          {{ item.label }}
        </a>
      </nav>

      <div class="hidden sm:block">
        <a :href="siteConfig.hero.cta.href">
          <Button size="sm" class="rounded-full">
            <Bot class="size-4" />
            {{ siteConfig.hero.cta.label }}
          </Button>
        </a>
      </div>

      <!-- Mobile menu button -->
      <button
        class="rounded-md p-2 text-muted-foreground transition-transform duration-300 ease-spring hover:bg-accent sm:hidden"
        :class="{ 'rotate-90': open }" @click="open = !open" aria-label="切换菜单">
        <Menu v-if="!open" class="size-5" />
        <X v-else class="size-5" />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition enter-active-class="transition-[max-height,opacity] duration-500 ease-out-expo"
      enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-80 opacity-100"
      leave-active-class="transition-[max-height,opacity] duration-300 ease-in" leave-from-class="max-h-80 opacity-100"
      leave-to-class="max-h-0 opacity-0">
      <div v-if="open" class="overflow-hidden border-t border-border bg-background sm:hidden">
        <nav class="flex flex-col gap-2 px-4 py-4">
          <a v-for="(item, i) in siteConfig.nav" :key="item.label" :href="item.href"
            :style="{ transitionDelay: `${i * 60}ms`, animationDelay: `${i * 60}ms` }"
            class="animate-slide-down text-sm text-muted-foreground transition-all duration-300 ease-spring hover:translate-x-1 hover:text-foreground"
            @click="open = false">
            {{ item.label }}
          </a>
          <a :href="siteConfig.hero.cta.href"
            :style="{ transitionDelay: `${siteConfig.nav.length * 60}ms`, animationDelay: `${siteConfig.nav.length * 60}ms` }"
            class="animate-slide-down" @click="open = false">
            <Button size="sm" class="mt-1 w-full rounded-full">
              <Bot class="size-4" />
              {{ siteConfig.hero.cta.label }}
            </Button>
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>
