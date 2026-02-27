<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <span class="tag" data-cursor-hover>{{ text }}</span>
</template>
