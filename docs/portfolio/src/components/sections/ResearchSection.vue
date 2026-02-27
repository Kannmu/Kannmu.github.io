<script setup>
import SectionHeader from '../ui/SectionHeader.vue'
import { interests } from '../../data/portfolio'
</script>

<template>
  <section class="section-block" id="research">
    <SectionHeader index="01" title="Research Focus" />

    <div class="interest-grid">
      <article
        class="interest-card"
        v-for="(item, idx) in interests"
        :key="item.title"
        v-reveal="80 * (idx + 1)"
        data-cursor-hover
      >
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>
  </section>
</template>
