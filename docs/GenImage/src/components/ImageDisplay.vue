<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { Download, Copy, Check, X, Maximize2 } from 'lucide-vue-next'

const props = defineProps<{
  imageUrl: string
  label?: string
}>()

const copied = ref(false)
const showFullscreen = ref(false)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const lastTranslateX = ref(0)
const lastTranslateY = ref(0)
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const loadError = ref(false)

const mimeType = computed(() => props.imageUrl.match(/^data:(.*?);base64,/)?.[1] || 'image/png')
const fileExtension = computed(() => {
  const type = mimeType.value.split('/')[1] || 'png'
  return type.includes('jpeg') ? 'jpg' : type
})

const loadImageMeta = () => {
  loadError.value = false
  const img = new Image()
  img.onload = () => {
    naturalWidth.value = img.naturalWidth
    naturalHeight.value = img.naturalHeight
  }
  img.onerror = () => {
    naturalWidth.value = 0
    naturalHeight.value = 0
    loadError.value = true
  }
  img.src = props.imageUrl
}

const resetViewer = () => {
  showFullscreen.value = false
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

const downloadImage = () => {
  const link = document.createElement('a')
  link.href = props.imageUrl
  link.download = `zenmux-generated-${Date.now()}.${fileExtension.value}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const copyImage = async (e: Event) => {
  e.stopPropagation()
  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = props.imageUrl

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get canvas context')

    ctx.drawImage(img, 0, 0)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png', 1)
    })

    if (!blob) throw new Error('Failed to create blob')

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ])

    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    alert('复制失败，请尝试右键图片另存或复制。')
  }
}

const openFullscreen = () => {
  showFullscreen.value = true
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
  document.body.style.overflow = 'hidden'
}

const closeFullscreen = () => {
  showFullscreen.value = false
  document.body.style.overflow = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showFullscreen.value) {
    closeFullscreen()
  }
}

const handleWheel = (e: WheelEvent) => {
  if (!showFullscreen.value) return
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.min(Math.max(0.5, scale.value * delta), 5)
}

const startDrag = (e: MouseEvent) => {
  if (!showFullscreen.value) return
  e.preventDefault()
  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  lastTranslateX.value = translateX.value
  lastTranslateY.value = translateY.value
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  e.preventDefault()
  translateX.value = lastTranslateX.value + e.clientX - startX.value
  translateY.value = lastTranslateY.value + e.clientY - startY.value
}

const stopDrag = () => {
  isDragging.value = false
}

onMounted(() => {
  loadImageMeta()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

watch(() => props.imageUrl, () => {
  resetViewer()
  loadImageMeta()
})
</script>

<template>
  <div class="w-full space-y-3 animate-fade-in">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
        <span v-if="label" class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{{ label }}</span>
        <span v-if="naturalWidth && naturalHeight" class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">{{ naturalWidth }} × {{ naturalHeight }}</span>
        <span class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">{{ fileExtension.toUpperCase() }}</span>
        <span v-if="loadError" class="px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-medium">读取尺寸失败</span>
      </div>

      <div class="flex gap-2">
        <button
          @click.stop="copyImage"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <component :is="copied ? Check : Copy" class="w-4 h-4" />
          <span>{{ copied ? '已复制' : '复制' }}</span>
        </button>
        <button
          @click.stop="downloadImage"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download class="w-4 h-4" />
          <span>下载</span>
        </button>
        <button
          @click="openFullscreen"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Maximize2 class="w-4 h-4" />
          <span>查看细节</span>
        </button>
      </div>
    </div>

    <div
      class="overflow-auto max-h-[70vh] rounded-2xl border border-gray-200 bg-gray-50 shadow-inner cursor-zoom-in relative"
      @click="openFullscreen"
    >
      <img :src="imageUrl" :alt="label || 'Generated Image'" class="block w-full h-auto" />
    </div>

    <div v-if="showFullscreen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm" @wheel="handleWheel">
      <div class="absolute top-4 right-4 z-50 flex gap-4">
        <button
          @click="closeFullscreen"
          class="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X class="w-8 h-8" />
        </button>
      </div>

      <div
        class="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
      >
        <img
          :src="imageUrl"
          class="max-w-none transition-transform duration-75 select-none"
          :style="{
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`
          }"
          draggable="false"
        />
      </div>

      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 bg-black/50 px-4 py-2 rounded-full text-sm pointer-events-none select-none">
        滚轮缩放 · 拖动查看细节
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
