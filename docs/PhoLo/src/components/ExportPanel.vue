<script setup lang="ts">
import { computed } from 'vue'
import { Copy, Download, LoaderCircle } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import type { ExportAction, ExportFormat, ExportResolution, ExportSize } from '../types'
import StyledSelect from './StyledSelect.vue'

const props = defineProps<{
  format: ExportFormat
  resolution: ExportResolution
  resolutions: ExportSize[]
  exporting: boolean
  activeAction: ExportAction | null
  disabled: boolean
}>()
const emit = defineEmits<{
  'update:format': [format: ExportFormat]
  'update:resolution': [resolution: ExportResolution]
  download: []
  copy: []
}>()
const { t } = useLocale()
const formats: ExportFormat[] = ['png', 'jpeg', 'webp', 'svg']

function resolutionName(id: ExportResolution): string {
  if (id === 'original') return t('originalSize')
  if (id === 'full-hd') return 'Full HD'
  if (id === 'small') return t('smallSize')
  return ({ 'eight-k': '8K', 'four-k': '4K', 'two-k': '2K', hd: 'HD' } as const)[id]
}

const resolutionOptions = computed(() => props.resolutions.length
  ? props.resolutions.map((size) => ({ value: size.id, label: `${resolutionName(size.id)} · ${size.width} × ${size.height}` }))
  : [{ value: 'original', label: t('originalSize') }])
</script>

<template>
  <section class="export-panel" aria-labelledby="export-panel-title">
    <header class="tool-heading"><div><Download :size="19" /><h2 id="export-panel-title">{{ t('export') }}</h2></div></header>
    <div class="format-control" role="radiogroup" :aria-label="t('format')"><button v-for="item in formats" :key="item" type="button" role="radio" :aria-checked="format === item" :class="{ selected: format === item }" @click="emit('update:format', item)">{{ t(item) }}</button></div>
    <StyledSelect class="export-resolution" :label="t('resolution')" :model-value="resolution" :options="resolutionOptions" @update:model-value="emit('update:resolution', $event as ExportResolution)" />
    <div class="export-actions">
      <button type="button" class="download-action" :disabled="disabled || exporting" @click="emit('download')"><LoaderCircle v-if="activeAction === 'download'" :size="19" class="spin" /><Download v-else :size="19" /><span>{{ activeAction === 'download' ? t('exporting') : t('download') }}</span></button>
      <button v-tooltip="t('copyImage')" type="button" class="copy-action" :aria-label="t('copyImage')" :disabled="disabled || exporting" @click="emit('copy')"><LoaderCircle v-if="activeAction === 'copy'" :size="19" class="spin" /><Copy v-else :size="19" /></button>
    </div>
  </section>
</template>
