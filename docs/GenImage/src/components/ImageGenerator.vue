<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Sparkles, Upload, ChevronDown, Check, Cpu, Plus, ZoomIn } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import ImageDisplay from './ImageDisplay.vue'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'generate', payload: { 
    prompt: string, 
    images: string[], 
    aspectRatio: string, 
    imageSize: string,
    model: string 
  }): void
}>()

const models = [
  {
    id: 'google/gemini-3.1-flash-image-preview',
    name: 'Nanobanana 2',
    inputPrice: 0.25,
    outputPrice: 1.5,
  },
  {
    id: 'google/gemini-3-pro-image-preview',
    name: 'Nanobanana Pro',
    inputPrice: 2.0,
    outputPrice: 12.0,
  }
]

const prompt = ref('')
const aspectRatio = ref('1:1') 
const imageSize = ref('2K')
const selectedModel = ref(models[0]?.id ?? '')
const isModelDropdownOpen = ref(false)
const modelDropdownRef = ref(null)

const currentModel = computed(() => models.find(m => m.id === selectedModel.value))

onClickOutside(modelDropdownRef, () => {
  isModelDropdownOpen.value = false
})

const selectModel = (modelId: string) => {
  selectedModel.value = modelId
  isModelDropdownOpen.value = false
}

const referenceImages = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)

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
  if (target.files && target.files.length > 0) {
    Array.from(target.files).forEach(processFile)
  }
}

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    Array.from(event.dataTransfer.files).forEach(processFile)
  }
}

const handlePaste = (event: ClipboardEvent) => {
  if (event.clipboardData?.files && event.clipboardData.files.length > 0) {
    event.preventDefault()
    Array.from(event.clipboardData.files).forEach(processFile)
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      referenceImages.value.push(e.target.result as string)
    }
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const removeImage = (index: number) => {
  referenceImages.value.splice(index, 1)
  if (referenceImages.value.length === 0 && fileInput.value) {
    fileInput.value.value = ''
  }
}

const viewImage = (image: string) => {
  previewImage.value = image
}

const closePreview = () => {
  previewImage.value = null
}

const generate = () => {
  if (!prompt.value.trim()) return
  emit('generate', { 
    prompt: prompt.value, 
    images: referenceImages.value, 
    aspectRatio: aspectRatio.value, 
    imageSize: imageSize.value,
    model: selectedModel.value
  })
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto space-y-6">
    <!-- Model Selection -->
    <div class="space-y-2" ref="modelDropdownRef">
      <label class="text-sm font-medium text-gray-700 ml-1">Model</label>
      <div class="relative">
        <button 
          @click="isModelDropdownOpen = !isModelDropdownOpen"
          type="button"
          class="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-left"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Cpu class="w-5 h-5" />
            </div>
            <div>
              <div class="font-medium text-gray-900">{{ currentModel?.name }}</div>
              <div class="text-xs text-gray-500 flex gap-2">
                <span>Input: ${{ currentModel?.inputPrice }}/M</span>
                <span>Output: ${{ currentModel?.outputPrice }}/M</span>
              </div>
            </div>
          </div>
          <ChevronDown :class="['w-5 h-5 text-gray-400 transition-transform duration-200', isModelDropdownOpen ? 'rotate-180' : '']" />
        </button>

        <Transition name="dropdown">
          <div 
            v-if="isModelDropdownOpen"
            class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden origin-top"
          >
            <div class="max-h-64 overflow-y-auto p-1.5 space-y-1">
              <button
                v-for="model in models"
                :key="model.id"
                @click="selectModel(model.id)"
                :class="[
                  'w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group',
                  selectedModel === model.id ? 'bg-blue-50 border-blue-100 ring-1 ring-blue-100' : 'hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div :class="[
                    'p-2 rounded-lg transition-colors',
                    selectedModel === model.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  ]">
                    <Cpu class="w-5 h-5" />
                  </div>
                  <div>
                    <div :class="['font-medium', selectedModel === model.id ? 'text-blue-900' : 'text-gray-900']">
                      {{ model.name }}
                    </div>
                    <div class="text-xs text-gray-500 mt-0.5 flex items-center gap-3">
                      <span class="flex items-center gap-1">
                        <span class="text-gray-400">In:</span>
                        <span class="font-medium text-gray-700">${{ model.inputPrice }}</span>
                      </span>
                      <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span class="flex items-center gap-1">
                        <span class="text-gray-400">Out:</span>
                        <span class="font-medium text-gray-700">${{ model.outputPrice }}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <Check v-if="selectedModel === model.id" class="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Prompt Input -->
    <div class="relative group">
      <textarea
        v-model="prompt"
        @paste="handlePaste"
        rows="4"
        class="w-full p-4 text-base bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
        placeholder="Describe the image you want to generate... (You can also paste an image here)"
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
      <div 
           @dragover.prevent
           @drop.prevent="handleDrop"
           class="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors flex flex-col gap-4"
      >
        <div v-if="referenceImages.length === 0" 
             @click="triggerFileInput"
             class="flex flex-col items-center justify-center cursor-pointer h-32 group">
          <Upload class="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
          <span class="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">上传参考图（支持多张，可拖拽或在此处粘贴）</span>
        </div>
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div v-for="(img, index) in referenceImages" :key="index" 
               class="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group border border-gray-200">
            <img :src="img" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
            
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button @click.stop="viewImage(img)" class="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-all" title="查看">
                <ZoomIn class="w-4 h-4" />
              </button>
              <button @click.stop="removeImage(index)" class="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white backdrop-blur-sm transition-all" title="删除">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div @click="triggerFileInput"
               class="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
            <Plus class="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <span class="text-xs text-gray-500 mt-2 group-hover:text-blue-600 transition-colors">继续添加</span>
          </div>
        </div>
      </div>

      <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" multiple class="hidden" />
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

  <!-- Image Preview Modal -->
  <div v-if="previewImage" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" @click="closePreview">
    <div class="relative w-full max-w-5xl max-h-[90vh] flex flex-col" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-white text-lg font-medium">参考图预览</h3>
        <button @click="closePreview" class="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>
      <div class="flex-1 overflow-hidden rounded-2xl bg-black/50 border border-white/10">
        <ImageDisplay :image-url="previewImage" label="参考图" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
