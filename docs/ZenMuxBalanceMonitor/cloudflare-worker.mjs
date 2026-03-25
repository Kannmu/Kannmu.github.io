const corsHeaders = (request) => {
  const origin = request.headers.get('Origin') || '*'
  const requestHeaders = request.headers.get('Access-Control-Request-Headers') || 'Authorization, Content-Type'
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': requestHeaders,
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  }
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request)
      })
    }

    const incomingUrl = new URL(request.url)
    if (!incomingUrl.pathname.startsWith('/api/')) {
      return new Response('Not Found', { status: 404 })
    }

    const targetUrl = new URL(incomingUrl.pathname + incomingUrl.search, 'https://zenmux.ai')
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('host', 'zenmux.ai')

    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: requestHeaders,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'follow'
    })

    const headers = new Headers(response.headers)
    const cors = corsHeaders(request)
    for (const [key, value] of Object.entries(cors)) {
      headers.set(key, value)
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  }
}
