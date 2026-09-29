/**
 * Serve the built dist/ exactly the way GitHub Pages will, so the deployment
 * path (which contains a space, hence %20) can be verified before pushing.
 *
 *   npm run build && npm run serve:dist
 *   -> http://127.0.0.1:4320/T-Sim%20Game/dist/
 *
 * The repository publishes docs/ as the Pages root, so this server mounts the
 * parent directory and exposes dist/ under the same URL shape.
 */
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const SITE_ROOT = path.resolve(ROOT, '..')
const URL_PREFIX = `/${path.basename(ROOT)}/dist`
const PORT = Number(process.env.PORT || 4320)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
}

const server = http.createServer(async (req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    res.writeHead(400).end('bad request')
    return
  }

  if (pathname === '/' || pathname === URL_PREFIX) {
    res.writeHead(302, { Location: `${URL_PREFIX}/` }).end()
    return
  }
  if (!pathname.startsWith(`${URL_PREFIX}/`)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(`只有 ${URL_PREFIX}/ 下可访问`)
    return
  }

  const relative = pathname.slice(URL_PREFIX.length + 1) || 'index.html'
  const target = path.join(ROOT, 'dist', relative)
  if (!target.startsWith(path.join(ROOT, 'dist'))) {
    res.writeHead(403).end('forbidden')
    return
  }

  try {
    const data = await fs.readFile(target)
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    })
    res.end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('not found')
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`dist preview: http://127.0.0.1:${PORT}${URL_PREFIX.replace(/ /g, '%20')}/`)
  console.log(`(serving ${path.join(ROOT, 'dist')}, site root ${SITE_ROOT})`)
})
