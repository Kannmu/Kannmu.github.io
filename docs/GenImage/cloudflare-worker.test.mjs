import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import worker from './cloudflare-worker.mjs'

const originalFetch = globalThis.fetch
const originalConsoleError = console.error
const endpoint = 'https://kannmu.top/gpt-image-api/v1/images/generations'

afterEach(() => {
  globalThis.fetch = originalFetch
  console.error = originalConsoleError
})

test('opens the response stream before the upstream request finishes', async () => {
  let finishUpstream
  globalThis.fetch = () => new Promise((resolve) => {
    finishUpstream = resolve
  })

  const response = await worker.fetch(new Request(endpoint, {
    method: 'POST',
    headers: {
      Origin: 'https://kannmu.top',
      Authorization: 'Bearer test',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: 'test' })
  }))
  const reader = response.body.getReader()
  const firstChunk = await reader.read()

  assert.equal(response.status, 200)
  assert.equal(new TextDecoder().decode(firstChunk.value).trim(), '')

  finishUpstream(new Response(JSON.stringify({ data: [{ b64_json: 'image-data' }] }), {
    headers: { 'Content-Type': 'application/json' }
  }))

  let responseText = new TextDecoder().decode(firstChunk.value)
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    responseText += new TextDecoder().decode(value)
  }

  assert.deepEqual(JSON.parse(responseText), { data: [{ b64_json: 'image-data' }] })
})

test('returns an API error as JSON after streaming has started', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    error: { message: 'invalid API key' }
  }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  })

  const response = await worker.fetch(new Request(endpoint, {
    method: 'POST',
    headers: {
      Origin: 'https://kannmu.top',
      Authorization: 'Bearer test',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: 'test' })
  }))

  assert.deepEqual(await response.json(), {
    error: { message: 'invalid API key', status: 401 }
  })
})

test('returns a parseable JSON error when the upstream connection fails', async () => {
  console.error = () => {}
  globalThis.fetch = async () => {
    throw new Error('connection reset')
  }

  const response = await worker.fetch(new Request(endpoint, {
    method: 'POST',
    headers: {
      Origin: 'https://kannmu.top',
      Authorization: 'Bearer test',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: 'test' })
  }))
  const payload = await response.json()

  assert.match(payload.error.message, /上游连接/)
})

test('preserves the upstream status for short GET requests', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    error: { message: 'invalid API key' }
  }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  })

  const response = await worker.fetch(new Request(
    'https://kannmu.top/gpt-image-api/v1/models',
    { headers: { Origin: 'https://kannmu.top' } }
  ))

  assert.equal(response.status, 401)
  assert.deepEqual(await response.json(), { error: { message: 'invalid API key' } })
})
