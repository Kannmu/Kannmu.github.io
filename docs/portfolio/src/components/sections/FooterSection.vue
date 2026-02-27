<script setup>
import MagneticButton from '../ui/MagneticButton.vue'
import { contacts } from '../../data/portfolio'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="section-block footer" v-reveal>
    <div class="contact-list">
      <MagneticButton v-for="item in contacts" :key="item.label" :href="item.href" :label="item.label" />
    </div>
    <p>© {{ year }} Lin-Han Fan (Kannmu). All rights reserved.</p>
  </footer>
</template>
