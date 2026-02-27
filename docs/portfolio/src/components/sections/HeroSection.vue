<script setup>
import { heroMeta, stats } from '../../data/portfolio'
</script>

<template>
  <section class="hero section-block">
    <p class="meta" v-reveal>
      <span v-for="item in heroMeta" :key="item">{{ item }}</span>
    </p>

    <h1 v-reveal="80">Lin-Han Fan</h1>

    <p class="intro" v-reveal="140">
      Ph.D. Student and Scientific Consultant.
      <br />
      Researching the intersection of interaction design, high-fidelity haptics, and neural interfaces.
    </p>

    <div class="stats" v-reveal="200">
      <article class="stat" v-for="item in stats" :key="item.label" data-cursor-hover>
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </article>
    </div>
  </section>
</template>
