/// <reference lib="webworker" />

import { createSearch, searchStep } from '../core/search'
import type { WorkerRequest, WorkerResponse } from '../types'

let activeRequest = 0

function send(message: WorkerResponse): void {
  self.postMessage(message)
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const request = event.data
  if (request.type === 'cancel') {
    if (request.requestId === activeRequest) activeRequest += 1
    return
  }

  activeRequest = request.requestId
  const requestId = request.requestId
  try {
    const state = createSearch(request.images, request.config)
    const start = performance.now()
    send({ type: 'started', requestId, result: state.best })
    let iteration = 0
    let lastSent = start

    const runChunk = () => {
      if (activeRequest !== requestId) return
      const chunkEnd = Math.min(request.config.iterations, iteration + 360)
      let improved = false
      for (; iteration < chunkEnd; iteration += 1) {
        improved = searchStep(state, request.images, request.config, iteration) || improved
      }

      const now = performance.now()
      if (improved || now - lastSent > 80) {
        send({
          type: 'progress',
          requestId,
          result: state.best,
          progress: iteration / request.config.iterations,
          evaluations: state.evaluations,
          elapsed: now - start,
        })
        lastSent = now
      }

      if (iteration < request.config.iterations) {
        setTimeout(runChunk, 0)
      } else {
        send({ type: 'complete', requestId, result: state.best, evaluations: state.evaluations, elapsed: performance.now() - start })
      }
    }
    runChunk()
  } catch (error) {
    send({ type: 'error', requestId, message: error instanceof Error ? error.message : 'Layout search failed' })
  }
}

export {}
