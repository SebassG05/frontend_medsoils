import { INTERVIEWS } from './interviews'
import { validateInterviews } from './schema'

/** @typedef {import('./schema').Interview} Interview */

export const TYPES = ['video', 'audio', 'text']

const byDateDesc = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)

/**
 * The interviews to show, newest first. In development, `?demo=interviews&n=0|1|4|12|50|worst`
 * swaps in fictional fixtures so the design can be judged with content; the
 * whole branch is compiled away in production builds.
 * @param {URLSearchParams} params
 * @returns {Promise<Interview[]>}
 */
export async function loadInterviews(params) {
  let list = INTERVIEWS
  if (import.meta.env.DEV) {
    if (params.get('demo') === 'interviews') {
      const fixtures = {
        1: () => import('./__fixtures__/interviews-1.js'),
        4: () => import('./__fixtures__/interviews-4.js'),
        12: () => import('./__fixtures__/interviews-12.js'),
        // break-ui states: empty, a long list, worst-case values
        0: () => import('./__fixtures__/interviews-0.js'),
        50: () => import('./__fixtures__/interviews-50.js'),
        worst: () => import('./__fixtures__/interviews-worst.js'),
      }
      list = (await (fixtures[params.get('n')] ?? fixtures[12])()).default
    }
    validateInterviews(list)
  }
  return [...list].sort(byDateDesc)
}

/** @returns {{ q: string, type: Interview['type'] | null, lang: string | null }} */
export function parseFilters(params) {
  const type = params.get('type')
  return {
    q: (params.get('q') ?? '').trim(),
    type: TYPES.includes(type) ? type : null,
    lang: params.get('lang') || null,
  }
}

const fold = s => (s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const haystack = it => fold([
  it.title, it.summary, it.interviewee?.name, it.interviewee?.role, it.interviewee?.institution, ...(it.tags ?? []),
].join(' '))

/**
 * Search (accent- and case-insensitive), type and language. A language no
 * interview has is ignored rather than producing an empty page.
 */
export function filterInterviews(list, { q = '', type = null, lang = null } = {}) {
  const needle = fold(q.trim())
  const useLang = lang && availableLanguages(list).includes(lang)
  return list.filter(it =>
    (!type || it.type === type) &&
    (!useLang || it.language === lang) &&
    (!needle || haystack(it).includes(needle)))
}

/** The newest interview marked `featured`, else the newest one, else null. */
export function pickFeatured(list) {
  const sorted = [...list].sort(byDateDesc)
  return sorted.find(it => it.featured) ?? sorted[0] ?? null
}

export function countByType(list) {
  const counts = { all: list.length, video: 0, audio: 0, text: 0 }
  for (const it of list) counts[it.type] += 1
  return counts
}

export function availableLanguages(list) {
  return [...new Set(list.map(it => it.language))]
}

export function getBySlug(list, slug) {
  return list.find(it => it.slug === slug) ?? null
}

/** Up to n other interviews: same type and shared tags first, then the newest. */
export function related(list, slug, n = 3) {
  const self = getBySlug(list, slug)
  if (!self) return []
  const tags = new Set(self.tags ?? [])
  const score = it => (it.type === self.type ? 1 : 0) + (it.tags ?? []).filter(t => tags.has(t)).length
  return list
    .filter(it => it.slug !== slug)
    .sort((a, b) => score(b) - score(a) || byDateDesc(a, b))
    .slice(0, n)
}

const DATE_FMT = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
/** '2026-10-14' → '14 Oct 2026', the same in every timezone. */
export const formatDate = iso => DATE_FMT.format(new Date(`${iso}T00:00:00Z`))

/** 760 → '12:40', 3725 → '1:02:05'. */
export function formatDuration(seconds) {
  const s = Math.round(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`
}

/** 760 → '13 min', 3725 → '1 h 2 min': a length, so it can't be misread as a time of day. */
export function formatMinutes(seconds) {
  const total = Math.max(1, Math.round(seconds / 60))
  const h = Math.floor(total / 60)
  const m = total % 60
  return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`
}

/** Reading time at 220 words per minute, at least 1 minute. */
export function readingMinutes(transcript = []) {
  const words = transcript.reduce((n, t) => n + t.text.trim().split(/\s+/).filter(Boolean).length, 0)
  return Math.max(1, Math.round(words / 220))
}

/** Shared-element ids: the card cover morphs into the detail page's player. */
export const layoutIds = {
  cover: slug => `interview-cover-${slug}`,
}

export { buildInterviewMeta, buildListingMeta, SHARE_FALLBACK_IMAGE } from './meta'
