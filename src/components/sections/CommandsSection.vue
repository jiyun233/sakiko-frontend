<script setup lang="ts">
import { siteConfig } from "@/config/site"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Terminal } from "@lucide/vue"
</script>

<template>
  <section id="commands" class="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
          {{ siteConfig.commands.title }}
        </h2>
        <p class="mt-3 text-muted-foreground">
          {{ siteConfig.commands.subtitle }}
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="cmd in siteConfig.commands.items"
          :key="cmd.name"
          class="group border-border/50 transition duration-500 ease-spring-gentle hover:-translate-y-1.5 hover:shadow-lg hover:border-primary/20"
        >
          <CardHeader>
            <div
              class="mb-2 flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-[transform,background-color,color] duration-500 ease-spring-gentle group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary"
            >
              <Terminal class="size-5 transition-transform duration-500 ease-spring-gentle group-hover:rotate-3" />
            </div>
            <CardTitle class="font-mono text-base transition-colors duration-300 group-hover:text-primary">
              {{ cmd.name }}
            </CardTitle>
            <CardDescription>{{ cmd.description }}</CardDescription>
          </CardHeader>
          <CardContent>
            <code
              class="block rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary/5"
            >
              {{ cmd.usage }}
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
