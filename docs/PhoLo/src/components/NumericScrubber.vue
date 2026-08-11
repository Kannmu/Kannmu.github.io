<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useLocale } from '../composables/useLocale'

const props = withDefaults(defineProps<{
  label: string
  modelValue: number
  min: number
  max: number
  step: number
  unit?: string
  precision?: number
}>(), { unit: '', precision: 0 })
const emit = defineEmits<{ 'update:modelValue': [value: number]; interaction: [active: boolean] }>()
const { t } = useLocale()
const editing = ref(false)
const input = ref<HTMLInputElement | null>(null)
let startX = 0
let startValue = 0
let moved = false

function clamp(value: number): number {
  const rounded = Number(value.toFixed(Math.max(0, props.precision)))
  return Math.max(props.min, Math.min(props.max, rounded))
}

function setValue(value: number): void { emit('update:modelValue', clamp(value)) }

function beginEdit(): void {
  editing.value = true
  void nextTick(() => { input.value?.focus(); input.value?.select() })
}

function commitEdit(event: Event): void {
  const value = Number((event.target as HTMLInputElement).value)
  if (Number.isFinite(value)) setValue(value)
  editing.value = false
  emit('interaction', false)
}

function onPointerDown(event: PointerEvent): void {
  if (event.pointerType !== 'mouse') return
  startX = event.clientX
  startValue = props.modelValue
  moved = false
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  emit('interaction', true)
}

function onPointerMove(event: PointerEvent): void {
  if (!(event.currentTarget as HTMLElement).hasPointerCapture(event.pointerId)) return
  const distance = event.clientX - startX
  if (Math.abs(distance) > 3) moved = true
  const multiplier = event.shiftKey ? 8 : 1
  setValue(startValue + Math.round(distance / 3) * props.step * multiplier)
}

function onPointerUp(event: PointerEvent): void {
  const target = event.currentTarget as HTMLElement
  if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId)
  emit('interaction', false)
  if (!moved) beginEdit()
}

function onKeydown(event: KeyboardEvent): void {
  const multiplier = event.shiftKey ? 8 : 1
  if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
    event.preventDefault(); setValue(props.modelValue + props.step * multiplier)
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
    event.preventDefault(); setValue(props.modelValue - props.step * multiplier)
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); beginEdit()
  }
}
</script>

<template>
  <div class="scrubber">
    <span class="scrubber-label">{{ label }}</span>
    <div class="scrubber-desktop">
      <input v-if="editing" ref="input" class="scrubber-input" type="number" :value="modelValue" :min="min" :max="max" :step="step" :aria-label="`${t('editValue')}: ${label}`" @blur="commitEdit" @keydown.enter="commitEdit" @keydown.escape="editing = false" />
      <button v-else v-tooltip="t('dragValue')" type="button" class="scrubber-value" :aria-label="`${label}: ${modelValue}${unit}`" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp" @keydown="onKeydown">
        <strong>{{ modelValue.toFixed(precision) }}</strong><small>{{ unit }}</small>
      </button>
    </div>
    <div class="scrubber-mobile">
      <strong>{{ modelValue.toFixed(precision) }}{{ unit }}</strong>
      <input type="range" :value="modelValue" :min="min" :max="max" :step="step" :aria-label="label" @input="setValue(Number(($event.target as HTMLInputElement).value))" @pointerdown="emit('interaction', true)" @pointerup="emit('interaction', false)" />
    </div>
  </div>
</template>
