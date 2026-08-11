<script setup lang="ts">
import { Download, LoaderCircle } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import type { ExportFormat } from '../types'

defineProps<{ format: ExportFormat; exporting: boolean; disabled: boolean }>()
const emit = defineEmits<{ 'update:format': [format: ExportFormat]; export: [] }>()
const { t } = useLocale()
const formats: ExportFormat[] = ['png', 'jpeg', 'webp', 'svg']
</script>

<template>
  <section class="export-panel" aria-labelledby="export-panel-title">
    <header class="tool-heading"><div><Download :size="19" /><h2 id="export-panel-title">{{ t('export') }}</h2></div></header>
    <div class="format-control" role="radiogroup" :aria-label="t('format')"><button v-for="item in formats" :key="item" type="button" role="radio" :aria-checked="format === item" :class="{ selected: format === item }" @click="emit('update:format', item)">{{ t(item) }}</button></div>
    <button type="button" class="download-action" :disabled="disabled || exporting" @click="emit('export')"><LoaderCircle v-if="exporting" :size="19" class="spin" /><Download v-else :size="19" /><span>{{ exporting ? t('exporting') : t('download') }}</span></button>
  </section>
</template>
