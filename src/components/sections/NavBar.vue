<script setup lang="ts">
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Bot, Menu } from "@lucide/vue"
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

      <!-- Desktop CTA -->
      <div class="hidden sm:block">
        <a :href="siteConfig.hero.cta.href">
          <Button size="sm" class="rounded-full">
            <Bot class="size-4" />
            {{ siteConfig.hero.cta.label }}
          </Button>
        </a>
      </div>

      <!-- Mobile: Sheet drawer -->
      <Sheet v-model:open="open">
        <SheetTrigger as-child class="sm:hidden">
          <button
            class="rounded-md p-2 text-muted-foreground transition-transform duration-300 ease-spring hover:bg-accent"
            :class="{ 'rotate-90': open }" aria-label="切换菜单">
            <Menu class="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" class="w-64 sm:hidden">
          <SheetHeader class="text-left">
            <SheetTitle class="flex items-center gap-2">
              <img :src="siteConfig.bot.avatar" class="size-6" :alt="siteConfig.bot.name" />
              {{ siteConfig.bot.name }}
            </SheetTitle>
          </SheetHeader>
          <nav class="flex flex-col gap-3 mt-6 p-4">
            <a v-for="(item, i) in siteConfig.nav" :key="item.label" :href="item.href"
              :style="{ animationDelay: `${i * 80}ms` }"
              class="animate-slide-down text-sm text-muted-foreground transition-all duration-300 ease-spring hover:translate-x-1 hover:text-foreground"
              @click="open = false">
              {{ item.label }}
            </a>
            <a :href="siteConfig.hero.cta.href" class="animate-slide-down mt-2"
              :style="{ animationDelay: `${siteConfig.nav.length * 80}ms` }" @click="open = false">
              <Button size="sm" class="w-full rounded-full">
                <Bot class="size-4" />
                {{ siteConfig.hero.cta.label }}
              </Button>
            </a>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </header>
</template>
