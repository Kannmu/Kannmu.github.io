<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ImageOff, ImagePlus, Images, Info, RefreshCw, Upload } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'
import type { AssetImage, LayoutRect, LayoutResult, LibraryMode } from '../types'

const props = defineProps<{
  assets: AssetImage[]
  mode: LibraryMode
  result: LayoutResult | null
  running: boolean
  pending: boolean
  animating: boolean
  decoding: boolean
  progress: number
}>()
const emit = defineEmits<{ choose: []; files: [files: FileList]; manage: []; alternative: []; inspector: [] }>()
const { t } = useLocale()
const stage = ref<HTMLElement | null>(null)
const width = ref(900)
const height = ref(700)
const dragDepth = ref(0)
const dragging = computed(() => dragDepth.value > 0)
let observer: ResizeObserver | null = null

const enabled = computed(() => props.assets.filter((asset) => asset.enabled))
const assetMap = computed(() => new Map(props.assets.map((asset) => [asset.id, asset])))
const frame = computed(() => {
  const aspect = props.result ? props.result.canvasWidth / props.result.canvasHeight : 1.45
  const availableWidth = Math.max(120, width.value - 96)
  const availableHeight = Math.max(120, height.value - 112)
  const frameWidth = Math.min(availableWidth, availableHeight * aspect)
  return { width: frameWidth, height: frameWidth / aspect }
})

function rectStyle(rect: LayoutRect): Record<string, string> {
  if (!props.result) return {}
  const scaleToStage = frame.value.width / props.result.canvasWidth
  const baseHeight = 100
  return {
    width: `${(assetMap.value.get(rect.id)?.aspect || rect.width / rect.height) * baseHeight}px`,
    height: `${baseHeight}px`,
    transform: `translate3d(${rect.x * scaleToStage}px, ${rect.y * scaleToStage}px, 0) scale(${rect.height * scaleToStage / baseHeight})`,
  }
}

function onDragEnter(): void { dragDepth.value += 1 }
function onDragLeave(): void { dragDepth.value = Math.max(0, dragDepth.value - 1) }
function onDrop(event: DragEvent): void {
  dragDepth.value = 0
  if (event.dataTransfer?.files.length) emit('files', event.dataTransfer.files)
}

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    if (!entry) return
    width.value = entry.contentRect.width
    height.value = entry.contentRect.height
  })
  if (stage.value) observer.observe(stage.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section ref="stage" class="layout-stage" :class="{ 'is-dragging': dragging, 'is-arranging': animating || running, 'is-pending': pending }" @dragenter.prevent="onDragEnter" @dragover.prevent @dragleave.prevent="onDragLeave" @drop.prevent="onDrop">
    <div class="stage-ambient"></div>
    <button v-if="mode === 'empty'" type="button" class="empty-stage" @click="emit('choose')">
      <span class="upload-glyph"><Upload :size="28" /></span>
      <strong>{{ t('drop') }}</strong>
      <small>{{ t('local') }}</small>
    </button>

    <div v-else-if="enabled.length === 1" class="single-stage">
      <img :src="enabled[0]!.src" :alt="enabled[0]!.name" decoding="async" draggable="false" />
      <button type="button" @click="emit('choose')"><ImagePlus :size="25" /><span>{{ t('needAnother') }}</span></button>
    </div>

    <div v-else-if="enabled.length === 0" class="selection-empty">
      <span class="upload-glyph"><ImageOff :size="28" /></span>
      <strong>{{ t('noneSelected') }}</strong>
      <button type="button" class="stage-primary" @click="emit('manage')"><Images :size="19" /><span>{{ t('reviewPhotos') }}</span></button>
    </div>

    <div v-else-if="result" class="layout-frame" :style="{ width: `${frame.width}px`, height: `${frame.height}px` }">
      <img v-for="rect in result.rects" :key="rect.id" class="layout-photo" :class="{ compositing: animating }" :src="assetMap.get(rect.id)?.src" :alt="assetMap.get(rect.id)?.name || ''" decoding="async" draggable="false" :style="rectStyle(rect)" />
      <span v-if="pending || running" class="pending-outline"></span>
    </div>

    <div v-else-if="running || pending" class="stage-loading" aria-live="polite"><span></span></div>

    <div v-else class="selection-empty" role="alert">
      <span class="upload-glyph"><ImageOff :size="28" /></span>
      <strong>{{ t('layoutFailed') }}</strong>
      <button type="button" class="stage-primary" @click="emit('alternative')"><RefreshCw :size="19" /><span>{{ t('retry') }}</span></button>
    </div>

    <div v-if="result" class="stage-tools">
      <span v-tooltip="running || pending ? t('searching') : t('ready')" class="search-state" :class="{ active: running || pending }" :aria-label="running || pending ? t('searching') : t('ready')" role="status"><span></span></span>
      <button v-tooltip="t('alternative')" type="button" class="stage-action" :aria-label="t('alternative')" :disabled="running" @click="emit('alternative')"><RefreshCw :size="19" /></button>
      <button v-tooltip="t('inspector')" type="button" class="stage-action" :aria-label="t('inspector')" @click="emit('inspector')"><Info :size="19" /></button>
    </div>

    <div v-if="dragging" class="drop-overlay"><span class="upload-glyph"><Upload :size="30" /></span><strong>{{ t('drop') }}</strong></div>
    <div v-if="decoding" class="decode-overlay"><span></span></div>
  </section>
</template>
