import { describe, expect, it } from 'vitest'
import { exportSizes } from '../src/core/exportSizing'
import type { AssetImage, LayoutResult } from '../src/types'

function asset(id: string, width: number, height: number): AssetImage {
  return { id, name: id, width, height, aspect: width / height, weight: 1, enabled: true, src: `${id}.jpg`, origin: 'user' }
}

function layout(width = 1600, height = 1000): LayoutResult {
  return {
    tree: { kind: 'leaf', id: 'a' },
    rects: [{ id: 'a', x: 0, y: 0, width, height, scale: 1 }],
    canvasWidth: width,
    canvasHeight: height,
    gap: 24,
    score: 0,
    iteration: 0,
    metrics: { uniformity: 100, aspectError: 0, sizeSpread: 1, fill: 1 },
  }
}

describe('export resolution sizing', () => {
  it('starts at the largest source edge and offers descending smaller presets', () => {
    expect(exportSizes(layout(), [asset('a', 12000, 8000)])).toEqual([
      { id: 'original', width: 12000, height: 7500, native: true },
      { id: 'eight-k', width: 7680, height: 4800, native: false },
      { id: 'four-k', width: 3840, height: 2400, native: false },
      { id: 'two-k', width: 2560, height: 1600, native: false },
      { id: 'full-hd', width: 1920, height: 1200, native: false },
      { id: 'hd', width: 1280, height: 800, native: false },
      { id: 'small', width: 800, height: 500, native: false },
    ])
  })

  it('does not offer presets that would enlarge the original', () => {
    expect(exportSizes(layout(), [asset('a', 1600, 1000)]).map((size) => size.id)).toEqual(['original', 'hd', 'small'])
    expect(exportSizes(layout(), [asset('a', 640, 400)])).toEqual([{ id: 'original', width: 640, height: 400, native: true }])
  })

  it('uses the longest canvas edge for portrait layouts', () => {
    expect(exportSizes(layout(1000, 1600), [asset('a', 3000, 5000)])[0]).toEqual({ id: 'original', width: 3125, height: 5000, native: true })
  })
})
