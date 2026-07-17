import axios from 'axios'

export type ProviderId = 'zenmux' | 'gpt-image-2'
export type OutputFormat = 'png' | 'jpeg' | 'webp'
export type ImageQuality = 'auto' | 'low' | 'medium' | 'high'

export type GeneratePayload = {
  prompt: string
  images: string[]
  aspectRatio: string
  imageSize: string
  model: string
  quality?: ImageQuality
  outputFormat?: OutputFormat
}

export type ProviderTimelineItem =
  | {
      kind: 'text'
      text: string
      isThought: boolean
      thoughtSignature?: string
    }
  | {
      kind: 'image'
      imageUrl: string
      mimeType: string
      isThought: boolean
    }

export type ProviderGenerationResult = {
  items: ProviderTimelineItem[]
  finishReason: string | null
  responseId?: string
  modelVersion?: string
  usageMetadata?: Record<string, unknown> | null
  estimatedCost?: number
  operation: 'generate' | 'edit'
}

type GenerateOptions = {
  apiKey: string
  payload: GeneratePayload
}

type RawGeminiPart = {
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

type GptImageData = {
  b64_json?: string
  url?: string
  revised_prompt?: string
}

const ZENMUX_BASE_URL = 'https://zenmux.ai/api/vertex-ai/v1'
export const GPT_IMAGE_BASE_URL = (import.meta.env.VITE_GPT_IMAGE_BASE_URL || 'https://xkj.jisuanyun.vip').replace(/\/+$/, '')
const GPT_IMAGE_REQUEST_BASE_URL = (import.meta.env.VITE_GPT_IMAGE_PROXY_URL || '/gpt-image-api').replace(/\/+$/, '')

export const providerMeta: Record<ProviderId, {
  name: string
  shortName: string
  description: string
  keyLabel: string
  keyPlaceholder: string
}> = {
  zenmux: {
    name: 'ZenMux + Gemini',
    shortName: 'ZenMux',
    description: 'Gemini 原生图像生成，支持 1K 到 4K 与多种画幅。',
    keyLabel: 'ZenMux API Key',
    keyPlaceholder: '输入 ZenMux API Key'
  },
  'gpt-image-2': {
    name: 'GPT Image 2',
    shortName: 'GPT Image 2',
    description: '通过极算云 OpenAI 兼容 Images API 生成或编辑图片。',
    keyLabel: '极算云 API Key',
    keyPlaceholder: '输入 sk- 开头的极算云 API Key'
  }
}

export const zenMuxModels = [
  {
    id: 'google/gemini-3.1-flash-image-preview',
    name: 'Nanobanana 2',
    inputPrice: 0.25,
    outputPrice: 1.5
  },
  {
    id: 'google/gemini-3-pro-image-preview',
    name: 'Nanobanana Pro',
    inputPrice: 2,
    outputPrice: 12
  }
] as const

export const gptImageModels = [
  {
    id: 'gpt-image-2',
    name: 'GPT Image 2'
  }
] as const

const extractMimeType = (dataUrl: string) => dataUrl.match(/^data:([^;,]+)[;,]/)?.[1] || 'image/jpeg'
const extractBase64Data = (dataUrl: string) => dataUrl.split(',')[1] || ''
const buildImageUrl = (mimeType: string, data?: string) => data ? `data:${mimeType};base64,${data}` : null

const estimateGeminiOutputTokens = (imageSize: string) => {
  const baseTokens = 25_000
  if (imageSize === '2K') return baseTokens * 4
  if (imageSize === '4K') return baseTokens * 16
  return baseTokens
}

const dataUrlToFile = async (dataUrl: string, index: number) => {
  const mimeType = extractMimeType(dataUrl)
  const extension = mimeType === 'image/jpeg' ? 'jpg' : (mimeType.split('/')[1] || 'png')
  const blob = await (await fetch(dataUrl)).blob()
  return new File([blob], `reference-${index + 1}.${extension}`, { type: mimeType })
}

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as {
      error?: { message?: string }
      message?: string
      detail?: string
    } | undefined
    return data?.error?.message || data?.message || data?.detail || error.message
  }

  return error instanceof Error ? error.message : '图片生成失败'
}

export const generateWithZenMux = async ({ apiKey, payload }: GenerateOptions): Promise<ProviderGenerationResult> => {
  const parts: Array<Record<string, unknown>> = [{ text: payload.prompt }]

  payload.images.forEach((image) => {
    const data = extractBase64Data(image)
    if (!data) return
    parts.push({
      inlineData: {
        mimeType: extractMimeType(image),
        data
      }
    })
  })

  const response = await axios.post(
    `${ZENMUX_BASE_URL}/models/${payload.model}:generateContent`,
    {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        responseModalities: ['text', 'image'],
        imageConfig: {
          aspectRatio: payload.aspectRatio,
          imageSize: payload.imageSize
        }
      }
    },
    {
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 300_000
    }
  )

  const candidate = response.data?.candidates?.[0]
  const rawParts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts as RawGeminiPart[] : []
  if (!candidate || rawParts.length === 0) {
    throw new Error('ZenMux 响应中没有可用的生成内容')
  }

  const items: ProviderTimelineItem[] = []
  rawParts.forEach((part) => {
    if (part.text?.trim()) {
      items.push({
        kind: 'text',
        text: part.text,
        isThought: Boolean(part.thought),
        thoughtSignature: part.thoughtSignature
      })
    }

    const imagePart = part.inlineData || part.inline_data
    const imageUrl = buildImageUrl(imagePart?.mimeType || 'image/png', imagePart?.data)
    if (imageUrl) {
      items.push({
        kind: 'image',
        imageUrl,
        mimeType: imagePart?.mimeType || 'image/png',
        isThought: Boolean(part.thought)
      })
    }
  })

  const usageMetadata = response.data?.usageMetadata as Record<string, unknown> | undefined
  const inputTokens = Number(usageMetadata?.promptTokenCount) || Math.ceil(payload.prompt.length / 4)
  const outputTokens = Number(usageMetadata?.candidatesTokenCount) || estimateGeminiOutputTokens(payload.imageSize)
  const pricing = zenMuxModels.find((model) => model.id === payload.model)
  const estimatedCost = pricing
    ? (inputTokens / 1_000_000 * pricing.inputPrice) + (outputTokens / 1_000_000 * pricing.outputPrice)
    : undefined

  return {
    items,
    finishReason: candidate.finishReason || null,
    responseId: response.data?.responseId,
    modelVersion: response.data?.modelVersion,
    usageMetadata: usageMetadata || null,
    estimatedCost,
    operation: payload.images.length > 0 ? 'edit' : 'generate'
  }
}

export const generateWithGptImage = async ({ apiKey, payload }: GenerateOptions): Promise<ProviderGenerationResult> => {
  const headers = { Authorization: `Bearer ${apiKey}` }
  let response

  if (payload.images.length > 0) {
    const formData = new FormData()
    formData.append('model', payload.model)
    formData.append('prompt', payload.prompt)
    formData.append('size', payload.imageSize)
    formData.append('quality', payload.quality || 'auto')
    formData.append('output_format', payload.outputFormat || 'png')

    const files = await Promise.all(payload.images.map(dataUrlToFile))
    files.forEach((file) => formData.append('image[]', file))

    response = await axios.post(`${GPT_IMAGE_REQUEST_BASE_URL}/v1/images/edits`, formData, {
      headers,
      timeout: 300_000
    })
  } else {
    response = await axios.post(
      `${GPT_IMAGE_REQUEST_BASE_URL}/v1/images/generations`,
      {
        model: payload.model,
        prompt: payload.prompt,
        size: payload.imageSize,
        quality: payload.quality || 'auto',
        output_format: payload.outputFormat || 'png',
        n: 1
      },
      {
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        timeout: 300_000
      }
    )
  }

  const format = payload.outputFormat || 'png'
  const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`
  const data = Array.isArray(response.data?.data) ? response.data.data as GptImageData[] : []
  const items: ProviderTimelineItem[] = []

  data.forEach((item) => {
    if (item.revised_prompt?.trim()) {
      items.push({ kind: 'text', text: item.revised_prompt, isThought: false })
    }

    const imageUrl = item.b64_json ? buildImageUrl(mimeType, item.b64_json) : item.url
    if (imageUrl) {
      items.push({ kind: 'image', imageUrl, mimeType, isThought: false })
    }
  })

  if (!items.some((item) => item.kind === 'image')) {
    throw new Error('GPT Image 2 响应中没有图片数据')
  }

  return {
    items,
    finishReason: 'completed',
    responseId: response.headers['x-request-id'] || response.data?.id,
    modelVersion: payload.model,
    usageMetadata: response.data?.usage || null,
    operation: payload.images.length > 0 ? 'edit' : 'generate'
  }
}

export const generateImage = (provider: ProviderId, options: GenerateOptions) => {
  return provider === 'zenmux' ? generateWithZenMux(options) : generateWithGptImage(options)
}
