<script setup lang="ts">
import { siteConfig } from "@/config/site"
</script>

<template>
  <footer class="border-t border-border bg-muted/30 px-4 py-10 sm:px-6 lg:px-8">
    <div
      class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row"
    >
      <p>© {{ new Date().getFullYear() }} {{ siteConfig.footer.copyright }}</p>
      <nav class="flex items-center gap-6">
        <a
          v-for="link in siteConfig.footer.links"
          :key="link.label"
          :href="link.href"
          class="transition-colors hover:text-foreground"
        >
          {{ link.label }}
        </a>
      </nav>
    </div>
  </footer>
</template>
