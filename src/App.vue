<script setup lang="ts">
import { useRoute } from "vue-router"
import NavBar from "@/components/sections/NavBar.vue"
import FooterSection from "@/components/sections/FooterSection.vue"
import ThemeToggle from "@/components/element/ThemeToggle.vue"

const route = useRoute()
</script>

<template>
  <!-- Floating theme toggle -->
  <div class="fixed bottom-6 right-6 z-50">
    <div
      class="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-shadow duration-300 ease-spring hover:shadow-xl">
      <ThemeToggle />
    </div>
  </div>

  <NavBar />
  <RouterView />
  <FooterSection v-if="route.name === 'home'" />
</template>
