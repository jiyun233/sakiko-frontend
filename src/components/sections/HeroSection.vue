<script setup lang="ts">
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, ChevronRight, ArrowDown } from "@lucide/vue"
import { onMounted, ref } from "vue"

const visible = ref(false)
onMounted(() => { visible.value = true })
</script>

<template>
  <section
    class="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-20 text-center"
  >
    <!-- Avatar -->
    <div
      class="mb-8 from-primary/20 to-primary/5 p-[1px] ring-primary/10"
      :class="visible && 'animate-scale-in'"
      :style="{ animationDelay: '0ms' }"
    >
      <img :src="siteConfig.bot.avatar" :alt="siteConfig.bot.name" class="size-50" />
    </div>

    <!-- Badges -->
    <div class="mb-6 flex flex-wrap items-center justify-center gap-2">
      <Badge
        v-for="(badge, i) in siteConfig.hero.badges"
        :key="badge"
        variant="secondary"
        :class="visible && 'animate-fade-up'"
        :style="{ animationDelay: `${100 + i * 80}ms` }"
        class="transition-all duration-300 ease-spring hover:scale-110 hover:border-primary/30"
      >
        {{ badge }}
      </Badge>
    </div>

    <!-- Title -->
    <h1
      class="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
      :class="visible && 'animate-fade-up'"
      style="animation-delay: 300ms"
    >
      <span class="bg-gradient-to-r from-primary to-[#a78bfa] bg-clip-text text-transparent">
        {{ siteConfig.bot.name }}
      </span>
    </h1>

    <!-- Tagline -->
    <p
      class="mt-4 max-w-xl text-lg text-muted-foreground"
      :class="visible && 'animate-fade-up'"
      style="animation-delay: 450ms"
    >
      {{ siteConfig.bot.tagline }}
    </p>

    <!-- Description -->
    <p
      class="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground/80"
      :class="visible && 'animate-fade-up'"
      style="animation-delay: 550ms"
    >
      {{ siteConfig.bot.description }}
    </p>

    <!-- CTAs -->
    <div
      class="mt-8 flex items-center gap-3"
      :class="visible && 'animate-fade-up'"
      style="animation-delay: 650ms"
    >
      <a :href="siteConfig.hero.cta.href" class="group">
        <Button size="lg" class="gap-2 rounded-full px-6 transition-all duration-300 ease-spring group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/25">
          <Bot class="size-4 transition-transform duration-300 ease-spring group-hover:rotate-12" />
          {{ siteConfig.hero.cta.label }}
          <ChevronRight class="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
        </Button>
      </a>
      <a :href="siteConfig.hero.secondaryCta.href">
        <Button variant="outline" size="lg" class="rounded-full px-6 transition-all duration-300 ease-spring hover:scale-105">
          {{ siteConfig.hero.secondaryCta.label }}
        </Button>
      </a>
    </div>

    <!-- Scroll hint -->
    <div class="absolute bottom-8 animate-float text-muted-foreground/40">
      <ArrowDown class="size-5" />
    </div>
  </section>
</template>
