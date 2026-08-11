<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Download, Globe2, Images, SlidersHorizontal, Sparkles } from 'lucide-vue-next'
import AssetPanel from './components/AssetPanel.vue'
import ControlPanel from './components/ControlPanel.vue'
import ExportPanel from './components/ExportPanel.vue'
import InspectorPanel from './components/InspectorPanel.vue'
import LayoutStage from './components/LayoutStage.vue'
import MobileSheet from './components/MobileSheet.vue'
import { useAssetLibrary } from './composables/useAssetLibrary'
import { useExport } from './composables/useExport'
import { useLayoutSearch } from './composables/useLayoutSearch'
import { useLocale } from './composables/useLocale'
import { exportSizes } from './core/exportSizing'
import type { ExportAction, ExportFormat, ExportResolution, LayoutImage, PanelMode, SearchConfig } from './types'

const gap = ref(24)
const balance = ref(0.62)
const targetAspect = ref('auto')
const iterations = ref(7600)
const exportFormat = ref<ExportFormat>('png')
const exportResolution = ref<ExportResolution>('original')
const activePanel = ref<PanelMode>(null)
const inspectorOpen = ref(false)
const interacting = ref(false)
const isMobile = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const toasts = ref<Array<{ id: number; text: string; type: 'info' | 'error' }>>([])
let toastId = 0
let mediaQuery: MediaQueryList | null = null
let viewportListener: (() => void) | null = null

const { locale, localeLabel, t, toggleLocale } = useLocale()
const { assets, mode, decoding, enabledAssets, loadDemo, clear, remove, toggle, addFiles } = useAssetLibrary()
const layoutImages = computed<LayoutImage[]>(() => enabledAssets.value.map((asset) => ({
  id: asset.id, name: asset.name, width: asset.width, height: asset.height, aspect: asset.aspect, weight: asset.weight,
})))
const config = computed<SearchConfig>(() => ({
  canvasWidth: 1600,
  gap: gap.value,
  targetAspect: targetAspect.value === 'auto' ? 1.45 : Number(targetAspect.value),
  fixedFrame: targetAspect.value !== 'auto',
  balance: balance.value,
  iterations: iterations.value,
  seed: 90117 + layoutImages.value.length * 31 + Math.round(balance.value * 100),
}))
const { bestResult, displayResult, running, pending, animating, progress, evaluations, elapsed, error, start, schedule, reset } = useLayoutSearch(layoutImages, config)
const exportResolutions = computed(() => bestResult.value ? exportSizes(bestResult.value, assets.value) : [])
const { exporting, activeAction, exportLayout } = useExport(assets)
const effectsPaused = computed(() => interacting.value || decoding.value || animating.value)

function notify(text: string, type: 'info' | 'error' = 'info'): void {
  const id = ++toastId
  toasts.value.push({ id, text, type })
  window.setTimeout(() => { toasts.value = toasts.value.filter((toast) => toast.id !== id) }, 2400)
}

function openPicker(): void { fileInput.value?.click() }

async function handleFiles(input: FileList | File[]): Promise<void> {
  const result = await addFiles(input)
  if (result.failed) notify(t('uploadFailed'), 'error')
  if (result.ignored) notify(`${t('duplicate')} · ${result.ignored}`)
  if (result.added && isMobile.value) activePanel.value = null
}

function onFileChange(event: Event): void {
  const target = event.target as HTMLInputElement
  if (target.files) void handleFiles(target.files)
  target.value = ''
}

function handleClear(): void {
  if (!window.confirm(t('clearPrompt'))) return
  clear()
  reset()
  inspectorOpen.value = false
}

function manageAssets(): void {
  if (isMobile.value) {
    activePanel.value = 'assets'
    return
  }
  void nextTick(() => document.querySelector<HTMLButtonElement>('.asset-state')?.focus())
}

async function handleExport(action: ExportAction): Promise<void> {
  if (!bestResult.value) return
  const size = exportResolutions.value.find((item) => item.id === exportResolution.value)
  if (!size) return
  try {
    await exportLayout(bestResult.value, exportFormat.value, size, action)
    notify(t(action === 'copy' ? 'copyReady' : 'exportReady'))
  } catch {
    notify(t(action === 'copy' ? 'copyFailed' : 'exportFailed'), 'error')
  }
}

function togglePanel(panel: Exclude<PanelMode, null>): void {
  activePanel.value = activePanel.value === panel ? null : panel
}

watch(() => layoutImages.value.map((image) => `${image.id}:${image.width}:${image.height}`).join('|'), () => {
  inspectorOpen.value = false
  if (layoutImages.value.length >= 2) start()
  else reset()
})
watch(gap, () => schedule(true))
watch(targetAspect, () => schedule(true))
watch([balance, iterations], () => schedule(false))
watch(exportResolutions, (options) => { if (!options.some((option) => option.id === exportResolution.value)) exportResolution.value = 'original' })
watch(error, (message) => { if (message) notify(message === 'layout-worker-unavailable' ? t('layoutFailed') : message, 'error') })
watch(locale, (value) => { document.documentElement.lang = value })

onMounted(() => {
  document.documentElement.lang = locale.value
  mediaQuery = window.matchMedia('(max-width: 760px)')
  viewportListener = () => {
    isMobile.value = Boolean(mediaQuery?.matches)
    if (!isMobile.value) activePanel.value = null
  }
  viewportListener()
  mediaQuery.addEventListener('change', viewportListener)
})
onBeforeUnmount(() => { if (mediaQuery && viewportListener) mediaQuery.removeEventListener('change', viewportListener) })
</script>

<template>
  <div class="app-shell" :class="{ 'effects-paused': effectsPaused }">
    <header class="topbar glass-surface">
      <div class="brand" aria-label="PhoLo"><span class="brand-mark"><i></i><i></i><i></i></span><span><strong>{{ t('appName') }}</strong><small>{{ t('appTag') }}</small></span></div>
      <div class="header-actions">
        <button v-if="mode === 'empty'" v-tooltip="t('demo')" type="button" class="header-action" :aria-label="t('demo')" @click="loadDemo"><Sparkles :size="19" /></button>
        <button v-tooltip="t('language')" type="button" class="header-action" :aria-label="t('language')" @click="toggleLocale"><Globe2 :size="19" /><span>{{ localeLabel }}</span></button>
      </div>
    </header>

    <main class="workspace-shell">
      <aside v-if="!isMobile" class="asset-dock glass-surface"><AssetPanel :assets="assets" :mode="mode" :decoding="decoding" @choose="openPicker" @demo="loadDemo" @clear="handleClear" @remove="remove" @toggle="toggle" /></aside>

      <LayoutStage class="main-stage" :assets="assets" :mode="mode" :result="displayResult" :running="running" :pending="pending" :animating="animating" :decoding="decoding" :progress="progress" @choose="openPicker" @files="handleFiles" @manage="manageAssets" @alternative="start(true)" @inspector="inspectorOpen = !inspectorOpen" />

      <aside v-if="!isMobile" class="control-dock glass-surface">
        <ControlPanel v-model:gap="gap" v-model:balance="balance" v-model:target-aspect="targetAspect" v-model:iterations="iterations" @interaction="interacting = $event" />
        <ExportPanel v-model:format="exportFormat" v-model:resolution="exportResolution" :resolutions="exportResolutions" :exporting="exporting" :active-action="activeAction" :disabled="!bestResult || running || pending" @download="handleExport('download')" @copy="handleExport('copy')" />
      </aside>

      <InspectorPanel :open="inspectorOpen" :result="bestResult" :elapsed="elapsed" :evaluations="evaluations" @close="inspectorOpen = false" />
    </main>

    <nav v-if="isMobile" class="mobile-toolbar glass-surface" :aria-label="t('workspaceTools')">
      <button type="button" :class="{ active: activePanel === 'assets' }" @click="togglePanel('assets')"><Images :size="21" /><span>{{ t('assets') }}</span></button>
      <button type="button" :class="{ active: activePanel === 'adjust' }" @click="togglePanel('adjust')"><SlidersHorizontal :size="21" /><span>{{ t('adjust') }}</span></button>
      <button type="button" :class="{ active: activePanel === 'export' }" :disabled="!bestResult" @click="togglePanel('export')"><Download :size="21" /><span>{{ t('export') }}</span></button>
    </nav>

    <MobileSheet v-if="isMobile" :open="activePanel !== null" :title="activePanel ? t(activePanel) : ''" @close="activePanel = null">
      <AssetPanel v-if="activePanel === 'assets'" :assets="assets" :mode="mode" :decoding="decoding" @choose="openPicker" @demo="loadDemo" @clear="handleClear" @remove="remove" @toggle="toggle" />
      <ControlPanel v-else-if="activePanel === 'adjust'" v-model:gap="gap" v-model:balance="balance" v-model:target-aspect="targetAspect" v-model:iterations="iterations" @interaction="interacting = $event" />
      <ExportPanel v-else-if="activePanel === 'export'" v-model:format="exportFormat" v-model:resolution="exportResolution" :resolutions="exportResolutions" :exporting="exporting" :active-action="activeAction" :disabled="!bestResult || running || pending" @download="handleExport('download')" @copy="handleExport('copy')" />
    </MobileSheet>

    <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="onFileChange" />
    <div class="toast-stack" aria-live="polite"><div v-for="toast in toasts" :key="toast.id" class="toast glass-surface" :class="toast.type">{{ toast.text }}</div></div>
  </div>
</template>
