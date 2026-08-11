import type { AssetImage, ExportResolution, ExportSize, LayoutResult } from '../types'

const PRESETS: Array<{ id: Exclude<ExportResolution, 'original'>; edge: number }> = [
  { id: 'eight-k', edge: 7680 },
  { id: 'four-k', edge: 3840 },
  { id: 'two-k', edge: 2560 },
  { id: 'full-hd', edge: 1920 },
  { id: 'hd', edge: 1280 },
  { id: 'small', edge: 800 },
]

function dimensionsForEdge(result: LayoutResult, edge: number): { width: number; height: number } {
  if (result.canvasWidth >= result.canvasHeight) {
    return { width: edge, height: Math.max(1, Math.round(edge * result.canvasHeight / result.canvasWidth)) }
  }
  return { width: Math.max(1, Math.round(edge * result.canvasWidth / result.canvasHeight)), height: edge }
}

export function exportSizes(result: LayoutResult, assets: AssetImage[]): ExportSize[] {
  const usedIds = new Set(result.rects.map((rect) => rect.id))
  const sourceEdges = assets.filter((asset) => usedIds.has(asset.id)).map((asset) => Math.max(asset.width, asset.height))
  const originalEdge = Math.max(1, Math.round(sourceEdges.length ? Math.max(...sourceEdges) : Math.max(result.canvasWidth, result.canvasHeight)))
  const original = dimensionsForEdge(result, originalEdge)
  const sizes: ExportSize[] = [{ id: 'original', ...original, native: true }]
  const knownDimensions = new Set([`${original.width}x${original.height}`])

  PRESETS.forEach((preset) => {
    if (preset.edge >= originalEdge) return
    const dimensions = dimensionsForEdge(result, preset.edge)
    const key = `${dimensions.width}x${dimensions.height}`
    if (knownDimensions.has(key)) return
    knownDimensions.add(key)
    sizes.push({ id: preset.id, ...dimensions, native: false })
  })
  return sizes
}
