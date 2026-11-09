/**
 * Vite plugin (dev server only): serves ./dev-media at /__dev-media so
 * collection placeholders work without putting media in public/ or git.
 * Supports HTTP Range requests so videos can seek.
 */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'

const TYPES = {
  '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4', '.vtt': 'text/vtt; charset=utf-8',
}

export default function devMedia({ dir = 'dev-media', base = '/__dev-media' } = {}) {
  return {
    name: 'medsoils-dev-media',
    apply: 'serve',
    configureServer(server) {
      const root = resolve(server.config.root, dir)
      server.middlewares.use(base, (req, res, next) => {
        const rel = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^([/\\])+/, '')
        const file = join(root, rel)
        if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) return next()

        const { size } = statSync(file)
        res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream')
        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Cache-Control', 'no-cache')

        const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '')
        if (range) {
          const start = range[1] ? Number(range[1]) : 0
          const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
          res.statusCode = 206
          res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
          res.setHeader('Content-Length', end - start + 1)
          return createReadStream(file, { start, end }).pipe(res)
        }
        res.setHeader('Content-Length', size)
        createReadStream(file).pipe(res)
      })
    },
  }
}
