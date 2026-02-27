<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const realtimeCursor = ref(null)
const smoothCursor = ref(null)
const pointerFine = window.matchMedia('(pointer: fine)').matches

let frame = 0
let rawX = window.innerWidth / 2
let rawY = window.innerHeight / 2
let smoothX = rawX
let smoothY = rawY

const setHover = (event) => {
  const target = event.target.closest('[data-cursor-hover]')
  const method = target ? 'add' : 'remove'
  realtimeCursor.value?.classList[method]('hover')
  smoothCursor.value?.classList[method]('hover')
}

const renderRealtime = () => {
  if (realtimeCursor.value) {
    realtimeCursor.value.style.transform = `translate(${rawX}px, ${rawY}px) translate(-50%, -50%)`
  }
}

const onMove = (event) => {
  rawX = event.clientX
  rawY = event.clientY
  renderRealtime()
}

const animate = () => {
  smoothX += (rawX - smoothX) * 0.28
  smoothY += (rawY - smoothY) * 0.28

  if (Math.abs(rawX - smoothX) < 0.2) smoothX = rawX
  if (Math.abs(rawY - smoothY) < 0.2) smoothY = rawY

  if (smoothCursor.value) {
    smoothCursor.value.style.transform = `translate(${smoothX}px, ${smoothY}px) translate(-50%, -50%)`
  }

  frame = requestAnimationFrame(animate)
}

onMounted(() => {
  if (!pointerFine) return
  document.body.classList.add('cursor-enabled')
  renderRealtime()
  window.addEventListener('pointermove', onMove)
  document.addEventListener('pointerover', setHover)
  frame = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (!pointerFine) return
  document.body.classList.remove('cursor-enabled')
  window.removeEventListener('pointermove', onMove)
  document.removeEventListener('pointerover', setHover)
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <template v-if="pointerFine">
    <div ref="realtimeCursor" class="cursor cursor-realtime" aria-hidden="true"></div>
    <div ref="smoothCursor" class="cursor cursor-smooth" aria-hidden="true"></div>
  </template>
</template>
