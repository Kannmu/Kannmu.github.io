<script setup lang="ts">
import { ref } from 'vue'
import { X, Sparkles, Upload } from 'lucide-vue-next'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'generate', payload: { prompt: string, image: string | null, aspectRatio: string, imageSize: string }): void
}>()

const prompt = ref('')
const aspectRatio = ref('1:1')
const imageSize = ref('2K')
const referenceImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const ratios = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Portrait (9:16)', value: '9:16' },
  { label: 'Landscape (16:9)', value: '16:9' },
  { label: 'Standard (4:3)', value: '4:3' },
  { label: 'Tall (3:4)', value: '3:4' }
]

const resolutions = [
  { label: '1K', value: '1K' },
  { label: '2K', value: '2K' },
  { label: '4K', value: '4K' }
]

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      referenceImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const clearImage = () => {
  referenceImage.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const generate = () => {
  if (!prompt.value.trim()) return
  emit('generate', { prompt: prompt.value, image: referenceImage.value, aspectRatio: aspectRatio.value, imageSize: imageSize.value })
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto space-y-6">
    <!-- Prompt Input -->
    <div class="relative group">
      <textarea
        v-model="prompt"
        rows="4"
        class="w-full p-4 text-base bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
        placeholder="Describe the image you want to generate..."
      ></textarea>
      <div class="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
        {{ prompt.length }} chars
      </div>
    </div>

    <!-- Aspect Ratio and Resolution Selection -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="ratio in ratios" 
          :key="ratio.value"
          @click="aspectRatio = ratio.value"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all border',
            aspectRatio === ratio.value 
              ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-100' 
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ ratio.label }}
        </button>
      </div>

      <div class="relative inline-block w-32">
        <select 
          v-model="imageSize"
          class="block w-full px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-300 transition-all"
        >
          <option v-for="res in resolutions" :key="res.value" :value="res.value">
            {{ res.label }}
          </option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Image Upload -->
    <div class="flex flex-col gap-4">
      <div v-if="!referenceImage" 
           @click="triggerFileInput"
           class="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group h-32">
        <Upload class="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
        <span class="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">Upload reference image (optional)</span>
      </div>

      <div v-else class="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden group border border-gray-200">
        <img :src="referenceImage" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
        <button @click="clearImage" class="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all">
          <X class="w-4 h-4" />
        </button>
      </div>

      <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />
    </div>

    <!-- Generate Button -->
    <button
      @click="generate"
      :disabled="loading || !prompt.trim()"
      class="w-full py-4 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
    >
      <Sparkles class="w-5 h-5" />
      <span>{{ loading ? 'Generating...' : 'Generate Image' }}</span>
    </button>
  </div>
</template>
