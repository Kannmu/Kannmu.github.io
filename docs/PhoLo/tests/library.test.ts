import { describe, expect, it } from 'vitest'
import { fileKey, isCurrentRequest, mergeUploadedAssets } from '../src/core/library'
import type { AssetImage } from '../src/types'

function asset(id: string, origin: 'demo' | 'user', key?: string): AssetImage {
  return { id, name: id, width: 100, height: 100, aspect: 1, weight: 1, enabled: true, src: `${id}.png`, origin, fileKey: key }
}

describe('asset library transitions', () => {
  it('replaces the demo atomically on the first valid upload', () => {
    const result = mergeUploadedAssets([asset('demo-a', 'demo'), asset('demo-b', 'demo')], [asset('user-a', 'user', 'a')], 'demo')
    expect(result.assets.map((item) => item.id)).toEqual(['user-a'])
    expect(result.mode).toBe('user')
    expect(result.replacedDemo).toBe(true)
  })

  it('keeps the demo when no valid upload was decoded', () => {
    const current = [asset('demo-a', 'demo')]
    expect(mergeUploadedAssets(current, [], 'demo')).toEqual({ assets: current, mode: 'demo', ignored: 0, replacedDemo: false })
  })

  it('appends later uploads and ignores duplicate file fingerprints', () => {
    const current = [asset('user-a', 'user', 'same')]
    const result = mergeUploadedAssets(current, [asset('duplicate', 'user', 'same'), asset('user-b', 'user', 'new')], 'user')
    expect(result.assets.map((item) => item.id)).toEqual(['user-a', 'user-b'])
    expect(result.ignored).toBe(1)
  })

  it('creates stable file fingerprints', () => {
    expect(fileKey({ name: 'frame.jpg', size: 1200, lastModified: 42 })).toBe('frame.jpg:1200:42')
  })

  it('rejects stale worker messages', () => {
    expect(isCurrentRequest(8, 8)).toBe(true)
    expect(isCurrentRequest(8, 7)).toBe(false)
  })
})
