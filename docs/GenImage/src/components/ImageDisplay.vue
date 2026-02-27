<script setup lang="ts">
import { Download, Copy, Check, ZoomIn, X } from 'lucide-vue-next'
import { ref, watch } from 'vue'

const props = defineProps<{
  imageUrl: string
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

const downloadImage = () => {
  const link = document.createElement('a')
  link.href = props.imageUrl
  link.download = `zenmux-generated-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const copyImage = async (e: Event) => {
  e.stopPropagation()
  try {
    const response = await fetch(props.imageUrl)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ])
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
    alert('Copy failed. Please right-click the image to copy.')
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

const handleWheel = (e: WheelEvent) => {
  if (!showFullscreen.value) return
  e.preventDefault()
  
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.min(Math.max(0.5, scale.value * delta), 5)
  
  scale.value = newScale
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
  
  const deltaX = e.clientX - startX.value
  const deltaY = e.clientY - startY.value
  
  translateX.value = lastTranslateX.value + deltaX
  translateY.value = lastTranslateY.value + deltaY
}

const stopDrag = () => {
  isDragging.value = false
}

// Reset state when image changes
watch(() => props.imageUrl, () => {
  showFullscreen.value = false
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
})
</script>

<template>
  <div class="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
    <div 
      class="relative rounded-2xl overflow-hidden shadow-2xl group bg-white cursor-zoom-in"
      @click="openFullscreen"
    >
      <img :src="imageUrl" alt="Generated Image" class="w-full h-auto object-cover" />
      
      <!-- Magnifying Glass Icon Overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 pointer-events-none">
        <ZoomIn class="w-12 h-12 text-white drop-shadow-lg" />
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-3" @click.stop>
        <button 
          @click="copyImage"
          class="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors tooltip"
          :title="copied ? 'Copied!' : 'Copy Image'"
        >
          <component :is="copied ? Check : Copy" class="w-5 h-5" />
        </button>
        <button 
          @click="downloadImage"
          class="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors tooltip"
          title="Download Image"
        >
          <Download class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Fullscreen Modal -->
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
        Scroll to zoom • Drag to move
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
