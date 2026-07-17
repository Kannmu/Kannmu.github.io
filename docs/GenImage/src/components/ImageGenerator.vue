<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import {
  Check,
  ChevronDown,
  Cpu,
  ImagePlus,
  Maximize2,
  Plus,
  RectangleHorizontal,
  RectangleVertical,
  SlidersHorizontal,
  Sparkles,
  Square,
  Upload,
  X,
  ZoomIn
} from 'lucide-vue-next'
import ImageDisplay from './ImageDisplay.vue'
import {
  gptImageModels,
  zenMuxModels,
  type GeneratePayload,
  type ImageBackground,
  type ImageInputFidelity,
  type ImageModeration,
  type ImageQuality,
  type OutputFormat,
  type ProviderId
} from '../services/imageProviders'

const props = defineProps<{
  loading: boolean
  provider: ProviderId
  ready: boolean
}>()

const emit = defineEmits<{
  (event: 'generate', payload: GeneratePayload): void
}>()

type ModelOption = {
  id: string
  name: string
  inputPrice?: number
  outputPrice?: number
}

const prompt = ref('')
const selectedZenMuxModel = ref(zenMuxModels[0].id as string)
const zenMuxAspectRatio = ref('1:1')
const zenMuxImageSize = ref('2K')
const gptImageSizePreset = ref('1024x1024')
const gptCustomWidth = ref(2048)
const gptCustomHeight = ref(2048)
const gptQuality = ref<ImageQuality>('auto')
const gptOutputFormat = ref<OutputFormat>('png')
const gptOutputCount = ref(1)
const gptBackground = ref<ImageBackground>('auto')
const gptOutputCompression = ref(100)
const gptModeration = ref<ImageModeration>('auto')
const gptInputFidelity = ref<ImageInputFidelity>('low')
const gptUserId = ref('')
const isModelDropdownOpen = ref(false)
const modelDropdownRef = ref<HTMLElement | null>(null)
const referenceImages = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const maskImage = ref<string | null>(null)
const maskInput = ref<HTMLInputElement | null>(null)
const previewImage = ref<string | null>(null)
const uploadError = ref<string | null>(null)
const maskError = ref<string | null>(null)

const zenMuxRatios = [
  { label: '方形', value: '1:1' },
  { label: '竖屏', value: '9:16' },
  { label: '横屏', value: '16:9' },
  { label: '标准横版', value: '4:3' },
  { label: '标准竖版', value: '3:4' }
]

const zenMuxResolutions = ['1K', '2K', '4K']

const gptSizes = [
  { label: '自动选择', value: 'auto', ratio: 'auto', group: '标准', icon: Maximize2 },
  { label: '方形', value: '1024x1024', ratio: '1:1', group: '标准', icon: Square },
  { label: '竖版', value: '1024x1536', ratio: '2:3', group: '标准', icon: RectangleVertical },
  { label: '横版', value: '1536x1024', ratio: '3:2', group: '标准', icon: RectangleHorizontal },
  { label: '2K 方形', value: '2048x2048', ratio: '1:1', group: '高分辨率', icon: Square },
  { label: '2K 竖版', value: '2048x3072', ratio: '2:3', group: '高分辨率', icon: RectangleVertical },
  { label: '2K 横版', value: '3072x2048', ratio: '3:2', group: '高分辨率', icon: RectangleHorizontal },
  { label: '4K 方形', value: '4096x4096', ratio: '1:1', group: '超高分辨率', icon: Square },
  { label: '4K 竖版', value: '4096x6144', ratio: '2:3', group: '超高分辨率', icon: RectangleVertical },
  { label: '4K 横版', value: '6144x4096', ratio: '3:2', group: '超高分辨率', icon: RectangleHorizontal }
]

const gptSizeGroups = ['标准', '高分辨率', '超高分辨率']

const qualityOptions: Array<{ label: string, value: ImageQuality }> = [
  { label: '自动', value: 'auto' },
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' }
]

const formatOptions: Array<{ label: string, value: OutputFormat }> = [
  { label: 'PNG', value: 'png' },
  { label: 'JPEG', value: 'jpeg' },
  { label: 'WebP', value: 'webp' }
]

const backgroundOptions: Array<{ label: string, value: ImageBackground }> = [
  { label: '自动', value: 'auto' },
  { label: '不透明', value: 'opaque' },
  { label: '透明', value: 'transparent' }
]

const moderationOptions: Array<{ label: string, value: ImageModeration }> = [
  { label: '自动', value: 'auto' },
  { label: '较宽松', value: 'low' }
]

const inputFidelityOptions: Array<{ label: string, value: ImageInputFidelity }> = [
  { label: '标准', value: 'low' },
  { label: '高保真', value: 'high' }
]

const models = computed<ModelOption[]>(() => props.provider === 'zenmux'
  ? zenMuxModels.map((model) => ({ ...model }))
  : gptImageModels.map((model) => ({ ...model })))

const selectedModel = computed(() => props.provider === 'zenmux'
  ? selectedZenMuxModel.value
  : gptImageModels[0].id)

const currentModel = computed(() => models.value.find((model) => model.id === selectedModel.value) || models.value[0])
const isGptImage = computed(() => props.provider === 'gpt-image-2')
const operationLabel = computed(() => referenceImages.value.length > 0 ? '编辑图片' : '生成图片')
const isCustomGptSize = computed(() => gptImageSizePreset.value === 'custom')
const selectedGptSize = computed(() => gptSizes.find((option) => option.value === gptImageSizePreset.value))
const resolvedGptImageSize = computed(() => isCustomGptSize.value
  ? `${gptCustomWidth.value}x${gptCustomHeight.value}`
  : gptImageSizePreset.value)
const gptSizeError = computed(() => {
  if (!isCustomGptSize.value) return null
  const values = [gptCustomWidth.value, gptCustomHeight.value]
  return values.every((value) => Number.isInteger(value) && value >= 256 && value <= 8192)
    ? null
    : '宽度和高度需为 256 到 8192 之间的整数。'
})
const gptCountError = computed(() => Number.isInteger(gptOutputCount.value) && gptOutputCount.value >= 1 && gptOutputCount.value <= 10
  ? null
  : '生成数量需为 1 到 10 之间的整数。')

const getAspectRatio = (size: string) => {
  if (size === 'auto') return 'auto'
  const [width, height] = size.split('x').map(Number)
  if (!width || !height) return 'custom'
  const divisor = (a: number, b: number): number => b === 0 ? a : divisor(b, a % b)
  const gcd = divisor(width, height)
  return `${width / gcd}:${height / gcd}`
}

onClickOutside(modelDropdownRef, () => {
  isModelDropdownOpen.value = false
})

watch(() => props.provider, () => {
  isModelDropdownOpen.value = false
  uploadError.value = null
})

watch(gptOutputFormat, (format) => {
  if (format === 'jpeg' && gptBackground.value === 'transparent') gptBackground.value = 'auto'
})

watch(() => referenceImages.value.length, (count) => {
  if (count === 0) {
    maskImage.value = null
    maskError.value = null
  }
})

const selectModel = (modelId: string) => {
  selectedZenMuxModel.value = modelId
  isModelDropdownOpen.value = false
}

const processFile = (file: File) => {
  uploadError.value = null

  if (!file.type.startsWith('image/')) {
    uploadError.value = '只能上传图片文件。'
    return
  }

  if (file.size > 20 * 1024 * 1024) {
    uploadError.value = '单张参考图不能超过 20 MB。'
    return
  }

  if (referenceImages.value.length >= 16) {
    uploadError.value = '最多可添加 16 张参考图。'
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    if (event.target?.result) {
      referenceImages.value.push(event.target.result as string)
    }
  }
  reader.readAsDataURL(file)
}

const addFiles = (files: FileList | File[]) => Array.from(files).forEach(processFile)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) addFiles(target.files)
  target.value = ''
}

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files.length) addFiles(event.dataTransfer.files)
}

const handlePaste = (event: ClipboardEvent) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault()
    addFiles(event.clipboardData.files)
  }
}

const triggerFileInput = () => fileInput.value?.click()
const triggerMaskInput = () => maskInput.value?.click()

const handleMaskUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  maskError.value = null
  if (!file) return

  if (!file.type.startsWith('image/')) {
    maskError.value = '蒙版必须是图片文件。'
    return
  }

  if (file.size > 20 * 1024 * 1024) {
    maskError.value = '蒙版文件不能超过 20 MB。'
    return
  }

  const reader = new FileReader()
  reader.onload = (readerEvent) => {
    if (readerEvent.target?.result) maskImage.value = readerEvent.target.result as string
  }
  reader.readAsDataURL(file)
}

const removeImage = (index: number) => {
  referenceImages.value.splice(index, 1)
  uploadError.value = null
}

const generate = () => {
  if (!prompt.value.trim() || (isGptImage.value && (gptSizeError.value || gptCountError.value))) return

  const gptSize = resolvedGptImageSize.value
  emit('generate', {
    prompt: prompt.value.trim(),
    images: [...referenceImages.value],
    aspectRatio: isGptImage.value ? getAspectRatio(gptSize) : zenMuxAspectRatio.value,
    imageSize: isGptImage.value ? gptSize : zenMuxImageSize.value,
    model: selectedModel.value,
    quality: isGptImage.value ? gptQuality.value : undefined,
    outputFormat: isGptImage.value ? gptOutputFormat.value : undefined,
    outputCount: isGptImage.value ? gptOutputCount.value : undefined,
    background: isGptImage.value ? gptBackground.value : undefined,
    outputCompression: isGptImage.value && gptOutputFormat.value !== 'png' ? gptOutputCompression.value : undefined,
    moderation: isGptImage.value && referenceImages.value.length === 0 ? gptModeration.value : undefined,
    inputFidelity: isGptImage.value && referenceImages.value.length > 0 ? gptInputFidelity.value : undefined,
    userId: isGptImage.value ? gptUserId.value.trim() || undefined : undefined,
    mask: isGptImage.value && referenceImages.value.length > 0 ? maskImage.value || undefined : undefined
  })
}
</script>

<template>
  <div class="w-full space-y-6">
    <div ref="modelDropdownRef" class="space-y-2">
      <label class="text-sm font-medium text-gray-700">模型</label>

      <div v-if="isGptImage" class="flex min-h-16 items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div class="rounded-lg bg-emerald-50 p-2 text-emerald-700">
          <Cpu class="h-5 w-5" />
        </div>
        <div class="min-w-0">
          <div class="font-medium text-gray-900">{{ currentModel?.name }}</div>
          <div class="mt-0.5 text-xs text-gray-500">OpenAI 兼容 Images API</div>
        </div>
      </div>

      <div v-else class="relative">
        <button
          type="button"
          class="flex min-h-16 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="isModelDropdownOpen = !isModelDropdownOpen"
        >
          <div class="flex min-w-0 items-center gap-3">
            <div class="rounded-lg bg-blue-50 p-2 text-blue-700">
              <Cpu class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <div class="truncate font-medium text-gray-900">{{ currentModel?.name }}</div>
              <div class="mt-0.5 text-xs text-gray-500">
                输入 ${{ currentModel?.inputPrice }}/M · 输出 ${{ currentModel?.outputPrice }}/M
              </div>
            </div>
          </div>
          <ChevronDown :class="['h-5 w-5 shrink-0 text-gray-400 transition-transform', isModelDropdownOpen ? 'rotate-180' : '']" />
        </button>

        <Transition name="dropdown">
          <div v-if="isModelDropdownOpen" class="absolute z-30 mt-2 w-full rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl">
            <button
              v-for="model in models"
              :key="model.id"
              type="button"
              :class="[
                'flex w-full items-center justify-between rounded-lg p-3 text-left transition',
                selectedModel === model.id ? 'bg-blue-50 text-blue-950' : 'text-gray-800 hover:bg-gray-50'
              ]"
              @click="selectModel(model.id)"
            >
              <div>
                <div class="font-medium">{{ model.name }}</div>
                <div class="mt-1 text-xs text-gray-500">输入 ${{ model.inputPrice }}/M · 输出 ${{ model.outputPrice }}/M</div>
              </div>
              <Check v-if="selectedModel === model.id" class="h-5 w-5 text-blue-600" />
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <div class="space-y-2">
      <label for="image-prompt" class="text-sm font-medium text-gray-700">提示词</label>
      <div class="relative">
        <textarea
          id="image-prompt"
          v-model="prompt"
          rows="5"
          class="w-full resize-y rounded-lg border border-gray-200 bg-white p-4 pb-9 text-base leading-7 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
          placeholder="描述你希望生成的画面，也可以粘贴参考图…"
          @paste="handlePaste"
        />
        <div class="pointer-events-none absolute bottom-3 right-3 text-xs text-gray-400">{{ prompt.length }} 字符</div>
      </div>
    </div>

    <div v-if="isGptImage" class="space-y-5">
      <fieldset class="space-y-3">
        <legend class="text-sm font-medium text-gray-700">输出尺寸</legend>
        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <label class="relative block">
            <span class="sr-only">分辨率预设</span>
            <select
              v-model="gptImageSizePreset"
              class="h-16 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <optgroup v-for="group in gptSizeGroups" :key="group" :label="group">
                <option v-for="option in gptSizes.filter((item) => item.group === group)" :key="option.value" :value="option.value">
                  {{ option.label }} · {{ option.value }}
                </option>
              </optgroup>
              <option value="custom">自定义尺寸</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </label>

          <div class="flex h-16 items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 text-emerald-900">
            <component :is="selectedGptSize?.icon || Maximize2" class="h-5 w-5 shrink-0" />
            <div class="min-w-0">
              <div class="truncate text-xs font-medium text-emerald-700">{{ selectedGptSize?.label || '自定义' }}</div>
              <div class="mt-0.5 truncate text-sm font-semibold">{{ resolvedGptImageSize }}</div>
            </div>
          </div>
        </div>

        <div v-if="isCustomGptSize" class="grid gap-3 sm:grid-cols-2">
          <label class="space-y-2 text-sm font-medium text-gray-700">
            <span>宽度（px）</span>
            <input v-model.number="gptCustomWidth" type="number" min="256" max="8192" step="64" class="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 outline-none focus:ring-2 focus:ring-emerald-600" />
          </label>
          <label class="space-y-2 text-sm font-medium text-gray-700">
            <span>高度（px）</span>
            <input v-model.number="gptCustomHeight" type="number" min="256" max="8192" step="64" class="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 outline-none focus:ring-2 focus:ring-emerald-600" />
          </label>
        </div>
        <p v-if="gptSizeError" class="text-sm text-red-600">{{ gptSizeError }}</p>
        <p v-else-if="isCustomGptSize || (selectedGptSize && selectedGptSize.group !== '标准')" class="text-xs text-amber-700">
          高分辨率预设依赖当前兼容接口支持；不支持时请改用标准尺寸或自定义值。
        </p>
      </fieldset>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label class="space-y-2 text-sm font-medium text-gray-700">
          <span>画质</span>
          <span class="relative block">
            <select v-model="gptQuality" class="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-9 outline-none focus:ring-2 focus:ring-emerald-600">
              <option v-for="option in qualityOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </span>
        </label>

        <label class="space-y-2 text-sm font-medium text-gray-700">
          <span>格式</span>
          <span class="relative block">
            <select v-model="gptOutputFormat" class="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-9 outline-none focus:ring-2 focus:ring-emerald-600">
              <option v-for="option in formatOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </span>
        </label>

        <label class="space-y-2 text-sm font-medium text-gray-700">
          <span>背景</span>
          <span class="relative block">
            <select v-model="gptBackground" class="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-9 outline-none focus:ring-2 focus:ring-emerald-600">
              <option v-for="option in backgroundOptions" :key="option.value" :value="option.value" :disabled="option.value === 'transparent' && gptOutputFormat === 'jpeg'">
                {{ option.label }}
              </option>
            </select>
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </span>
        </label>

        <label class="space-y-2 text-sm font-medium text-gray-700">
          <span>生成数量</span>
          <input v-model.number="gptOutputCount" type="number" min="1" max="10" step="1" class="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 outline-none focus:ring-2 focus:ring-emerald-600" />
          <span v-if="gptCountError" class="block text-xs font-normal text-red-600">{{ gptCountError }}</span>
        </label>
      </div>

      <details class="group border-y border-gray-200 py-1">
        <summary class="flex min-h-12 cursor-pointer list-none items-center gap-2 py-2 text-sm font-semibold text-gray-700">
          <SlidersHorizontal class="h-4 w-4" />
          <span>高级参数</span>
          <ChevronDown class="ml-auto h-4 w-4 text-gray-400 transition group-open:rotate-180" />
        </summary>
        <div class="grid gap-5 pb-4 pt-2 md:grid-cols-2">
          <label v-if="referenceImages.length === 0" class="space-y-2 text-sm font-medium text-gray-700">
            <span>内容审核</span>
            <span class="relative block">
              <select v-model="gptModeration" class="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-9 outline-none focus:ring-2 focus:ring-emerald-600">
                <option v-for="option in moderationOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </span>
          </label>

          <label v-else class="space-y-2 text-sm font-medium text-gray-700">
            <span>输入保真度</span>
            <span class="relative block">
              <select v-model="gptInputFidelity" class="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-9 outline-none focus:ring-2 focus:ring-emerald-600">
                <option v-for="option in inputFidelityOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </span>
          </label>

          <label v-if="gptOutputFormat !== 'png'" class="space-y-2 text-sm font-medium text-gray-700">
            <span class="flex items-center justify-between gap-3"><span>输出压缩率</span><output>{{ gptOutputCompression }}%</output></span>
            <input v-model.number="gptOutputCompression" type="range" min="0" max="100" step="1" class="h-12 w-full accent-emerald-700" />
          </label>

          <label class="space-y-2 text-sm font-medium text-gray-700">
            <span>用户标识（可选）</span>
            <input v-model="gptUserId" type="text" maxlength="128" autocomplete="off" placeholder="user" class="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 outline-none focus:ring-2 focus:ring-emerald-600" />
          </label>
        </div>
      </details>
    </div>

    <div v-else class="grid gap-5 md:grid-cols-[1fr_200px]">
      <fieldset class="space-y-2">
        <legend class="text-sm font-medium text-gray-700">画幅</legend>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ratio in zenMuxRatios"
            :key="ratio.value"
            type="button"
            :class="[
              'rounded-lg border px-3 py-2 text-sm font-medium transition',
              zenMuxAspectRatio === ratio.value
                ? 'border-blue-300 bg-blue-50 text-blue-800 ring-2 ring-blue-100'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            ]"
            @click="zenMuxAspectRatio = ratio.value"
          >
            {{ ratio.label }} {{ ratio.value }}
          </button>
        </div>
      </fieldset>

      <fieldset class="space-y-2">
        <legend class="text-sm font-medium text-gray-700">分辨率</legend>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="size in zenMuxResolutions"
            :key="size"
            type="button"
            :class="[
              'rounded-lg border px-3 py-2 text-sm font-medium transition',
              zenMuxImageSize === size
                ? 'border-blue-300 bg-blue-50 text-blue-800 ring-2 ring-blue-100'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            ]"
            @click="zenMuxImageSize = size"
          >
            {{ size }}
          </button>
        </div>
      </fieldset>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between gap-3">
        <label class="text-sm font-medium text-gray-700">参考图</label>
        <span class="text-xs text-gray-500">{{ referenceImages.length }}/16</span>
      </div>

      <div class="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300" @dragover.prevent @drop.prevent="handleDrop">
        <button
          v-if="referenceImages.length === 0"
          type="button"
          class="flex h-28 w-full flex-col items-center justify-center gap-2 text-gray-500 transition hover:text-blue-700"
          @click="triggerFileInput"
        >
          <Upload class="h-7 w-7" />
          <span class="text-sm">上传、拖入或粘贴参考图</span>
          <span v-if="isGptImage" class="text-xs text-gray-400">添加后将调用 GPT Image 2 图片编辑接口</span>
        </button>

        <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          <div v-for="(image, index) in referenceImages" :key="`${index}-${image.slice(-12)}`" class="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img :src="image" alt="参考图" class="h-full w-full object-cover" />
            <div class="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition group-hover:opacity-100">
              <button type="button" class="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30" title="查看" @click.stop="previewImage = image">
                <ZoomIn class="h-4 w-4" />
              </button>
              <button type="button" class="rounded-full bg-red-500/85 p-2 text-white hover:bg-red-600" title="删除" @click.stop="removeImage(index)">
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>

          <button type="button" class="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700" @click="triggerFileInput">
            <Plus class="h-5 w-5" />
            <span class="mt-1 text-xs">继续添加</span>
          </button>
        </div>
      </div>

      <p v-if="uploadError" class="text-sm text-red-600">{{ uploadError }}</p>
      <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="handleFileUpload" />
    </div>

    <div v-if="isGptImage && referenceImages.length > 0" class="space-y-2 border-t border-gray-200 pt-5">
      <div class="flex items-center justify-between gap-3">
        <label class="text-sm font-medium text-gray-700">编辑蒙版（可选）</label>
        <span class="text-xs text-gray-500">PNG 透明区域将被重绘</span>
      </div>

      <button
        v-if="!maskImage"
        type="button"
        class="flex min-h-20 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-sm text-gray-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800"
        @click="triggerMaskInput"
      >
        <Upload class="h-5 w-5" />
        <span>上传蒙版</span>
      </button>

      <div v-else class="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <button type="button" class="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white" title="查看蒙版" @click="previewImage = maskImage">
          <img :src="maskImage" alt="编辑蒙版" class="h-full w-full object-cover" />
        </button>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-medium text-gray-800">蒙版已添加</div>
          <div class="mt-1 text-xs text-gray-500">将随图片编辑请求一并发送</div>
        </div>
        <button type="button" class="rounded-full p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600" title="移除蒙版" @click="maskImage = null">
          <X class="h-5 w-5" />
        </button>
      </div>

      <p v-if="maskError" class="text-sm text-red-600">{{ maskError }}</p>
      <input ref="maskInput" type="file" accept="image/png,image/webp,image/jpeg" class="hidden" @change="handleMaskUpload" />
    </div>

    <button
      type="button"
      :disabled="loading || !ready || !prompt.trim() || (isGptImage && !!(gptSizeError || gptCountError))"
      class="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
      @click="generate"
    >
      <ImagePlus v-if="referenceImages.length > 0" class="h-5 w-5" />
      <Sparkles v-else class="h-5 w-5" />
      <span>{{ !ready ? '请先填写 API Key' : (loading ? '正在处理…' : operationLabel) }}</span>
    </button>
  </div>

  <div v-if="previewImage" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" @click="previewImage = null">
    <div class="flex max-h-[90vh] w-full max-w-5xl flex-col" @click.stop>
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-base font-medium text-white">参考图预览</h3>
        <button type="button" class="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20" title="关闭" @click="previewImage = null">
          <X class="h-5 w-5" />
        </button>
      </div>
      <div class="overflow-hidden rounded-lg border border-white/10 bg-black/50">
        <ImageDisplay :image-url="previewImage" label="参考图" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
