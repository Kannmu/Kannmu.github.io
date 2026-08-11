<script setup lang="ts">
import { SlidersHorizontal } from 'lucide-vue-next'
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import NumericScrubber from './NumericScrubber.vue'
import StyledSelect from './StyledSelect.vue'

const props = defineProps<{ gap: number; balance: number; targetAspect: string; iterations: number }>()
const emit = defineEmits<{
  'update:gap': [value: number]
  'update:balance': [value: number]
  'update:targetAspect': [value: string]
  'update:iterations': [value: number]
  interaction: [active: boolean]
}>()
const { t } = useLocale()
const balancePercent = computed({ get: () => Math.round(props.balance * 100), set: (value) => emit('update:balance', value / 100) })
const aspectOptions = computed(() => [
  { value: 'auto', label: t('auto') },
  { value: '1', label: t('square') },
  { value: String(4 / 3), label: '4 : 3' },
  { value: '1.5', label: '3 : 2' },
  { value: String(16 / 9), label: '16 : 9' },
  { value: String(7 / 3), label: t('cinema') },
])
</script>

<template>
  <section class="control-panel" aria-labelledby="control-panel-title">
    <header class="tool-heading"><div><SlidersHorizontal :size="19" /><h2 id="control-panel-title">{{ t('adjust') }}</h2></div></header>
    <div class="control-fields">
      <NumericScrubber :model-value="gap" :label="t('separation')" :min="8" :max="80" :step="1" unit="px" @update:model-value="emit('update:gap', $event)" @interaction="emit('interaction', $event)" />
      <NumericScrubber v-model="balancePercent" :label="t('balance')" :min="0" :max="100" :step="1" unit="%" @interaction="emit('interaction', $event)" />
      <StyledSelect :label="t('ratio')" :model-value="targetAspect" :options="aspectOptions" @update:model-value="emit('update:targetAspect', $event)" />
      <details class="advanced-control"><summary>{{ t('budget') }}<span>{{ iterations.toLocaleString() }}</span></summary><input type="range" :value="iterations" min="1200" max="18000" step="400" :aria-label="t('budget')" @input="emit('update:iterations', Number(($event.target as HTMLInputElement).value))" /></details>
    </div>
  </section>
</template>
