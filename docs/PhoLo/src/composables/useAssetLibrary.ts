import { computed, onBeforeUnmount, ref } from 'vue'
import { readImageDimensions, type ImageDimensions } from '../core/imageMetadata'
import { fileKey, mergeUploadedAssets, previewEdgeForCount } from '../core/library'
import { makeSampleImages } from '../samples'
import type { AssetImage, LibraryMode, PreviewWorkerResponse } from '../types'

interface PreviewResult extends ImageDimensions {
  preview: Blob | null
}

interface DecodeResult {
  asset: AssetImage | null
  failed: boolean
}

interface PendingPreview {
  resolve: (result: PreviewResult | null) => void
  reject: (error: Error) => void
}

function blobFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Preview encoding failed')), 'image/webp', 0.88))
}

function resizeOptions(dimensions: ImageDimensions, maxEdge: number): ImageBitmapOptions {
  return dimensions.width >= dimensions.height
    ? { resizeWidth: maxEdge, resizeQuality: 'high', imageOrientation: 'from-image' }
    : { resizeHeight: maxEdge, resizeQuality: 'high', imageOrientation: 'from-image' }
}

async function previewOnMain(file: File, maxEdge: number): Promise<PreviewResult> {
  const dimensions = await readImageDimensions(file)
  if (dimensions && Math.max(dimensions.width, dimensions.height) <= maxEdge) return { ...dimensions, preview: null }

  if ('createImageBitmap' in window) {
    const bitmap = await createImageBitmap(file, dimensions ? resizeOptions(dimensions, maxEdge) : undefined)
    try {
      const sourceDimensions = dimensions ?? { width: bitmap.width, height: bitmap.height }
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const context = canvas.getContext('2d', { alpha: false })
      if (!context) throw new Error('Preview canvas is unavailable')
      context.drawImage(bitmap, 0, 0)
      return { ...sourceDimensions, preview: await blobFromCanvas(canvas) }
    } finally {
      bitmap.close()
    }
  }

  const objectUrl = URL.createObjectURL(file)
  const image = new Image()
  image.decoding = 'async'
  try {
    image.src = objectUrl
    await image.decode()
    const sourceDimensions = dimensions ?? { width: image.naturalWidth, height: image.naturalHeight }
    const ratio = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio))
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) throw new Error('Preview canvas is unavailable')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return { ...sourceDimensions, preview: await blobFromCanvas(canvas) }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function useAssetLibrary() {
  const assets = ref<AssetImage[]>([])
  const mode = ref<LibraryMode>('empty')
  const decoding = ref(false)
  const enabledAssets = computed(() => assets.value.filter((asset) => asset.enabled))
  const pendingPreviews = new Map<number, PendingPreview>()
  let previewWorker: Worker | null = null
  let previewWorkerUnavailable = false
  let previewRequestId = 0

  const release = (asset: AssetImage) => { if (asset.origin === 'user' && asset.src.startsWith('blob:')) URL.revokeObjectURL(asset.src) }
  const releaseAll = (items = assets.value) => items.forEach(release)

  const fallBackPendingPreviews = () => {
    previewWorker?.terminate()
    previewWorker = null
    previewWorkerUnavailable = true
    pendingPreviews.forEach(({ resolve }) => resolve(null))
    pendingPreviews.clear()
  }

  const ensurePreviewWorker = (): Worker | null => {
    if (previewWorkerUnavailable) return null
    if (previewWorker) return previewWorker
    try {
      previewWorker = new Worker(new URL('../workers/preview.worker.ts', import.meta.url), { type: 'module' })
      previewWorker.addEventListener('message', (event: MessageEvent<PreviewWorkerResponse>) => {
        const pending = pendingPreviews.get(event.data.requestId)
        if (!pending) return
        if (event.data.type === 'unsupported') {
          fallBackPendingPreviews()
          return
        }
        pendingPreviews.delete(event.data.requestId)
        if (event.data.type === 'error') pending.reject(new Error('Image decode failed'))
        else pending.resolve({ width: event.data.width, height: event.data.height, preview: event.data.preview })
      })
      previewWorker.addEventListener('error', fallBackPendingPreviews)
      return previewWorker
    } catch {
      previewWorkerUnavailable = true
      return null
    }
  }

  const createPreview = async (file: File, maxEdge: number): Promise<PreviewResult> => {
    const worker = ensurePreviewWorker()
    if (!worker) return previewOnMain(file, maxEdge)
    const requestId = ++previewRequestId
    const result = await new Promise<PreviewResult | null>((resolve, reject) => {
      pendingPreviews.set(requestId, { resolve, reject })
      worker.postMessage({ requestId, file, maxEdge })
    })
    return result ?? previewOnMain(file, maxEdge)
  }

  const decodeFile = async (file: File, index: number, maxEdge: number): Promise<DecodeResult> => {
    try {
      const result = await createPreview(file, maxEdge)
      return {
        failed: false,
        asset: {
          id: `user-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name.replace(/\.[^.]+$/, ''), width: result.width, height: result.height,
          aspect: result.width / result.height, weight: 1, enabled: true,
          src: URL.createObjectURL(result.preview ?? file), file, origin: 'user', fileKey: fileKey(file),
        },
      }
    } catch {
      return { asset: null, failed: true }
    }
  }

  const loadDemo = () => {
    releaseAll()
    assets.value = makeSampleImages()
    mode.value = 'demo'
  }

  const clear = () => {
    releaseAll()
    assets.value = []
    mode.value = 'empty'
  }

  const remove = (id: string) => {
    const target = assets.value.find((asset) => asset.id === id)
    if (target) release(target)
    assets.value = assets.value.filter((asset) => asset.id !== id)
    if (assets.value.length === 0) mode.value = 'empty'
  }

  const toggle = (id: string) => {
    const target = assets.value.find((asset) => asset.id === id)
    if (target) target.enabled = !target.enabled
  }

  const addFiles = async (input: FileList | File[]) => {
    const imageFiles = Array.from(input).filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length === 0) return { added: 0, ignored: 0, failed: input.length }

    const known = new Set(mode.value === 'demo' ? [] : assets.value.map((asset) => asset.fileKey).filter(Boolean))
    const files: File[] = []
    let ignored = 0
    imageFiles.forEach((file) => {
      const key = fileKey(file)
      if (known.has(key)) ignored += 1
      else {
        known.add(key)
        files.push(file)
      }
    })
    if (files.length === 0) return { added: 0, ignored, failed: 0 }

    const finalCount = (mode.value === 'demo' ? 0 : assets.value.length) + files.length
    const maxEdge = previewEdgeForCount(finalCount)
    const concurrency = Math.min(4, Math.max(2, Math.floor((navigator.hardwareConcurrency || 4) / 2)))
    const decoded: DecodeResult[] = []
    decoding.value = true
    try {
      for (let index = 0; index < files.length; index += concurrency) {
        decoded.push(...await Promise.all(files.slice(index, index + concurrency).map((file, batchIndex) => decodeFile(file, index + batchIndex, maxEdge))))
        if (index + concurrency < files.length) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      }
    } finally {
      decoding.value = false
    }

    const valid = decoded.map((item) => item.asset).filter((asset): asset is AssetImage => Boolean(asset))
    const merged = mergeUploadedAssets(assets.value, valid, mode.value)
    const acceptedIds = new Set(merged.assets.map((asset) => asset.id))
    valid.filter((asset) => !acceptedIds.has(asset.id)).forEach(release)
    if (merged.replacedDemo) releaseAll(assets.value)
    assets.value = merged.assets
    mode.value = merged.mode
    return {
      added: valid.length - merged.ignored,
      ignored: ignored + merged.ignored,
      failed: decoded.filter((item) => item.failed).length,
    }
  }

  onBeforeUnmount(() => {
    previewWorker?.terminate()
    pendingPreviews.forEach(({ reject }) => reject(new Error('Preview worker stopped')))
    pendingPreviews.clear()
    releaseAll()
  })
  return { assets, mode, decoding, enabledAssets, loadDemo, clear, remove, toggle, addFiles }
}
