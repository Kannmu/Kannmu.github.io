<script setup>
defineProps({
  index: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <header class="section-head" v-reveal>
    <span class="index">{{ index }}</span>
    <h2>{{ title }}</h2>
  </header>
</template>
