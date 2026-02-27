<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  href: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const el = ref(null)
const pointerFine = window.matchMedia('(pointer: fine)').matches

const onMove = (event) => {
  const rect = el.value.getBoundingClientRect()
  const x = event.clientX - rect.left - rect.width / 2
  const y = event.clientY - rect.top - rect.height / 2
  el.value.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`
}

const onLeave = () => {
  if (el.value) el.value.style.transform = 'translate(0, 0)'
}

onMounted(() => {
  if (!pointerFine || !el.value) return
  el.value.addEventListener('mousemove', onMove)
  el.value.addEventListener('mouseleave', onLeave)
})

onUnmounted(() => {
  if (!pointerFine || !el.value) return
  el.value.removeEventListener('mousemove', onMove)
  el.value.removeEventListener('mouseleave', onLeave)
})
</script>

<template>
  <a
    ref="el"
    class="contact-btn"
    :href="props.href"
    :target="props.href.startsWith('http') ? '_blank' : undefined"
    :rel="props.href.startsWith('http') ? 'noopener noreferrer' : undefined"
    data-cursor-hover
  >
    {{ props.label }}
  </a>
</template>
