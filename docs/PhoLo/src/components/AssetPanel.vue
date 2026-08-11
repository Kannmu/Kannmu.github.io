<script setup lang="ts">
import { Check, ImagePlus, Sparkles, Trash2, X } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import type { AssetImage, LibraryMode } from '../types'

defineProps<{ assets: AssetImage[]; mode: LibraryMode; decoding: boolean }>()
const emit = defineEmits<{ choose: []; demo: []; clear: []; remove: [id: string]; toggle: [id: string] }>()
const { t } = useLocale()
</script>

<template>
  <section class="asset-panel" aria-labelledby="asset-panel-title">
    <header class="tool-heading">
      <div><h2 id="asset-panel-title">{{ t('assets') }}</h2><span v-if="assets.length">{{ assets.length }}</span></div>
      <div class="tool-actions">
        <button v-if="mode === 'empty'" v-tooltip="t('demo')" type="button" class="icon-action" :aria-label="t('demo')" @click="emit('demo')"><Sparkles :size="19" /></button>
        <button v-if="assets.length" v-tooltip="t('reset')" type="button" class="icon-action destructive" :aria-label="t('clearConfirm')" @click="emit('clear')"><Trash2 :size="19" /></button>
        <button v-tooltip="t('add')" type="button" class="icon-action emphasized" :aria-label="t('add')" :disabled="decoding" @click="emit('choose')"><ImagePlus :size="20" /></button>
      </div>
    </header>

    <div v-if="assets.length" class="asset-grid" :aria-label="mode === 'demo' ? t('demoLabel') : t('userLabel')">
      <article v-for="asset in assets" :key="asset.id" class="asset-tile" :class="{ excluded: !asset.enabled }">
        <img :src="asset.src" :alt="asset.name" draggable="false" />
        <button v-tooltip="asset.enabled ? t('exclude') : t('include')" type="button" class="asset-state" :class="{ active: asset.enabled }" :aria-label="`${asset.enabled ? t('exclude') : t('include')}: ${asset.name}`" :aria-pressed="asset.enabled" @click="emit('toggle', asset.id)"><Check v-if="asset.enabled" :size="15" stroke-width="3" /></button>
        <button v-tooltip="t('remove')" type="button" class="asset-remove" :aria-label="`${t('remove')}: ${asset.name}`" @click="emit('remove', asset.id)"><X :size="16" /></button>
        <span>{{ asset.name }}</span>
      </article>
      <button type="button" class="asset-add" :aria-label="t('add')" @click="emit('choose')"><ImagePlus :size="22" /><span>{{ t('add') }}</span></button>
    </div>

  </section>
</template>
