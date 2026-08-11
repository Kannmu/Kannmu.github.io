import { computed, onBeforeUnmount, ref } from 'vue'
import { fileKey, mergeUploadedAssets } from '../core/library'
import { makeSampleImages } from '../samples'
import type { AssetImage, LibraryMode } from '../types'

const MAX_PREVIEW_EDGE = 1600

interface DecodeResult {
  asset: AssetImage | null
  failed: boolean
}

async function blobFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Preview encoding failed')), 'image/webp', 0.88))
}

async function decodeWithImage(file: File): Promise<{ image: CanvasImageSource; width: number; height: number; close?: () => void }> {
  if ('createImageBitmap' in window) {
    const bitmap = await createImageBitmap(file)
    return { image: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() }
  }
  const objectUrl = URL.createObjectURL(file)
  const image = new Image()
  image.decoding = 'async'
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Image decode failed')); image.src = objectUrl })
  return { image, width: image.naturalWidth, height: image.naturalHeight, close: () => URL.revokeObjectURL(objectUrl) }
}

async function decodeFile(file: File, index: number): Promise<DecodeResult> {
  try {
    const decoded = await decodeWithImage(file)
    const ratio = Math.min(1, MAX_PREVIEW_EDGE / Math.max(decoded.width, decoded.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(decoded.width * ratio))
    canvas.height = Math.max(1, Math.round(decoded.height * ratio))
    canvas.getContext('2d', { alpha: false })?.drawImage(decoded.image, 0, 0, canvas.width, canvas.height)
    decoded.close?.()
    const preview = await blobFromCanvas(canvas)
    return {
      failed: false,
      asset: {
        id: `user-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name.replace(/\.[^.]+$/, ''), width: decoded.width, height: decoded.height,
        aspect: decoded.width / decoded.height, weight: 1, enabled: true, src: URL.createObjectURL(preview), file,
        origin: 'user', fileKey: fileKey(file),
      },
    }
  } catch {
    return { asset: null, failed: true }
  }
}

export function useAssetLibrary() {
  const assets = ref<AssetImage[]>([])
  const mode = ref<LibraryMode>('empty')
  const decoding = ref(false)
  const enabledAssets = computed(() => assets.value.filter((asset) => asset.enabled))

  const release = (asset: AssetImage) => { if (asset.origin === 'user' && asset.src.startsWith('blob:')) URL.revokeObjectURL(asset.src) }
  const releaseAll = (items = assets.value) => items.forEach(release)

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
    const files = Array.from(input).filter((file) => file.type.startsWith('image/'))
    if (files.length === 0) return { added: 0, ignored: 0, failed: input.length }
    decoding.value = true
    const decoded: DecodeResult[] = []
    for (let index = 0; index < files.length; index += 3) {
      decoded.push(...await Promise.all(files.slice(index, index + 3).map((file, batchIndex) => decodeFile(file, index + batchIndex))))
      if (index + 3 < files.length) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    }
    decoding.value = false
    const valid = decoded.map((item) => item.asset).filter((asset): asset is AssetImage => Boolean(asset))
    const merged = mergeUploadedAssets(assets.value, valid, mode.value)
    const acceptedIds = new Set(merged.assets.map((asset) => asset.id))
    valid.filter((asset) => !acceptedIds.has(asset.id)).forEach(release)
    if (merged.replacedDemo) releaseAll(assets.value)
    assets.value = merged.assets
    mode.value = merged.mode
    return { added: valid.length - merged.ignored, ignored: merged.ignored, failed: decoded.filter((item) => item.failed).length }
  }

  onBeforeUnmount(() => releaseAll())
  return { assets, mode, decoding, enabledAssets, loadDemo, clear, remove, toggle, addFiles }
}
