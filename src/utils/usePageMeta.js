import { useEffect } from 'react'
import { createMetaStack } from './metaStack'

const SITE = 'MEDSOILS Challenge'
const DEFAULT_TITLE = 'MedSoils Challenge' // index.html <title>
const MANAGED = 'data-page-meta'

// Static pages written at build time (scripts/vite-dissemination-pages.js) carry
// their own tags for link previews. Once the app runs, this module owns the
// head: drop them so navigating elsewhere doesn't leave an interview's tags behind.
if (typeof document !== 'undefined' && document.querySelector('[data-static-page-meta]')) {
  document.querySelectorAll('[data-static-page-meta]').forEach(el => el.remove())
  document.title = DEFAULT_TITLE
}

function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector)
  if (!value) { el?.remove(); return }
  if (!el) {
    el = create()
    el.setAttribute(MANAGED, '')
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const metaTag = (attr, name) => () => {
  const el = document.createElement('meta')
  el.setAttribute(attr, name)
  return el
}

/** Writes one page's tags into <head>, or clears them (site defaults) for null. */
function apply(page) {
  document.title = page ? `${page.title} · ${SITE}` : DEFAULT_TITLE
  const tags = [
    ['name', 'description', page?.description],
    ['property', 'og:title', page?.title],
    ['property', 'og:description', page?.description],
    ['property', 'og:type', page?.type],
    ['property', 'og:url', page?.url],
    ['property', 'og:site_name', page && SITE],
    ['property', 'og:image', page?.image],
    ['name', 'twitter:card', page && (page.image ? 'summary_large_image' : 'summary')],
  ]
  for (const [attr, name, value] of tags) setTag(`meta[${attr}="${name}"][${MANAGED}]`, metaTag(attr, name), 'content', value)
  setTag(`link[rel="canonical"][${MANAGED}]`, () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', page?.url)
  setTag(`script#page-jsonld[${MANAGED}]`, () => Object.assign(document.createElement('script'), { id: 'page-jsonld', type: 'application/ld+json' }),
    'data-v', page?.jsonLd ? '1' : null)
  const script = document.head.querySelector(`script#page-jsonld[${MANAGED}]`)
  if (script) script.textContent = JSON.stringify(page.jsonLd)
}

const stack = createMetaStack(apply)

/**
 * Title, description, canonical, Open Graph, Twitter card and one JSON-LD
 * block for the current page. The newest mounted page wins, so a page that is
 * still animating out never overwrites the one that replaced it.
 * Pass `null` to leave the head untouched (e.g. while loading).
 * @param {{ title: string, description: string, image?: string, url: string, type: string, jsonLd?: object | null } | null} page
 */
export default function usePageMeta(page) {
  const key = page ? JSON.stringify(page) : ''
  useEffect(() => {
    if (!page) return undefined
    return stack.push(page)
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
}
