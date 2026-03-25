<script setup lang="ts">
defineProps<{
  title: string
  value: string
  subtitle?: string
  tone?: 'default' | 'blue' | 'green' | 'amber'
}>()

const toneClasses = {
  default: 'bg-white border-gray-100 text-gray-900',
  blue: 'bg-blue-50 border-blue-100 text-blue-900',
  green: 'bg-green-50 border-green-100 text-green-900',
  amber: 'bg-amber-50 border-amber-100 text-amber-900'
}
</script>

<template>
  <article :class="['rounded-2xl border p-5 flex flex-col justify-center', toneClasses[tone || 'default']]">
    <p class="text-sm font-medium text-gray-500 mb-1 opacity-80">{{ title }}</p>
    <p class="text-2xl font-bold tracking-tight">{{ value }}</p>
    <p v-if="subtitle" class="text-xs mt-2 opacity-70">{{ subtitle }}</p>
  </article>
</template>
