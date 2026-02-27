<script setup>
import SectionHeader from '../ui/SectionHeader.vue'
import { education, professional } from '../../data/portfolio'
</script>

<template>
  <section class="section-block" id="experience">
    <SectionHeader index="02" title="Experience & Education" />

    <div class="columns">
      <div class="timeline-wrap" v-reveal>
        <h3>Education</h3>
        <article class="timeline-item" v-for="item in education" :key="item.title" data-cursor-hover>
          <p class="date">{{ item.date }}</p>
          <h4>{{ item.title }}</h4>
          <h5>{{ item.org }}</h5>
          <p>{{ item.text }}</p>
        </article>
      </div>

      <div class="timeline-wrap" v-reveal="100">
        <h3>Professional</h3>
        <article class="timeline-item" v-for="item in professional" :key="item.title" data-cursor-hover>
          <p class="date">{{ item.date }}</p>
          <h4>{{ item.title }}</h4>
          <h5>{{ item.org }}</h5>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
