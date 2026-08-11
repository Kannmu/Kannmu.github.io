<script setup lang="ts">
import { Activity, X } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import type { LayoutResult } from '../types'

defineProps<{ open: boolean; result: LayoutResult | null; elapsed: number; evaluations: number }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useLocale()
</script>

<template>
  <Transition name="inspector">
    <aside v-if="open && result" class="inspector-panel" aria-labelledby="inspector-title">
      <header class="tool-heading"><div><Activity :size="19" /><h2 id="inspector-title">{{ t('inspector') }}</h2></div><button v-tooltip="t('close')" type="button" class="icon-action" :aria-label="t('close')" @click="emit('close')"><X :size="19" /></button></header>
      <dl class="metric-list">
        <div><dt>{{ t('uniformity') }}</dt><dd>{{ result.metrics.uniformity.toFixed(1) }}%</dd></div>
        <div><dt>{{ t('sizeSpread') }}</dt><dd>×{{ result.metrics.sizeSpread.toFixed(2) }}</dd></div>
        <div><dt>{{ t('fill') }}</dt><dd>{{ Math.round(result.metrics.fill * 100) }}%</dd></div>
        <div><dt>{{ t('aspectDrift') }}</dt><dd>{{ (result.metrics.aspectError * 100).toFixed(1) }}%</dd></div>
        <div><dt>{{ t('elapsed') }}</dt><dd>{{ (elapsed / 1000).toFixed(2) }}s</dd></div>
        <div><dt>{{ t('evaluations') }}</dt><dd>{{ evaluations.toLocaleString() }}</dd></div>
      </dl>
    </aside>
  </Transition>
</template>
