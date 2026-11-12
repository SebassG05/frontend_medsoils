import { useEffect } from 'react'

const SITE = 'MEDSOILS Challenge'
const DEFAULT_TITLE = 'MedSoils Challenge'

// Static pages written at build time (scripts/vite-dissemination-pages.js) carry
// their own tags for link previews. Once the app runs, the hook owns the head:
// drop them so navigating elsewhere doesn't leave an interview's tags behind.
if (typeof document !== 'undefined' && document.querySelector('[data-static-page-meta]')) {
  document.querySelectorAll('[data-static-page-meta]').forEach(el => el.remove())
  document.title = DEFAULT_TITLE
}

/** Sets an element attribute, returning a function that restores the previous state. */
function upsert(selector, create, attr, value) {
  let el = document.head.querySelector(selector)
  const created = !el
  if (created) {
    el = create()
    document.head.appendChild(el)
  }
  const previous = el.getAttribute(attr)
  el.setAttribute(attr, value)
  return () => (created ? el.remove() : el.setAttribute(attr, previous))
}

const meta = (key, keyAttr) => () => {
  const el = document.createElement('meta')
  el.setAttribute(keyAttr, key)
  return el
}

/**
 * Title, description, canonical, Open Graph, Twitter card and one JSON-LD
 * block for the current page; everything is restored on leave.
 * Pass `null` to leave the head untouched (e.g. while loading).
 * @param {{ title: string, description: string, image?: string, url: string, type: string, jsonLd?: object | null } | null} page
 */
export default function usePageMeta(page) {
  const key = page ? JSON.stringify(page) : ''

  useEffect(() => {
    if (!page) return undefined
    const restore = []
    const previousTitle = document.title
    document.title = `${page.title} · ${SITE}`
    restore.push(() => { document.title = previousTitle })

    const tags = [
      ['name', 'description', page.description],
      ['property', 'og:title', page.title],
      ['property', 'og:description', page.description],
      ['property', 'og:type', page.type],
      ['property', 'og:url', page.url],
      ['property', 'og:site_name', SITE],
      ['property', 'og:image', page.image],
      ['name', 'twitter:card', page.image ? 'summary_large_image' : 'summary'],
    ]
    for (const [attr, name, value] of tags) {
      if (value) restore.push(upsert(`meta[${attr}="${name}"]`, meta(name, attr), 'content', value))
    }
    restore.push(upsert('link[rel="canonical"]', () => {
      const el = document.createElement('link')
      el.rel = 'canonical'
      return el
    }, 'href', page.url))

    if (page.jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'page-jsonld'
      script.textContent = JSON.stringify(page.jsonLd)
      document.head.appendChild(script)
      restore.push(() => script.remove())
    }

    return () => restore.reverse().forEach(fn => fn())
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
}
