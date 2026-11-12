import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

/**
 * Build-only: writes dist/dissemination/index.html and one
 * dist/dissemination/<slug>/index.html per interview — copies of index.html
 * with their own <title>, description, Open Graph and JSON-LD, so links shared
 * on WhatsApp/LinkedIn/Slack (which don't run JavaScript) show a proper preview.
 * The SPA boots on top as usual. Requires the server to try `$uri/` before
 * falling back to /index.html (nginx: try_files $uri $uri/ /index.html).
 *
 * Env: VITE_SITE_URL (default https://medsoil-challenge.eu), VITE_MEDIA_BASE_URL.
 */
export default function disseminationPages() {
  let config
  return {
    name: 'medsoils-dissemination-pages',
    apply: 'build',
    configResolved(resolved) { config = resolved },
    async closeBundle() {
      const root = config.root
      const outDir = path.resolve(root, config.build.outDir)
      const env = loadEnv(config.mode, root, '')
      const origin = (env.VITE_SITE_URL || 'https://medsoil-challenge.eu').replace(/\/$/, '')
      const mediaBase = env.VITE_MEDIA_BASE_URL || ''
      const load = file => import(pathToFileURL(path.resolve(root, file)).href)

      const [{ INTERVIEWS }, { buildInterviewMeta, buildListingMeta, SHARE_FALLBACK_IMAGE }, { COPY }] = await Promise.all([
        load('src/data/dissemination/interviews.js'),
        load('src/data/dissemination/meta.js'),
        load('src/data/dissemination/copy.js'),
      ])
      const template = await readFile(path.join(outDir, 'index.html'), 'utf8')

      const pages = [
        ['dissemination', buildListingMeta(COPY, { origin })],
        ...INTERVIEWS.map(it => [`dissemination/${it.slug}`, buildInterviewMeta(it, { origin, mediaBase, fallbackImage: SHARE_FALLBACK_IMAGE })]),
      ]
      for (const [dir, page] of pages) {
        await mkdir(path.join(outDir, dir), { recursive: true })
        await writeFile(path.join(outDir, dir, 'index.html'), inject(template, page))
      }
      config.logger.info(`[dissemination] wrote ${pages.length} static page(s) for link previews`)
    },
  }
}

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function inject(html, page) {
  const tag = (key, name, value) => (value ? `<meta data-static-page-meta ${key}="${name}" content="${attr(value)}" />` : '')
  const head = [
    tag('name', 'description', page.description),
    tag('property', 'og:title', page.title),
    tag('property', 'og:description', page.description),
    tag('property', 'og:type', page.type),
    tag('property', 'og:url', page.url),
    tag('property', 'og:site_name', 'MEDSOILS Challenge'),
    tag('property', 'og:image', page.image),
    tag('name', 'twitter:card', page.image ? 'summary_large_image' : 'summary'),
    `<link data-static-page-meta rel="canonical" href="${attr(page.url)}" />`,
    page.jsonLd ? `<script data-static-page-meta type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, '\u003c')}</script>` : '',
  ].filter(Boolean).join('\n    ')
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${attr(page.title)} · MEDSOILS Challenge</title>`)
    .replace('</head>', `    ${head}\n  </head>`)
}
