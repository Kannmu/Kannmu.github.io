<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  DollarSign,
  Image as ImageIcon,
  MessageSquareText,
  Server,
  Sparkles
} from 'lucide-vue-next'
import ApiKeyInput from './components/ApiKeyInput.vue'
import ImageDisplay from './components/ImageDisplay.vue'
import ImageGenerator from './components/ImageGenerator.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import {
  GPT_IMAGE_BASE_URL,
  generateImage,
  getApiErrorMessage,
  providerMeta,
  type GeneratePayload,
  type OutputFormat,
  type ProviderId,
  type ProviderTimelineItem
} from './services/imageProviders'

type TimelineTextItem = {
  id: string
  kind: 'text'
  text: string
  isThought: boolean
  thoughtSignature?: string
}

type TimelineImageItem = {
  id: string
  kind: 'image'
  imageUrl: string
  mimeType: string
  isThought: boolean
  isFinal: boolean
}

type TimelineItem = TimelineTextItem | TimelineImageItem

type GenerationRecord = {
  id: string
  provider: ProviderId
  prompt: string
  model: string
  aspectRatio: string
  imageSize: string
  quality?: string
  outputFormat?: OutputFormat
  operation: 'generate' | 'edit'
  status: 'streaming' | 'completed' | 'failed'
  items: TimelineItem[]
  error: string | null
  finishReason: string | null
  createdAt: string
  updatedAt: string
  responseId?: string
  modelVersion?: string
  usageMetadata?: Record<string, unknown> | null
}

const selectedProvider = useStorage<ProviderId>('genimage-provider', 'zenmux')
const zenMuxApiKey = useStorage('zenmux-api-key', '')
const gptImageApiKey = useStorage('gpt-image-2-api-key', '')
const providerOptions: ProviderId[] = ['zenmux', 'gpt-image-2']
const loading = ref(false)
const loadingProvider = ref<ProviderId | null>(null)
const error = ref<string | null>(null)
const zenMuxTotalCost = ref(0)
const generations = ref<GenerationRecord[]>([])

const activeApiKey = computed({
  get: () => selectedProvider.value === 'zenmux' ? zenMuxApiKey.value : gptImageApiKey.value,
  set: (value: string) => {
    if (selectedProvider.value === 'zenmux') zenMuxApiKey.value = value
    else gptImageApiKey.value = value
  }
})

const activeProviderMeta = computed(() => providerMeta[selectedProvider.value])
const apiReady = computed(() => Boolean(activeApiKey.value.trim()))
const visibleGenerations = computed(() => generations.value.filter((record) => record.provider === selectedProvider.value))
const latestGeneration = computed(() => visibleGenerations.value[0] || null)
const latestFinalImage = computed(() => {
  const images = latestGeneration.value?.items.filter((item): item is TimelineImageItem => item.kind === 'image') || []
  return images.length > 0 ? images[images.length - 1] : null
})

watch(selectedProvider, () => {
  error.value = null
})

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const normalizeTimelineItems = (providerItems: ProviderTimelineItem[]) => {
  const items: TimelineItem[] = providerItems.map((item) => item.kind === 'text'
    ? {
        id: createId('text'),
        kind: 'text',
        text: item.text,
        isThought: item.isThought,
        thoughtSignature: item.thoughtSignature
      }
    : {
        id: createId('image'),
        kind: 'image',
        imageUrl: item.imageUrl,
        mimeType: item.mimeType,
        isThought: item.isThought,
        isFinal: false
      })

  const lastImage = [...items].reverse().find((item): item is TimelineImageItem => item.kind === 'image')
  if (lastImage) lastImage.isFinal = true
  return items
}

const updateGeneration = (id: string, updater: (record: GenerationRecord) => void) => {
  const target = generations.value.find((record) => record.id === id)
  if (!target) return
  updater(target)
  target.updatedAt = new Date().toISOString()
}

const handleGenerate = async (payload: GeneratePayload) => {
  const provider = selectedProvider.value
  const apiKey = activeApiKey.value.trim()

  if (!apiKey) {
    error.value = `请先填写 ${providerMeta[provider].keyLabel}`
    return
  }

  loading.value = true
  loadingProvider.value = provider
  error.value = null

  const now = new Date().toISOString()
  const recordId = createId('generation')
  generations.value.unshift({
    id: recordId,
    provider,
    prompt: payload.prompt,
    model: payload.model,
    aspectRatio: payload.aspectRatio,
    imageSize: payload.imageSize,
    quality: payload.quality,
    outputFormat: payload.outputFormat,
    operation: payload.images.length > 0 ? 'edit' : 'generate',
    status: 'streaming',
    items: [{
      id: createId('text'),
      kind: 'text',
      text: provider === 'zenmux' ? '正在等待 Gemini 返回内容…' : '正在等待 GPT Image 2 完成图片处理…',
      isThought: true
    }],
    error: null,
    finishReason: null,
    createdAt: now,
    updatedAt: now,
    usageMetadata: null
  })

  try {
    const result = await generateImage(provider, { apiKey, payload })
    const items = normalizeTimelineItems(result.items)
    if (!items.some((item) => item.kind === 'image')) {
      throw new Error('API 响应中没有可显示的图片')
    }

    if (provider === 'zenmux' && result.estimatedCost) {
      zenMuxTotalCost.value += result.estimatedCost
    }

    updateGeneration(recordId, (record) => {
      record.items = items
      record.status = 'completed'
      record.operation = result.operation
      record.error = null
      record.finishReason = result.finishReason
      record.responseId = result.responseId
      record.modelVersion = result.modelVersion
      record.usageMetadata = result.usageMetadata || null
    })
  } catch (caughtError) {
    let message = getApiErrorMessage(caughtError)
    if (message === 'Network Error') {
      message = `无法连接 ${providerMeta[provider].shortName} API，请检查网络或服务端 CORS 配置。`
    }

    updateGeneration(recordId, (record) => {
      record.items = [{ id: createId('text'), kind: 'text', text: message, isThought: false }]
      record.status = 'failed'
      record.error = message
    })
    error.value = message
  } finally {
    loading.value = false
    loadingProvider.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f6f7f8] text-gray-950 selection:bg-blue-100 selection:text-blue-950">
    <header class="border-b border-gray-200 bg-white">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-950">Kannmu Image Studio</h1>
          <p class="mt-1 text-sm text-gray-500">AI 图片生成与编辑</p>
        </div>
        <div v-if="loadingProvider" class="flex items-center gap-2 text-sm font-medium text-gray-600">
          <LoadingSpinner />
          <span class="hidden sm:inline">{{ providerMeta[loadingProvider].shortName }} 正在处理</span>
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section aria-label="API 提供商" class="space-y-3">
        <div class="text-sm font-medium text-gray-700">API 提供商</div>
        <div class="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-white p-1.5" role="tablist">
          <button
            v-for="provider in providerOptions"
            :key="provider"
            type="button"
            role="tab"
            :aria-selected="selectedProvider === provider"
            :class="[
              'flex min-h-14 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition sm:text-base',
              selectedProvider === provider
                ? (provider === 'zenmux' ? 'bg-blue-600 text-white shadow-sm' : 'bg-emerald-700 text-white shadow-sm')
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
            @click="selectedProvider = provider"
          >
            <Cloud v-if="provider === 'zenmux'" class="h-5 w-5 shrink-0" />
            <Sparkles v-else class="h-5 w-5 shrink-0" />
            <span>{{ providerMeta[provider].name }}</span>
          </button>
        </div>
      </section>

      <section class="grid gap-5 border-y border-gray-200 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <ApiKeyInput
          v-model="activeApiKey"
          :label="activeProviderMeta.keyLabel"
          :placeholder="activeProviderMeta.keyPlaceholder"
          description="API Key 仅保存在当前浏览器的本地存储中，不会写入项目文件。"
        />

        <div class="flex min-h-24 items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div :class="['rounded-lg p-2.5', selectedProvider === 'zenmux' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700']">
            <DollarSign v-if="selectedProvider === 'zenmux'" class="h-5 w-5" />
            <Server v-else class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <template v-if="selectedProvider === 'zenmux'">
              <div class="text-xs font-medium uppercase text-gray-400">本次会话预估</div>
              <div class="mt-1 text-xl font-bold text-gray-950">${{ zenMuxTotalCost.toFixed(6) }}</div>
            </template>
            <template v-else>
              <div class="text-xs font-medium uppercase text-gray-400">Base URL</div>
              <div class="mt-1 break-all text-sm font-semibold text-gray-800">{{ GPT_IMAGE_BASE_URL }}</div>
            </template>
          </div>
          <CheckCircle2 v-if="apiReady" class="ml-auto h-5 w-5 shrink-0 text-emerald-600" aria-label="API Key 已填写" />
        </div>
      </section>

      <section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <ImageGenerator
          :key="selectedProvider"
          :loading="loading"
          :provider="selectedProvider"
          :ready="apiReady"
          @generate="handleGenerate"
        />
      </section>

      <div v-if="error" class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
        <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />
        <span class="break-words text-sm font-medium">{{ error }}</span>
      </div>

      <section v-if="latestGeneration" class="space-y-5">
        <div class="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-950">最近一次结果</h2>
            <p class="mt-1 text-sm text-gray-500">{{ latestGeneration.operation === 'edit' ? '图片编辑' : '图片生成' }}</p>
          </div>
          <div class="flex flex-wrap gap-2 text-xs font-medium">
            <span class="rounded-full bg-gray-200 px-3 py-1 text-gray-700">{{ latestGeneration.model }}</span>
            <span class="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{{ latestGeneration.imageSize }}</span>
            <span v-if="latestGeneration.quality" class="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{{ latestGeneration.quality }}</span>
            <span v-if="latestGeneration.outputFormat" class="rounded-full bg-amber-50 px-3 py-1 uppercase text-amber-800">{{ latestGeneration.outputFormat }}</span>
          </div>
        </div>

        <article class="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-blue-800">
            <Sparkles class="h-4 w-4" />
            <span>Prompt</span>
          </div>
          <p class="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-blue-950">{{ latestGeneration.prompt }}</p>
        </article>

        <template v-for="item in latestGeneration.items" :key="item.id">
          <article v-if="item.kind === 'text'" :class="['rounded-lg border p-4', item.isThought ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white']">
            <div :class="['flex items-center gap-2 text-sm font-semibold', item.isThought ? 'text-amber-800' : 'text-gray-700']">
              <MessageSquareText class="h-4 w-4" />
              <span>{{ item.isThought ? '处理状态' : '模型文本' }}</span>
            </div>
            <div class="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">{{ item.text }}</div>
          </article>

          <article v-else class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <ImageIcon class="h-4 w-4" />
                <span>{{ item.isFinal ? '最终结果' : '中间图片' }}</span>
              </div>
              <div class="flex flex-wrap gap-2 text-xs font-medium">
                <span v-if="item.isFinal" class="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Final</span>
                <span class="rounded-full bg-gray-100 px-3 py-1 text-gray-600">{{ item.mimeType }}</span>
              </div>
            </div>
            <ImageDisplay :image-url="item.imageUrl" :label="item.isFinal ? '最终结果' : '中间结果'" />
          </article>
        </template>

        <div v-if="latestGeneration.usageMetadata || latestGeneration.responseId || latestGeneration.modelVersion" class="grid gap-3 md:grid-cols-3">
          <div v-if="latestGeneration.modelVersion" class="rounded-lg border border-gray-200 bg-white p-4">
            <div class="text-xs font-medium uppercase text-gray-400">Model</div>
            <div class="mt-2 break-all text-sm font-medium text-gray-800">{{ latestGeneration.modelVersion }}</div>
          </div>
          <div v-if="latestGeneration.responseId" class="rounded-lg border border-gray-200 bg-white p-4">
            <div class="text-xs font-medium uppercase text-gray-400">Request ID</div>
            <div class="mt-2 break-all text-sm font-medium text-gray-800">{{ latestGeneration.responseId }}</div>
          </div>
          <div v-if="latestGeneration.usageMetadata" class="rounded-lg border border-gray-200 bg-white p-4">
            <div class="text-xs font-medium uppercase text-gray-400">Usage</div>
            <pre class="mt-2 whitespace-pre-wrap break-words text-xs leading-5 text-gray-700">{{ JSON.stringify(latestGeneration.usageMetadata, null, 2) }}</pre>
          </div>
        </div>

        <div v-if="latestFinalImage" class="flex items-center gap-2 text-sm text-emerald-800">
          <CheckCircle2 class="h-4 w-4" />
          <span>图片已准备好，可下载、复制或全屏查看。</span>
        </div>
      </section>
    </main>

    <footer class="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
      Kannmu · ZenMux 与 GPT Image 2 双提供商
    </footer>
  </div>
</template>
