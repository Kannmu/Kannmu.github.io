const PROXY_PREFIX = '/gpt-image-api'
const TARGET_ORIGIN = 'https://xkj.jisuanyun.vip'
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

    let upstreamResponse
    try {
      upstreamResponse = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: requestHeaders,
        body: request.method === 'GET' ? undefined : request.body,
        redirect: 'follow'
      })
    } catch (error) {
      const requestId = request.headers.get('cf-ray')
      console.error('GPT Image upstream request failed', error)
      return jsonError(
        'GPT Image 上游连接在生成完成前中断。图片可能仍在上游处理，请稍后重试。',
        502,
        { ...cors, ...requestIdHeaders(requestId) }
      )
    }

    const responseHeaders = new Headers(upstreamResponse.headers)
    Object.entries(cors).forEach(([key, value]) => responseHeaders.set(key, value))

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders
    })
  }
}
