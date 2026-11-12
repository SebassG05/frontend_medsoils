import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

/**
 * Build-only, two jobs:
 *
 * 1. Validate src/data/dissemination/interviews.js before bundling, so a badly
 *    filled interview fails `npm run build` (the server builds after
 *    `git pull`) instead of breaking the live section.
 * 2. Write dist/dissemination/index.html and one dist/dissemination/<slug>/index.html
 *    per interview — copies of index.html with their own <title>, description,
 *    Open Graph and JSON-LD, so links shared on WhatsApp/LinkedIn/Slack (which
 *    don't run JavaScript) show a proper preview. The SPA boots on top as usual.
 *    Requires the server to try `$uri/` before falling back to /index.html
 *    (nginx: try_files $uri $uri/ /index.html).
 *
 * Env: VITE_SITE_URL (default https://medsoil-challenge.eu), VITE_MEDIA_BASE_URL.
 */
export default function disseminationPages() {
  let config
  const load = file => import(pathToFileURL(path.resolve(config.root, file)).href)

  return {
    name: 'medsoils-dissemination-pages',
    apply: 'build',
    configResolved(resolved) { config = resolved },

    async buildStart() {
      const [{ INTERVIEWS }, { validateInterviews }] = await Promise.all([
        load('src/data/dissemination/interviews.js'),
        load('src/data/dissemination/schema.js'),
      ])
      try {
        validateInterviews(INTERVIEWS)
      } catch (error) {
        this.error(`src/data/dissemination/interviews.js — ${error.message}`)
      }
    },

    async closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir)
      const env = loadEnv(config.mode, config.root, '')
      const origin = (env.VITE_SITE_URL || 'https://medsoil-challenge.eu').replace(/\/$/, '')
      const mediaBase = env.VITE_MEDIA_BASE_URL || ''

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

/**
 * JSON safe to place inside <script type="application/ld+json">: characters
 * that could end the script element or break the line are written as \u escapes
 * (JSON.parse reads them back as the same text).
 */
export function jsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028') // LINE SEPARATOR
    .replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029') // PARAGRAPH SEPARATOR
}

/** index.html with the page's title and head tags (function replacers: `$&` in data stays literal). */
export function inject(html, page) {
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
    page.jsonLd ? `<script data-static-page-meta type="application/ld+json">${jsonForScript(page.jsonLd)}</script>` : '',
  ].filter(Boolean).join('\n    ')
  const title = `<title>${attr(page.title)} · MEDSOILS Challenge</title>`
  return html
    .replace(/<title>[^<]*<\/title>/, () => title)
    .replace('</head>', () => `    ${head}\n  </head>`)
}
