<script setup lang="ts">
import { siteConfig } from "@/config/site"
import { Server, Users, MessageCircle, Activity } from "@lucide/vue"

const stats = [
  {
    icon: Server,
    value: siteConfig.stats.servers.toLocaleString(),
    label: "服务群组",
  },
  {
    icon: Users,
    value: siteConfig.stats.users.toLocaleString(),
    label: "服务用户",
  },
  {
    icon: MessageCircle,
    value: (siteConfig.stats.messages / 10000).toFixed(0) + "万",
    label: "消息处理",
  },
  {
    icon: Activity,
    value: siteConfig.stats.uptime,
    label: "运行稳定性",
  },
]
</script>

<template>
  <section class="px-4 py-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          :style="{ transitionDelay: `${i * 100}ms` }"
          class="group flex flex-col items-center gap-2 text-center"
        >
          <div
            class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 ease-spring group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/15"
          >
            <component :is="stat.icon" class="size-6 transition-transform duration-500 ease-spring group-hover:-translate-y-0.5" />
          </div>
          <div
            class="text-2xl font-bold tracking-tight transition-all duration-500 ease-spring group-hover:scale-110 group-hover:text-primary"
          >
            {{ stat.value }}
          </div>
          <div class="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
