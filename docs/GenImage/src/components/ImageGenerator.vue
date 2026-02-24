<script setup lang="ts">
import { ref } from 'vue'
import { X, Sparkles, Upload } from 'lucide-vue-next'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'generate', payload: { prompt: string, image: string | null }): void
}>()

const prompt = ref('')
const referenceImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

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
  emit('generate', { prompt: prompt.value, image: referenceImage.value })
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
