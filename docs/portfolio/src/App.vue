<script setup>
import BackgroundNoise from './components/layout/BackgroundNoise.vue'
import CustomCursor from './components/layout/CustomCursor.vue'
import HeroSection from './components/sections/HeroSection.vue'
import ResearchSection from './components/sections/ResearchSection.vue'
import ExperienceSection from './components/sections/ExperienceSection.vue'
import PublicationsSection from './components/sections/PublicationsSection.vue'
import FooterSection from './components/sections/FooterSection.vue'
</script>

<template>
  <BackgroundNoise />
  <CustomCursor />

  <main class="shell">
    <HeroSection />
    <ResearchSection />
    <ExperienceSection />
    <PublicationsSection />
    <FooterSection />
  </main>
</template>
