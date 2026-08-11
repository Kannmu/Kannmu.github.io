import { describe, expect, it } from 'vitest'
import { assertLayout, coefficients, evaluateTree } from '../src/core/geometry'
import { runSearch } from '../src/core/search'
import type { LayoutImage, SearchConfig, SliceNode } from '../src/types'

const images: LayoutImage[] = [
  { id: 'a', name: 'A', width: 1200, height: 800, aspect: 1.5, weight: 1 },
  { id: 'b', name: 'B', width: 900, height: 1200, aspect: 0.75, weight: 1 },
  { id: 'c', name: 'C', width: 1200, height: 1200, aspect: 1, weight: 1 },
  { id: 'd', name: 'D', width: 1600, height: 900, aspect: 16 / 9, weight: 1 },
]

const config: SearchConfig = { canvasWidth: 1600, gap: 24, targetAspect: 1.5, fixedFrame: false, balance: 0.6, iterations: 2400, seed: 42 }

describe('analytical slicing geometry', () => {
  it('represents a horizontal pair as W = aH + bg', () => {
    const tree: SliceNode = { kind: 'branch', cut: 'H', left: { kind: 'leaf', id: 'a' }, right: { kind: 'leaf', id: 'b' } }
    expect(coefficients(tree, new Map(images.map((image) => [image.id, image])))).toMatchObject({ a: 2.25, b: 1 })
  })

  it('preserves every image aspect and prevents overlap', () => {
    const result = runSearch(images, config)
    expect(result.rects).toHaveLength(images.length)
    assertLayout(result)
    const imageMap = new Map(images.map((image) => [image.id, image]))
    result.rects.forEach((rect) => expect(rect.width / rect.height).toBeCloseTo(imageMap.get(rect.id)!.aspect, 5))
  })

  it('uses the requested gap in both cut directions', () => {
    const tree: SliceNode = {
      kind: 'branch', cut: 'V', left: { kind: 'branch', cut: 'H', left: { kind: 'leaf', id: 'a' }, right: { kind: 'leaf', id: 'b' } },
      right: { kind: 'branch', cut: 'H', left: { kind: 'leaf', id: 'c' }, right: { kind: 'leaf', id: 'd' } },
    }
    const evaluation = evaluateTree(tree, images, config)
    expect(evaluation.valid).toBe(true)
    assertLayout(evaluation.result)
    const [a, b, c] = ['a', 'b', 'c'].map((id) => evaluation.result.rects.find((rect) => rect.id === id)!) as [NonNullable<typeof evaluation.result.rects[number]>, NonNullable<typeof evaluation.result.rects[number]>, NonNullable<typeof evaluation.result.rects[number]>]
    expect(b.x - (a.x + a.width)).toBeCloseTo(config.gap, 5)
    expect(c.y - (a.y + a.height)).toBeCloseTo(config.gap, 5)
  })

  it('is deterministic for the same seed', () => {
    expect(runSearch(images, config).score).toBe(runSearch(images, config).score)
  })

  it('keeps a feasible vertical baseline for a large gap', () => {
    const result = runSearch(images, { ...config, gap: 240, canvasWidth: 700, iterations: 80 })
    expect(result.rects).toHaveLength(images.length)
    assertLayout(result)
  })

  it.each([
    { targetAspect: 1, gap: 8, balance: 0, iterations: 1200 },
    { targetAspect: 1, gap: 80, balance: 1, iterations: 3200 },
    { targetAspect: 16 / 9, gap: 24, balance: 0.25, iterations: 1600 },
    { targetAspect: 16 / 9, gap: 64, balance: 0.9, iterations: 4000 },
    { targetAspect: 4 / 3, gap: 36, balance: 0.6, iterations: 2400 },
  ])('keeps a fixed $targetAspect frame across search settings', (settings) => {
    const result = runSearch(images, { ...config, ...settings, fixedFrame: true })
    expect(result.canvasWidth / result.canvasHeight).toBeCloseTo(settings.targetAspect, 10)
    expect(result.metrics.aspectError).toBeCloseTo(0, 10)
    assertLayout(result)
    const imageMap = new Map(images.map((image) => [image.id, image]))
    result.rects.forEach((rect) => expect(rect.width / rect.height).toBeCloseTo(imageMap.get(rect.id)!.aspect, 5))
  })
})
