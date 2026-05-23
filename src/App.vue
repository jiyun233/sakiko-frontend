<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import NavBar from "@/components/sections/NavBar.vue"
import HeroSection from "@/components/sections/HeroSection.vue"
import FeaturesSection from "@/components/sections/FeaturesSection.vue"
import CommandsSection from "@/components/sections/CommandsSection.vue"
import StatsSection from "@/components/sections/StatsSection.vue"
import FooterSection from "@/components/sections/FooterSection.vue"
import ThemeToggle from "@/components/sections/ThemeToggle.vue"
import FeatureVotePage from "@/views/FeatureVotePage.vue"

function getRoute() {
  const hash = window.location.hash
  if (hash === "#/vote" || hash === "#/features") return "vote"
  return "home"
}

const route = ref(getRoute())

function onHashChange() {
  route.value = getRoute()
}

onMounted(() => window.addEventListener("hashchange", onHashChange))
onUnmounted(() => window.removeEventListener("hashchange", onHashChange))
</script>

<template>
  <template v-if="route === 'vote'">
    <NavBar />
    <FeatureVotePage />
  </template>
  <template v-else>
    <NavBar />
    <main>
      <HeroSection />
      <FeaturesSection />
      <CommandsSection />
      <StatsSection />
    </main>
    <FooterSection />

    <!-- Floating theme toggle -->
    <div class="fixed bottom-6 right-6 z-50">
      <div
        class="flex size-11 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-shadow duration-300 ease-spring hover:shadow-xl"
      >
        <ThemeToggle />
      </div>
    </div>
  </template>
</template>
