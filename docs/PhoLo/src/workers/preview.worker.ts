import { readImageDimensions, type ImageDimensions } from '../core/imageMetadata'
import type { PreviewWorkerRequest, PreviewWorkerResponse } from '../types'

const worker = self as DedicatedWorkerGlobalScope

function resizeOptions(dimensions: ImageDimensions, maxEdge: number): ImageBitmapOptions {
  return dimensions.width >= dimensions.height
    ? { resizeWidth: maxEdge, resizeQuality: 'high', imageOrientation: 'from-image' }
    : { resizeHeight: maxEdge, resizeQuality: 'high', imageOrientation: 'from-image' }
}

worker.addEventListener('message', async (event: MessageEvent<PreviewWorkerRequest>) => {
  const { requestId, file, maxEdge } = event.data
  let bitmap: ImageBitmap | null = null
  try {
    const dimensions = await readImageDimensions(file)
    if (dimensions && Math.max(dimensions.width, dimensions.height) <= maxEdge) {
      worker.postMessage({ type: 'complete', requestId, ...dimensions, preview: null } satisfies PreviewWorkerResponse)
      return
    }
    if (typeof createImageBitmap !== 'function' || typeof OffscreenCanvas !== 'function') {
      worker.postMessage({ type: 'unsupported', requestId } satisfies PreviewWorkerResponse)
      return
    }
    bitmap = await createImageBitmap(file, dimensions ? resizeOptions(dimensions, maxEdge) : undefined)
    const sourceDimensions = dimensions ?? { width: bitmap.width, height: bitmap.height }
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) throw new Error('Preview canvas is unavailable')
    context.drawImage(bitmap, 0, 0)
    const preview = await canvas.convertToBlob({ type: 'image/webp', quality: 0.88 })
    worker.postMessage({ type: 'complete', requestId, ...sourceDimensions, preview } satisfies PreviewWorkerResponse)
  } catch {
    worker.postMessage({ type: 'error', requestId } satisfies PreviewWorkerResponse)
  } finally {
    bitmap?.close()
  }
})
