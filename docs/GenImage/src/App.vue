<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import ApiKeyInput from './components/ApiKeyInput.vue'
import ImageGenerator from './components/ImageGenerator.vue'
import ImageDisplay from './components/ImageDisplay.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { AlertCircle, DollarSign, Image as ImageIcon, MessageSquareText, Sparkles } from 'lucide-vue-next'

type GeneratePayload = {
  prompt: string
  image: string | null
  aspectRatio: string
  imageSize: string
  model: string
}

type RawPart = {
  text?: string
  thought?: boolean
  thoughtSignature?: string
  inlineData?: {
    mimeType?: string
    data?: string
  }
  inline_data?: {
    mimeType?: string
    data?: string
  }
}

type Candidate = {
  content?: {
    role?: string
    parts?: RawPart[]
  }
  finishReason?: string
}

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
  prompt: string
  model: string
  aspectRatio: string
  imageSize: string
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

const apiKey = useStorage('zenmux-api-key', '')
const loading = ref(false)
const error = ref<string | null>(null)
const totalCost = ref(0)
const activeRequestId = ref(0)
const generations = ref<GenerationRecord[]>([])

const models: Record<string, { input: number, output: number }> = {
  'google/gemini-3.1-flash-image-preview': { input: 0.25, output: 1.5 },
  'google/gemini-3-pro-image-preview': { input: 2.0, output: 12.0 }
}

const latestGeneration = computed(() => generations.value[0] ?? null)
const latestFinalImage = computed(() => {
  const generation = latestGeneration.value
  if (!generation) return null
  const images = generation.items.filter((item): item is TimelineImageItem => item.kind === 'image')
  return images.length > 0 ? images[images.length - 1] : null
})

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const extractMimeType = (dataUrl: string) => dataUrl.split(';')[0]?.split(':')[1] || 'image/jpeg'
const extractBase64Data = (dataUrl: string) => dataUrl.split(',')[1] || ''

const buildImageUrl = (mimeType: string | undefined, data: string | undefined) => {
  if (!data) return null
  return `data:${mimeType || 'image/png'};base64,${data}`
}

const markLastImageAsFinal = (items: TimelineItem[]) => {
  let latestImageIndex = -1

  items.forEach((item, index) => {
    if (item.kind === 'image') {
      latestImageIndex = index
      item.isFinal = false
    }
  })

  if (latestImageIndex >= 0) {
    const target = items[latestImageIndex]
    if (target && target.kind === 'image') {
      target.isFinal = true
    }
  }
}

const buildTimelineItems = (parts: RawPart[]) => {
  const items: TimelineItem[] = []

  parts.forEach((part) => {
    const text = typeof part.text === 'string' ? part.text : ''
    if (text.trim()) {
      items.push({
        id: createId('text'),
        kind: 'text',
        text,
        isThought: Boolean(part.thought),
        thoughtSignature: part.thoughtSignature
      })
    }

    const imagePart = part.inlineData || part.inline_data
    if (imagePart?.data) {
      const imageUrl = buildImageUrl(imagePart.mimeType, imagePart.data)
      if (imageUrl) {
        items.push({
          id: createId('image'),
          kind: 'image',
          imageUrl,
          mimeType: imagePart.mimeType || 'image/png',
          isThought: Boolean(part.thought),
          isFinal: false
        })
      }
    }
  })

  markLastImageAsFinal(items)
  return items
}

const estimateFallbackOutputTokens = (imageSize: string) => {
  const baseTokens = 25000
  if (imageSize === '2K') return baseTokens * 4
  if (imageSize === '4K') return baseTokens * 16
  return baseTokens
}

const buildErrorMessage = (err: any) => err?.response?.data?.error?.message || err?.message || 'Failed to generate image'

const updateGeneration = (id: string, updater: (record: GenerationRecord) => void) => {
  const target = generations.value.find((item) => item.id === id)
  if (!target) return
  updater(target)
  target.updatedAt = new Date().toISOString()
}

const handleGenerate = async ({ prompt, image, aspectRatio, imageSize, model }: GeneratePayload) => {
  loading.value = true
  error.value = null
  const requestId = ++activeRequestId.value

  const recordId = createId('generation')
  generations.value.unshift({
    id: recordId,
    prompt,
    model,
    aspectRatio,
    imageSize,
    status: 'streaming',
    items: [],
    error: null,
    finishReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageMetadata: null
  })

  updateGeneration(recordId, (record) => {
    record.items.push({
      id: createId('text'),
      kind: 'text',
      text: '正在等待模型返回内容…',
      isThought: true
    })
  })

  try {
    const parts: Array<Record<string, unknown>> = [{ text: prompt }]

    if (image) {
      const base64Data = extractBase64Data(image)
      const mimeType = extractMimeType(image)
      if (base64Data) {
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data
          }
        })
      }
    }

    const response = await axios.post(
      `https://zenmux.ai/api/vertex-ai/v1/models/${model}:generateContent`,
      {
        contents: [
          {
            role: 'user',
            parts
          }
        ],
        generationConfig: {
          responseModalities: ['text', 'image'],
          imageConfig: {
            aspectRatio,
            imageSize
          }
        }
      },
      {
        headers: {
          'x-goog-api-key': apiKey.value,
          'Content-Type': 'application/json'
        }
      }
    )

    const usageMetadata = response.data?.usageMetadata
    const inputTokens = usageMetadata?.promptTokenCount || Math.ceil(prompt.length / 4)
    const outputTokens = usageMetadata?.candidatesTokenCount || estimateFallbackOutputTokens(imageSize)
    const modelPricing = models[model]

    if (modelPricing) {
      const cost = (inputTokens / 1_000_000 * modelPricing.input) + (outputTokens / 1_000_000 * modelPricing.output)
      totalCost.value += cost
    }

    const candidates = Array.isArray(response.data?.candidates) ? response.data.candidates as Candidate[] : []
    if (candidates.length === 0) {
      throw new Error('No candidates in response')
    }

    const candidate = candidates[0]
    if (!candidate) {
      throw new Error('Candidate is empty')
    }
    const responseParts = Array.isArray(candidate.content?.parts) ? candidate.content?.parts : []
    if (!responseParts.length) {
      throw new Error('Response content is empty')
    }

    const timelineItems = buildTimelineItems(responseParts)
    const hasImage = timelineItems.some((item) => item.kind === 'image')
    if (!hasImage) {
      const textMessage = timelineItems.find((item): item is TimelineTextItem => item.kind === 'text' && Boolean(item.text.trim()))
      throw new Error(textMessage?.text || 'No image generated. The model might have refused the request.')
    }

    updateGeneration(recordId, (record) => {
      record.items = timelineItems
      record.status = 'completed'
      record.error = null
      record.finishReason = candidate.finishReason || null
      record.responseId = response.data?.responseId
      record.modelVersion = response.data?.modelVersion
      record.usageMetadata = usageMetadata || null
    })
  } catch (err: any) {
    const message = buildErrorMessage(err)
    updateGeneration(recordId, (record) => {
      const existingText = record.items.filter((item): item is TimelineTextItem => item.kind === 'text' && item.text !== '正在等待模型返回内容…')
      record.items = existingText.length > 0 ? existingText : [{
        id: createId('text'),
        kind: 'text',
        text: message,
        isThought: false
      }]
      record.status = 'failed'
      record.error = message
    })
    error.value = message
  } finally {
    if (requestId === activeRequestId.value) {
      loading.value = false
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
    <header class="text-center mb-12 animate-fade-in-down">
      <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
        Google Nanobanana Pro
      </h1>
      <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Experience the next generation of AI image creation.
      </p>
    </header>

    <main class="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div class="flex flex-col gap-4">
        <ApiKeyInput v-model="apiKey" />

        <div v-if="apiKey" class="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2 text-gray-600">
            <DollarSign class="w-5 h-5 text-green-600" />
            <span class="font-medium">Session Cost</span>
          </div>
          <div class="text-xl font-bold text-gray-900">
            ${{ totalCost.toFixed(6) }}
          </div>
        </div>
      </div>

      <div v-if="apiKey" class="bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100">
        <ImageGenerator
          :loading="loading"
          @generate="handleGenerate"
        />

        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 animate-shake">
          <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span class="text-sm font-medium">{{ error }}</span>
        </div>

        <div v-if="loading" class="mt-12 flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner />
          <p class="text-gray-400 text-sm font-medium animate-pulse">正在接收模型生成内容…</p>
        </div>

        <section v-if="latestGeneration" class="mt-10 space-y-5">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">生成时间线</h2>
              <p class="text-sm text-gray-500 mt-1">按模型返回顺序展示思考文本、中间图片与最终结果。</p>
            </div>
            <div class="flex items-center gap-2 text-xs font-medium">
              <span class="px-3 py-1 rounded-full bg-gray-100 text-gray-600">{{ latestGeneration.model }}</span>
              <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700">{{ latestGeneration.imageSize }}</span>
              <span class="px-3 py-1 rounded-full bg-purple-50 text-purple-700">{{ latestGeneration.aspectRatio }}</span>
            </div>
          </div>

          <div class="rounded-3xl border border-gray-200 bg-gray-50/70 overflow-hidden">
            <div class="max-h-[70vh] overflow-y-auto p-4 sm:p-6 space-y-4">
              <div class="rounded-2xl border border-blue-100 bg-blue-50/80 p-4">
                <div class="flex items-center gap-2 text-blue-800 font-medium text-sm">
                  <Sparkles class="w-4 h-4" />
                  <span>Prompt</span>
                </div>
                <p class="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-blue-950">{{ latestGeneration.prompt }}</p>
              </div>

              <template v-for="item in latestGeneration.items" :key="item.id">
                <article
                  v-if="item.kind === 'text'"
                  :class="[
                    'rounded-2xl border p-4 shadow-sm',
                    item.isThought ? 'border-amber-100 bg-amber-50/90' : 'border-gray-200 bg-white'
                  ]"
                >
                  <div class="flex items-center gap-2 text-sm font-medium" :class="item.isThought ? 'text-amber-800' : 'text-gray-700'">
                    <MessageSquareText class="w-4 h-4" />
                    <span>{{ item.isThought ? '模型思考' : '模型文本' }}</span>
                    <span v-if="item.thoughtSignature" class="text-[11px] px-2 py-0.5 rounded-full bg-white/80 text-gray-500">{{ item.thoughtSignature }}</span>
                  </div>
                  <div class="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">{{ item.text }}</div>
                </article>

                <article v-else class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
                  <div class="flex items-center justify-between gap-3 flex-wrap">
                    <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <ImageIcon class="w-4 h-4" />
                      <span>{{ item.isFinal ? '最终结果' : (item.isThought ? '中间图片（思考阶段）' : '中间图片') }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs font-medium flex-wrap">
                      <span v-if="item.isFinal" class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Final</span>
                      <span class="px-3 py-1 rounded-full bg-gray-100 text-gray-600">{{ item.mimeType }}</span>
                    </div>
                  </div>

                  <ImageDisplay
                    :image-url="item.imageUrl"
                    :label="item.isFinal ? '最终结果' : '中间结果'"
                  />
                </article>
              </template>
            </div>
          </div>

          <div v-if="latestGeneration.usageMetadata || latestGeneration.finishReason || latestGeneration.modelVersion || latestGeneration.responseId" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div v-if="latestGeneration.finishReason" class="rounded-2xl border border-gray-200 bg-white p-4">
              <div class="text-xs uppercase tracking-wide text-gray-400">Finish Reason</div>
              <div class="mt-2 text-sm font-medium text-gray-800">{{ latestGeneration.finishReason }}</div>
            </div>
            <div v-if="latestGeneration.modelVersion" class="rounded-2xl border border-gray-200 bg-white p-4">
              <div class="text-xs uppercase tracking-wide text-gray-400">Model Version</div>
              <div class="mt-2 text-sm font-medium text-gray-800 break-all">{{ latestGeneration.modelVersion }}</div>
            </div>
            <div v-if="latestGeneration.responseId" class="rounded-2xl border border-gray-200 bg-white p-4">
              <div class="text-xs uppercase tracking-wide text-gray-400">Response ID</div>
              <div class="mt-2 text-sm font-medium text-gray-800 break-all">{{ latestGeneration.responseId }}</div>
            </div>
            <div v-if="latestGeneration.usageMetadata" class="rounded-2xl border border-gray-200 bg-white p-4">
              <div class="text-xs uppercase tracking-wide text-gray-400">Usage</div>
              <pre class="mt-2 text-xs leading-5 text-gray-700 whitespace-pre-wrap break-words">{{ JSON.stringify(latestGeneration.usageMetadata, null, 2) }}</pre>
            </div>
          </div>

          <div v-if="latestFinalImage" class="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-800">
            当前已自动将最后一张图片标记为最终结果，下载和复制都会基于该图片的原始分辨率进行处理。
          </div>
        </section>
      </div>
    </main>

    <footer class="mt-auto py-8 text-center text-gray-400 text-sm">
      <p>&copy; {{ new Date().getFullYear() }} Kannmu. Powered by ZenMux & Google Gemini.</p>
    </footer>
  </div>
</template>

<style>
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out;
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
