import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

const script = readFileSync(new URL('../../sw.js', import.meta.url), 'utf8')
const origin = 'https://kannmu.top'

function runFetch(request) {
  let handler
  const fetches = []
  const writes = []
  const pending = []
  let response
  runInNewContext(script, {
    self: {
      location: new URL(origin),
      addEventListener(type, callback) {
        if (type === 'fetch') handler = callback
      }
    },
    URL, Response, console,
    caches: {
      match: async () => undefined,
      open: async () => ({ put: async (req) => { writes.push(req.url) } })
    },
    fetch: async (url) => {
      fetches.push(url)
      return Response.json({ ok: true })
    }
  })
  handler({
    request,
    respondWith: (value) => { response = value },
    waitUntil: (value) => { pending.push(value) }
  })
  return { response, fetches, writes, pending }
}

test('the site worker leaves model and authenticated API requests intact', () => {
  const proxy = `${origin}/gpt-image-api/v1/models`
  const direct = `${origin}/v1/models`
  const requests = [
    new Request(proxy, { headers: { Authorization: 'Bearer fake-genimage-key' } }),
    new Request(proxy),
    new Request(direct, { headers: { Authorization: 'Bearer fake-genimage-key' } }),
    new Request(direct, { headers: { 'X-API-Key': 'fake-genimage-key' } }),
    new Request(direct, { headers: { 'X-Goog-API-Key': 'fake-genimage-key' } }),
    new Request(`${origin}/gpt-image-api/v1/images/generations`, { method: 'POST' })
  ]
  for (const request of requests) {
    const { response, fetches, writes } = runFetch(request)
    assert.equal(response, undefined, `${request.method} ${request.url} should go directly to the network`)
    assert.deepEqual(fetches, [])
    assert.deepEqual(writes, [])
  }
})

test('the site worker still refreshes and caches public static assets', async () => {
  const request = new Request(`${origin}/css/site.css`, { headers: { Accept: 'text/css' } })
  const { response, fetches, writes, pending } = runFetch(request)
  assert.equal((await response).status, 200)
  await Promise.all(pending)
  assert.equal(new URL(fetches[0]).pathname, '/css/site.css')
  assert.deepEqual(writes, [request.url])
})
