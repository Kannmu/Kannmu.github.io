import type { AssetImage, LibraryMode } from '../types'

export interface MergeResult {
  assets: AssetImage[]
  mode: LibraryMode
  ignored: number
  replacedDemo: boolean
}

export function fileKey(file: Pick<File, 'name' | 'size' | 'lastModified'>): string {
  return `${file.name}:${file.size}:${file.lastModified}`
}

export function mergeUploadedAssets(current: AssetImage[], incoming: AssetImage[], mode: LibraryMode): MergeResult {
  if (incoming.length === 0) return { assets: current, mode, ignored: 0, replacedDemo: false }
  const base = mode === 'demo' ? [] : current
  const known = new Set(base.map((asset) => asset.fileKey).filter(Boolean))
  const accepted: AssetImage[] = []
  let ignored = 0
  for (const asset of incoming) {
    if (asset.fileKey && known.has(asset.fileKey)) {
      ignored += 1
      continue
    }
    if (asset.fileKey) known.add(asset.fileKey)
    accepted.push(asset)
  }
  if (accepted.length === 0) return { assets: current, mode, ignored, replacedDemo: false }
  return { assets: [...base, ...accepted], mode: 'user', ignored, replacedDemo: mode === 'demo' }
}

export function isCurrentRequest(activeRequestId: number, messageRequestId: number): boolean {
  return activeRequestId === messageRequestId
}
