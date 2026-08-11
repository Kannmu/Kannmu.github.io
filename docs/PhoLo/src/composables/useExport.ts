import { onBeforeUnmount, ref, type Ref } from 'vue'
import type { AssetImage, ExportAction, ExportFormat, ExportSize, LayoutResult } from '../types'

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function fileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

interface DecodedSource {
  image: CanvasImageSource
  close: () => void
}

async function imageSource(asset: AssetImage, width: number, height: number, native: boolean): Promise<DecodedSource> {
  if (asset.file && 'createImageBitmap' in window) {
    const needsDownsample = !native && (width < asset.width || height < asset.height)
    const options: ImageBitmapOptions | undefined = needsDownsample
      ? asset.aspect >= 1
        ? { resizeWidth: Math.max(1, Math.ceil(width)), resizeQuality: 'high', imageOrientation: 'from-image' }
        : { resizeHeight: Math.max(1, Math.ceil(height)), resizeQuality: 'high', imageOrientation: 'from-image' }
      : undefined
    const bitmap = await createImageBitmap(asset.file, options)
    return { image: bitmap, close: () => bitmap.close() }
  }
  const image = new Image()
  image.decoding = 'async'
  const objectUrl = asset.file ? URL.createObjectURL(asset.file) : null
  try {
    image.src = objectUrl ?? asset.src
    await image.decode()
    return { image, close: () => { if (objectUrl) URL.revokeObjectURL(objectUrl) } }
  } catch (error) {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    throw error
  }
}

async function svgBlob(result: LayoutResult, assets: Map<string, AssetImage>, size: ExportSize): Promise<Blob> {
  const parts: BlobPart[] = [`<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${result.canvasWidth} ${result.canvasHeight}"><rect width="100%" height="100%" fill="#111211"/>`]
  for (const rect of result.rects) {
    const asset = assets.get(rect.id)
    if (!asset) continue
    const href = asset.file ? await fileAsDataUrl(asset.file) : asset.src
    parts.push(`<image href="${href}" x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" preserveAspectRatio="xMidYMid meet"/>`)
  }
  parts.push('</svg>')
  return new Blob(parts, { type: 'image/svg+xml' })
}

async function rasterBlob(result: LayoutResult, assets: Map<string, AssetImage>, format: Exclude<ExportFormat, 'svg'>, size: ExportSize): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) throw new Error('Export canvas is unavailable')
  context.fillStyle = '#111211'
  context.fillRect(0, 0, canvas.width, canvas.height)
  const scaleX = canvas.width / result.canvasWidth
  const scaleY = canvas.height / result.canvasHeight

  let nextRect = 0
  const renderNext = async () => {
    while (nextRect < result.rects.length) {
      const rect = result.rects[nextRect++]!
      const asset = assets.get(rect.id)
      if (!asset) continue
      const width = rect.width * scaleX
      const height = rect.height * scaleY
      const source = await imageSource(asset, width, height, size.native)
      try {
        context.drawImage(source.image, rect.x * scaleX, rect.y * scaleY, width, height)
      } finally {
        source.close()
      }
    }
  }
  const concurrency = Math.min(size.native ? 2 : 4, result.rects.length)
  const renders = await Promise.allSettled(Array.from({ length: concurrency }, renderNext))
  const failure = renders.find((render) => render.status === 'rejected')
  if (failure?.status === 'rejected') throw failure.reason

  const mime = format === 'jpeg' ? 'image/jpeg' : `image/${format}`
  return new Promise((resolve, reject) => canvas.toBlob(
    (value) => value ? resolve(value) : reject(new Error('Export encoding failed')),
    mime,
    format === 'jpeg' ? 0.94 : undefined,
  ))
}

interface CachedRender {
  result: LayoutResult
  key: string
  promise: Promise<Blob>
}

export function useExport(assets: Ref<AssetImage[]>) {
  const exporting = ref(false)
  const activeAction = ref<ExportAction | null>(null)
  let cachedRender: CachedRender | null = null
  let cacheTimer = 0

  const cachedRasterBlob = (result: LayoutResult, format: Exclude<ExportFormat, 'svg'>, size: ExportSize): Promise<Blob> => {
    const key = `${format}:${size.width}x${size.height}:${size.native}`
    if (cachedRender?.result === result && cachedRender.key === key) return cachedRender.promise
    const assetMap = new Map(assets.value.map((asset) => [asset.id, asset]))
    const promise = rasterBlob(result, assetMap, format, size)
    cachedRender = { result, key, promise }
    window.clearTimeout(cacheTimer)
    cacheTimer = window.setTimeout(() => { if (cachedRender?.promise === promise) cachedRender = null }, 30000)
    void promise.catch(() => { if (cachedRender?.promise === promise) cachedRender = null })
    return promise
  }

  const exportLayout = async (result: LayoutResult, format: ExportFormat, size: ExportSize, action: ExportAction) => {
    exporting.value = true
    activeAction.value = action
    try {
      if (action === 'copy') {
        if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('Image clipboard is unavailable')
        const blob = cachedRasterBlob(result, 'png', size)
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        return
      }

      const blob = format === 'svg'
        ? await svgBlob(result, new Map(assets.value.map((asset) => [asset.id, asset])), size)
        : await cachedRasterBlob(result, format, size)
      const filename = `pholo-${new Date().toISOString().slice(0, 10)}-${size.width}x${size.height}.${format}`
      downloadBlob(blob, filename)
    } finally {
      exporting.value = false
      activeAction.value = null
    }
  }

  onBeforeUnmount(() => window.clearTimeout(cacheTimer))
  return { exporting, activeAction, exportLayout }
}
