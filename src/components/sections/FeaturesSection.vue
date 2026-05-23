<script setup lang="ts">
import { siteConfig } from "@/config/site"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
</script>

<template>
  <section id="features" class="px-4 py-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
          {{ siteConfig.features.title }}
        </h2>
        <p class="mt-3 text-muted-foreground">
          {{ siteConfig.features.subtitle }}
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="feature in siteConfig.features.items"
          :key="feature.title"
          class="group border-border/50 transition duration-500 ease-spring-gentle hover:-translate-y-1.5 hover:shadow-lg hover:border-primary/20"
        >
          <CardHeader>
            <div
              class="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-[transform,background-color,color,box-shadow] duration-500 ease-spring-gentle group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20"
            >
              <component :is="feature.icon" class="size-5 transition-transform duration-500 ease-spring-gentle group-hover:rotate-6" />
            </div>
            <CardTitle class="transition-colors duration-300 group-hover:text-primary">
              {{ feature.title }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription class="text-sm leading-relaxed">
              {{ feature.description }}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
