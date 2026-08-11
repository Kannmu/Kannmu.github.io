import type { LayoutImage, LayoutMetrics, LayoutRect, LayoutResult, SearchConfig, SliceNode } from '../types'

interface Coefficients {
  a: number
  b: number
  leaves: number
}

interface Evaluation {
  result: LayoutResult
  valid: boolean
}

const EPSILON = 1e-7
const INVALID_SCORE = 1e12

export function coefficients(node: SliceNode, imageMap: Map<string, LayoutImage>): Coefficients {
  if (node.kind === 'leaf') {
    const image = imageMap.get(node.id)
    if (!image) throw new Error(`Unknown image ${node.id}`)
    return { a: image.aspect, b: 0, leaves: 1 }
  }

  const left = coefficients(node.left, imageMap)
  const right = coefficients(node.right, imageMap)
  if (node.cut === 'H') {
    return { a: left.a + right.a, b: left.b + right.b + 1, leaves: left.leaves + right.leaves }
  }

  const denominator = 1 / left.a + 1 / right.a
  return {
    a: 1 / denominator,
    b: (left.b / left.a + right.b / right.a - 1) / denominator,
    leaves: left.leaves + right.leaves,
  }
}

function emptyMetrics(): LayoutMetrics {
  return { uniformity: 0, aspectError: 99, sizeSpread: 99, fill: 0 }
}

export function evaluateTree(
  tree: SliceNode,
  images: LayoutImage[],
  config: SearchConfig,
  iteration = 0,
): Evaluation {
  const imageMap = new Map(images.map((image) => [image.id, image]))
  let root: Coefficients
  try {
    root = coefficients(tree, imageMap)
  } catch {
    return {
      valid: false,
      result: { tree, rects: [], canvasWidth: config.canvasWidth, canvasHeight: 1, gap: config.gap, score: INVALID_SCORE, iteration, metrics: emptyMetrics() },
    }
  }

  const naturalHeight = (config.canvasWidth - root.b * config.gap) / root.a
  const canvasHeight = config.fixedFrame ? config.canvasWidth / config.targetAspect : naturalHeight
  const contentHeight = config.fixedFrame ? Math.min(canvasHeight, naturalHeight) : canvasHeight
  const contentWidth = root.a * contentHeight + root.b * config.gap
  const offsetX = (config.canvasWidth - contentWidth) / 2
  const offsetY = (canvasHeight - contentHeight) / 2
  if (
    !Number.isFinite(canvasHeight) || !Number.isFinite(contentHeight) || !Number.isFinite(contentWidth)
    || canvasHeight <= config.gap * 0.5 || contentHeight <= config.gap * 0.5 || contentWidth <= EPSILON
  ) {
    return {
      valid: false,
      result: { tree, rects: [], canvasWidth: config.canvasWidth, canvasHeight: 1, gap: config.gap, score: INVALID_SCORE, iteration, metrics: emptyMetrics() },
    }
  }

  const rects: LayoutRect[] = []
  let valid = true

  function place(node: SliceNode, x: number, y: number, width: number, height: number): void {
    if (!valid || width <= EPSILON || height <= EPSILON) {
      valid = false
      return
    }
    if (node.kind === 'leaf') {
      const image = imageMap.get(node.id)
      if (!image) {
        valid = false
        return
      }
      const aspectError = Math.abs(width / height - image.aspect)
      if (aspectError > 1e-4) {
        valid = false
        return
      }
      rects.push({ id: node.id, x, y, width, height, scale: width / image.width })
      return
    }

    const left = coefficients(node.left, imageMap)
    const right = coefficients(node.right, imageMap)
    if (node.cut === 'H') {
      const leftWidth = left.a * height + left.b * config.gap
      const rightWidth = right.a * height + right.b * config.gap
      if (Math.abs(leftWidth + config.gap + rightWidth - width) > 1e-3) valid = false
      place(node.left, x, y, leftWidth, height)
      place(node.right, x + leftWidth + config.gap, y, rightWidth, height)
    } else {
      const leftHeight = (width - left.b * config.gap) / left.a
      const rightHeight = (width - right.b * config.gap) / right.a
      if (Math.abs(leftHeight + config.gap + rightHeight - height) > 1e-3) valid = false
      place(node.left, x, y, width, leftHeight)
      place(node.right, x, y + leftHeight + config.gap, width, rightHeight)
    }
  }

  place(tree, offsetX, offsetY, contentWidth, contentHeight)
  if (!valid || rects.length !== images.length) {
    return {
      valid: false,
      result: { tree, rects: [], canvasWidth: config.canvasWidth, canvasHeight, gap: config.gap, score: INVALID_SCORE, iteration, metrics: emptyMetrics() },
    }
  }

  const totalPhotoArea = rects.reduce((sum, rect) => sum + rect.width * rect.height, 0)
  const totalWeight = images.reduce((sum, image) => sum + image.weight, 0)
  const logDeviations = rects.map((rect) => {
    const image = imageMap.get(rect.id)!
    const observed = (rect.width * rect.height) / totalPhotoArea
    const desired = image.weight / totalWeight
    return Math.log(Math.max(EPSILON, observed / desired))
  })
  const mean = logDeviations.reduce((sum, value) => sum + value, 0) / logDeviations.length
  const fairness = Math.sqrt(logDeviations.reduce((sum, value) => sum + (value - mean) ** 2, 0) / logDeviations.length)
  const minDeviation = Math.min(...logDeviations)
  const maxDeviation = Math.max(...logDeviations)
  const sizeSpread = maxDeviation - minDeviation
  const actualAspect = config.canvasWidth / canvasHeight
  const contentAspect = contentWidth / contentHeight
  const frameFitError = Math.abs(Math.log(contentAspect / config.targetAspect))
  const aspectError = Math.abs(Math.log(actualAspect / config.targetAspect))
  const spreadLimit = Math.log(3.2)
  const spreadPenalty = Math.max(0, sizeSpread - spreadLimit) ** 2 * 2.8
  const skinnyPenalty = rects.reduce((sum, rect) => {
    const shortSide = Math.min(rect.width, rect.height)
    return sum + (shortSide < config.gap * 1.8 ? ((config.gap * 1.8 - shortSide) / config.gap) ** 2 : 0)
  }, 0)
  const balanceWeight = 0.75 + config.balance * 1.8
  const frameFitWeight = config.fixedFrame ? 4.2 : 2.75
  const score = fairness * balanceWeight + frameFitError * frameFitWeight + sizeSpread * 0.12 + spreadPenalty + skinnyPenalty
  const metrics: LayoutMetrics = {
    uniformity: Math.max(0, Math.min(100, Math.exp(-fairness) * 100)),
    aspectError,
    sizeSpread: Math.exp(sizeSpread),
    fill: totalPhotoArea / (config.canvasWidth * canvasHeight),
  }

  return {
    valid: true,
    result: { tree, rects, canvasWidth: config.canvasWidth, canvasHeight, gap: config.gap, score, iteration, metrics },
  }
}

export function assertLayout(result: LayoutResult, tolerance = 1e-4): void {
  for (let index = 0; index < result.rects.length; index += 1) {
    const a = result.rects[index]!
    if (a.x < -tolerance || a.y < -tolerance || a.x + a.width > result.canvasWidth + tolerance || a.y + a.height > result.canvasHeight + tolerance) {
      throw new Error(`Rectangle ${a.id} is outside the canvas`)
    }
    for (let otherIndex = index + 1; otherIndex < result.rects.length; otherIndex += 1) {
      const b = result.rects[otherIndex]!
      const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
      const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
      if (overlapX > tolerance && overlapY > tolerance) throw new Error(`${a.id} overlaps ${b.id}`)
    }
  }
}
