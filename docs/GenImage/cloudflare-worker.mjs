const PROXY_PREFIX = '/gpt-image-api'
const TARGET_ORIGIN = 'https://xkj.jisuanyun.vip'
const HEARTBEAT_INTERVAL_MS = 15_000
const ALLOWED_PATHS = new Set([
  '/v1/models',
  '/v1/images/generations',
  '/v1/images/edits'
])

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
})

const requestIdHeaders = (requestId) => requestId ? { 'X-Request-Id': requestId } : {}

const getErrorMessage = (payload, status) => {
  const apiError = payload && typeof payload === 'object' ? payload.error : undefined
  if (typeof apiError === 'string') return apiError
  if (apiError && typeof apiError === 'object' && typeof apiError.message === 'string') return apiError.message
  if (payload && typeof payload === 'object' && typeof payload.message === 'string') return payload.message
  if (payload && typeof payload === 'object' && typeof payload.detail === 'string') return payload.detail
  return `GPT Image 上游请求失败（HTTP ${status}）。`
}

const jsonError = (message, status, headers = {}) => new Response(
  JSON.stringify({ error: { message } }),
  {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers
    }
  }
)

const streamUpstreamJson = (request, targetUrl, requestHeaders, cors) => {
  const encoder = new TextEncoder()
  const abortController = new AbortController()
  let upstreamReader
  let heartbeatTimer
  let cancelled = false

  const body = new ReadableStream({
    start(controller) {
      const enqueueText = (text) => controller.enqueue(encoder.encode(text))
      const stopHeartbeat = () => {
        if (heartbeatTimer !== undefined) clearInterval(heartbeatTimer)
        heartbeatTimer = undefined
      }

      // Send response headers and a valid JSON whitespace byte immediately. This
      // keeps Cloudflare's proxy connection active while the image API works.
      enqueueText(' \n')
      heartbeatTimer = setInterval(() => {
        if (!cancelled) enqueueText(' \n')
      }, HEARTBEAT_INTERVAL_MS)

      void (async () => {
        try {
          const upstreamResponse = await fetch(targetUrl.toString(), {
            method: request.method,
            headers: requestHeaders,
            body: request.method === 'GET' ? undefined : request.body,
            redirect: 'follow',
            signal: abortController.signal
          })

          stopHeartbeat()

          if (!upstreamResponse.ok) {
            const responseText = await upstreamResponse.text()
            let payload
            try {
              payload = JSON.parse(responseText)
            } catch {
              payload = null
            }
            enqueueText(JSON.stringify({
              error: {
                message: getErrorMessage(payload, upstreamResponse.status),
                status: upstreamResponse.status
              }
            }))
            return
          }

          if (!upstreamResponse.body) {
            enqueueText(JSON.stringify({
              error: { message: 'GPT Image 上游返回了空响应。', status: upstreamResponse.status }
            }))
            return
          }

          upstreamReader = upstreamResponse.body.getReader()
          while (!cancelled) {
            const { done, value } = await upstreamReader.read()
            if (done) break
            controller.enqueue(value)
          }
        } catch (error) {
          if (cancelled) return
          const requestId = request.headers.get('cf-ray')
          console.error('GPT Image upstream request failed', error)
          enqueueText(JSON.stringify({
            error: {
              message: 'GPT Image 上游连接在生成完成前中断。图片可能仍在上游处理，请稍后重试。',
              requestId
            }
          }))
        } finally {
          stopHeartbeat()
          if (!cancelled) controller.close()
        }
      })()
    },
    cancel(reason) {
      cancelled = true
      if (heartbeatTimer !== undefined) clearInterval(heartbeatTimer)
      abortController.abort(reason)
      return upstreamReader?.cancel(reason)
    }
  })

  return new Response(body, {
    status: 200,
    headers: {
      ...cors,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-transform'
    }
  })
}

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url)
    const origin = request.headers.get('Origin') || incomingUrl.origin
    const cors = corsHeaders(origin)

    if (origin !== incomingUrl.origin) {
      return jsonError('Cross-origin requests are not allowed', 403, cors)
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    if (!incomingUrl.pathname.startsWith(`${PROXY_PREFIX}/`)) {
      return jsonError('Not Found', 404, cors)
    }

    const targetPath = incomingUrl.pathname.slice(PROXY_PREFIX.length)
    if (!ALLOWED_PATHS.has(targetPath)) {
      return jsonError('Unsupported GPT Image API path', 404, cors)
    }

    if (!['GET', 'POST'].includes(request.method)) {
      return jsonError('Method Not Allowed', 405, cors)
    }

    const targetUrl = new URL(targetPath + incomingUrl.search, TARGET_ORIGIN)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.delete('host')
    requestHeaders.delete('origin')
    requestHeaders.delete('referer')

    if (request.method === 'GET') {
      try {
        const upstreamResponse = await fetch(targetUrl.toString(), {
          method: request.method,
          headers: requestHeaders,
          redirect: 'follow'
        })
        const responseHeaders = new Headers(upstreamResponse.headers)
        Object.entries(cors).forEach(([key, value]) => responseHeaders.set(key, value))
        return new Response(upstreamResponse.body, {
          status: upstreamResponse.status,
          statusText: upstreamResponse.statusText,
          headers: responseHeaders
        })
      } catch (error) {
        const requestId = request.headers.get('cf-ray')
        console.error('GPT Image upstream request failed', error)
        return jsonError(
          'GPT Image 上游连接失败，请稍后重试。',
          502,
          { ...cors, ...requestIdHeaders(requestId) }
        )
      }
    }

    return streamUpstreamJson(request, targetUrl, requestHeaders, cors)
  }
}
