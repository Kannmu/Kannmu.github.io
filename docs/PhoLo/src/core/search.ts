import { evaluateTree } from './geometry'
import type { Cut, LayoutImage, LayoutResult, SearchConfig, SliceNode } from '../types'

type Random = () => number

export function seededRandom(seed: number): Random {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], random: Random): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1))
    ;[result[index], result[other]] = [result[other]!, result[index]!]
  }
  return result
}

function makeTree(ids: string[], random: Random, targetAspect: number, depth = 0): SliceNode {
  if (ids.length === 1) return { kind: 'leaf', id: ids[0]! }
  const center = ids.length / 2
  const jitter = Math.floor((random() - 0.5) * Math.max(1, ids.length * 0.35))
  const split = Math.max(1, Math.min(ids.length - 1, Math.round(center + jitter)))
  const preferred: Cut = depth === 0 ? (targetAspect >= 1 ? 'H' : 'V') : random() < 0.5 ? 'H' : 'V'
  const cut: Cut = random() < 0.72 ? preferred : preferred === 'H' ? 'V' : 'H'
  return {
    kind: 'branch',
    cut,
    left: makeTree(ids.slice(0, split), random, targetAspect, depth + 1),
    right: makeTree(ids.slice(split), random, targetAspect, depth + 1),
  }
}

function makeChain(ids: string[], cut: Cut): SliceNode {
  if (ids.length === 1) return { kind: 'leaf', id: ids[0]! }
  return { kind: 'branch', cut, left: { kind: 'leaf', id: ids[0]! }, right: makeChain(ids.slice(1), cut) }
}

export function initialTree(images: LayoutImage[], random: Random, targetAspect: number): SliceNode {
  return makeTree(shuffle(images.map((image) => image.id), random), random, targetAspect)
}

function cloneTree<T extends SliceNode>(tree: T): T {
  return structuredClone(tree)
}

type Path = Array<'left' | 'right'>

function collectPaths(node: SliceNode, leaves: Path[], branches: Path[], path: Path = []): void {
  if (node.kind === 'leaf') {
    leaves.push(path)
    return
  }
  branches.push(path)
  collectPaths(node.left, leaves, branches, [...path, 'left'])
  collectPaths(node.right, leaves, branches, [...path, 'right'])
}

function atPath(root: SliceNode, path: Path): SliceNode {
  let node = root
  for (const key of path) {
    if (node.kind === 'leaf') throw new Error('Invalid tree path')
    node = node[key]
  }
  return node
}

function setPath(root: SliceNode, path: Path, value: SliceNode): SliceNode {
  if (path.length === 0) return value
  const parent = atPath(root, path.slice(0, -1))
  if (parent.kind === 'leaf') return root
  parent[path[path.length - 1]!] = value
  return root
}

export function mutateTree(source: SliceNode, random: Random, images: LayoutImage[], targetAspect: number): SliceNode {
  if (random() < 0.018) return initialTree(images, random, targetAspect)
  let tree = cloneTree(source)
  const leaves: Path[] = []
  const branches: Path[] = []
  collectPaths(tree, leaves, branches)
  const choice = random()

  if (choice < 0.42 && leaves.length > 1) {
    const first = atPath(tree, leaves[Math.floor(random() * leaves.length)]!)
    let second = atPath(tree, leaves[Math.floor(random() * leaves.length)]!)
    while (second === first) second = atPath(tree, leaves[Math.floor(random() * leaves.length)]!)
    if (first.kind === 'leaf' && second.kind === 'leaf') [first.id, second.id] = [second.id, first.id]
    return tree
  }

  if (choice < 0.7 && branches.length > 0) {
    const node = atPath(tree, branches[Math.floor(random() * branches.length)]!)
    if (node.kind === 'branch') node.cut = node.cut === 'H' ? 'V' : 'H'
    return tree
  }

  const rotatable = branches.filter((path) => {
    const node = atPath(tree, path)
    return node.kind === 'branch' && (node.left.kind === 'branch' || node.right.kind === 'branch')
  })
  if (rotatable.length === 0) {
    const first = atPath(tree, leaves[Math.floor(random() * leaves.length)]!)
    let second = atPath(tree, leaves[Math.floor(random() * leaves.length)]!)
    while (second === first) second = atPath(tree, leaves[Math.floor(random() * leaves.length)]!)
    if (first.kind === 'leaf' && second.kind === 'leaf') [first.id, second.id] = [second.id, first.id]
    return tree
  }
  const path = rotatable[Math.floor(random() * rotatable.length)]!
  const node = atPath(tree, path)
  if (node.kind === 'leaf') return tree

  if (node.left.kind === 'branch' && (node.right.kind === 'leaf' || random() < 0.5)) {
    const pivot = node.left
    tree = setPath(tree, path, {
      kind: 'branch',
      cut: pivot.cut,
      left: pivot.left,
      right: { kind: 'branch', cut: node.cut, left: pivot.right, right: node.right },
    })
  } else if (node.right.kind === 'branch') {
    const pivot = node.right
    tree = setPath(tree, path, {
      kind: 'branch',
      cut: pivot.cut,
      left: { kind: 'branch', cut: node.cut, left: node.left, right: pivot.left },
      right: pivot.right,
    })
  }
  return tree
}

export interface SearchState {
  random: Random
  currentTree: SliceNode
  current: LayoutResult
  best: LayoutResult
  evaluations: number
}

export function createSearch(images: LayoutImage[], config: SearchConfig): SearchState {
  if (images.length < 2) throw new Error('At least two images are required')
  const random = seededRandom(config.seed)
  let best: LayoutResult | null = null
  let bestTree: SliceNode | null = null
  let evaluations = 0
  const guaranteedTrees = [makeChain(images.map((image) => image.id), 'V'), makeChain(images.map((image) => image.id), 'H')]
  for (const tree of guaranteedTrees) {
    const evaluation = evaluateTree(tree, images, config)
    evaluations += 1
    if (evaluation.valid && (!best || evaluation.result.score < best.score)) {
      best = evaluation.result
      bestTree = tree
    }
  }
  const starts = Math.min(24, Math.max(8, images.length * 2))
  for (let index = 0; index < starts; index += 1) {
    const tree = initialTree(images, random, config.targetAspect)
    const evaluation = evaluateTree(tree, images, config)
    evaluations += 1
    if (evaluation.valid && (!best || evaluation.result.score < best.score)) {
      best = evaluation.result
      bestTree = tree
    }
  }
  if (!best || !bestTree) throw new Error('No feasible slicing layout was found for this gap')
  return { random, currentTree: bestTree, current: best, best, evaluations }
}

export function searchStep(state: SearchState, images: LayoutImage[], config: SearchConfig, iteration: number): boolean {
  const progress = iteration / Math.max(1, config.iterations - 1)
  const temperature = 0.32 * (1 - progress) ** 2 + 0.003
  const candidateTree = mutateTree(state.currentTree, state.random, images, config.targetAspect)
  const evaluation = evaluateTree(candidateTree, images, config, iteration)
  state.evaluations += 1
  if (!evaluation.valid) return false
  const delta = evaluation.result.score - state.current.score
  if (delta < 0 || state.random() < Math.exp(-delta / temperature)) {
    state.currentTree = candidateTree
    state.current = evaluation.result
  }
  if (evaluation.result.score < state.best.score) {
    state.best = evaluation.result
    return true
  }
  return false
}

export function runSearch(images: LayoutImage[], config: SearchConfig): LayoutResult {
  const state = createSearch(images, config)
  for (let iteration = 0; iteration < config.iterations; iteration += 1) searchStep(state, images, config, iteration)
  return state.best
}
