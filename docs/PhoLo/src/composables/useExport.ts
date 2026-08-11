import { ref, type Ref } from 'vue'
import type { AssetImage, ExportFormat, LayoutResult } from '../types'

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

async function imageSource(asset: AssetImage): Promise<CanvasImageSource> {
  if (asset.file && 'createImageBitmap' in window) return createImageBitmap(asset.file)
  const image = new Image()
  image.decoding = 'async'
  image.src = asset.file ? await fileAsDataUrl(asset.file) : asset.src
  await image.decode()
  return image
}

export function useExport(assets: Ref<AssetImage[]>) {
  const exporting = ref(false)

  const exportLayout = async (result: LayoutResult, format: ExportFormat) => {
    exporting.value = true
    try {
      const filename = `pholo-${new Date().toISOString().slice(0, 10)}.${format}`
      const map = new Map(assets.value.map((asset) => [asset.id, asset]))
      if (format === 'svg') {
        const images = await Promise.all(result.rects.map(async (rect) => {
          const asset = map.get(rect.id)
          if (!asset) return ''
          const href = asset.file ? await fileAsDataUrl(asset.file) : asset.src
          return `<image href="${href}" x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" preserveAspectRatio="xMidYMid meet"/>`
        }))
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${result.canvasWidth}" height="${result.canvasHeight}" viewBox="0 0 ${result.canvasWidth} ${result.canvasHeight}"><rect width="100%" height="100%" fill="#111211"/>${images.join('')}</svg>`
        downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), filename)
        return
      }
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(result.canvasWidth)
      canvas.height = Math.round(result.canvasHeight)
      const context = canvas.getContext('2d', { alpha: false })!
      context.fillStyle = '#111211'
      context.fillRect(0, 0, canvas.width, canvas.height)
      for (const rect of result.rects) {
        const asset = map.get(rect.id)
        if (!asset) continue
        const source = await imageSource(asset)
        context.drawImage(source, rect.x, rect.y, rect.width, rect.height)
        if ('close' in source && typeof source.close === 'function') source.close()
      }
      const mime = format === 'jpeg' ? 'image/jpeg' : `image/${format}`
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Export encoding failed')), mime, format === 'jpeg' ? 0.94 : undefined))
      downloadBlob(blob, filename)
    } finally {
      exporting.value = false
    }
  }

  return { exporting, exportLayout }
}
