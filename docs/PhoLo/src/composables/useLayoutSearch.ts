import { onBeforeUnmount, ref, type ComputedRef } from 'vue'
import { evaluateTree } from '../core/geometry'
import { isCurrentRequest } from '../core/library'
import type { LayoutImage, LayoutResult, SearchConfig, WorkerResponse } from '../types'

export function useLayoutSearch(images: ComputedRef<LayoutImage[]>, config: ComputedRef<SearchConfig>) {
  const worker = new Worker(new URL('../workers/layout.worker.ts', import.meta.url), { type: 'module' })
  const bestResult = ref<LayoutResult | null>(null)
  const displayResult = ref<LayoutResult | null>(null)
  const running = ref(false)
  const pending = ref(false)
  const animating = ref(false)
  const progress = ref(0)
  const evaluations = ref(0)
  const elapsed = ref(0)
  const error = ref('')
  let activeRequestId = 0
  let seedOffset = 0
  let debounceTimer = 0
  let animationTimer = 0
  let frame = 0
  let queuedMessage: WorkerResponse | null = null

  const markAnimating = () => {
    animating.value = true
    window.clearTimeout(animationTimer)
    animationTimer = window.setTimeout(() => { animating.value = false }, 520)
  }

  const commitMessage = (message: WorkerResponse) => {
    if (!isCurrentRequest(activeRequestId, message.requestId)) return
    if (message.type === 'error') {
      error.value = message.message
      running.value = false
      pending.value = false
      return
    }
    markAnimating()
    bestResult.value = message.result
    displayResult.value = message.result
    if (message.type === 'progress' || message.type === 'complete') {
      progress.value = message.type === 'complete' ? 1 : message.progress
      evaluations.value = message.evaluations
      elapsed.value = message.elapsed
    }
    if (message.type === 'complete') {
      running.value = false
      pending.value = false
    }
  }

  worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
    if (!isCurrentRequest(activeRequestId, event.data.requestId)) return
    queuedMessage = event.data
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      if (queuedMessage) commitMessage(queuedMessage)
      queuedMessage = null
    })
  })

  const cancel = () => {
    const previous = activeRequestId
    activeRequestId += 1
    worker.postMessage({ type: 'cancel', requestId: previous })
    window.clearTimeout(debounceTimer)
    running.value = false
    pending.value = false
  }

  const start = (alternate = false) => {
    window.clearTimeout(debounceTimer)
    if (images.value.length < 2) {
      cancel()
      bestResult.value = null
      displayResult.value = null
      return
    }
    const previous = activeRequestId
    activeRequestId += 1
    worker.postMessage({ type: 'cancel', requestId: previous })
    if (alternate) seedOffset += 1
    const requestConfig = { ...config.value, seed: config.value.seed + seedOffset * 9973 }
    running.value = true
    pending.value = false
    progress.value = 0
    error.value = ''
    worker.postMessage({ type: 'search', requestId: activeRequestId, images: images.value, config: requestConfig })
  }

  const previewCurrentTree = () => {
    if (!bestResult.value || images.value.length < 2) return
    const evaluation = evaluateTree(bestResult.value.tree, images.value, config.value, bestResult.value.iteration)
    if (evaluation.valid) displayResult.value = evaluation.result
  }

  const schedule = (immediatePreview = false) => {
    if (images.value.length < 2) return
    if (immediatePreview) previewCurrentTree()
    const previous = activeRequestId
    activeRequestId += 1
    worker.postMessage({ type: 'cancel', requestId: previous })
    running.value = false
    pending.value = true
    window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(() => start(), 250)
  }

  const reset = () => {
    cancel()
    bestResult.value = null
    displayResult.value = null
    progress.value = 0
    evaluations.value = 0
    elapsed.value = 0
    error.value = ''
  }

  onBeforeUnmount(() => {
    window.clearTimeout(debounceTimer)
    window.clearTimeout(animationTimer)
    if (frame) cancelAnimationFrame(frame)
    worker.terminate()
  })

  return { bestResult, displayResult, running, pending, animating, progress, evaluations, elapsed, error, start, schedule, cancel, reset }
}
