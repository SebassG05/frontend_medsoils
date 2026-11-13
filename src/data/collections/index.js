/**
 * Registry of field-trip collections and read-only selectors.
 * Add a new trip by creating `<slug>.js` next to this file and listing it here.
 */
import adiyaman from './adiyaman.js'
import { isMediaConfigured, isRemote, thumbnailUrl } from '../../utils/media.js'

export const COLLECTIONS = [adiyaman]

/** Slugs that would shadow existing /resources/* routes. */
const RESERVED_SLUGS = new Set(['add'])

if (import.meta.env?.DEV) {
  for (const c of COLLECTIONS) {
    if (RESERVED_SLUGS.has(c.slug)) console.error(`[collections] "${c.slug}" is a reserved slug`)
    for (const d of c.days) {
      const ids = new Set(d.media.map(m => m.id))
      if (ids.size !== d.media.length) console.error(`[collections] duplicate media id in ${c.slug}/${d.slug}`)
      for (const m of d.media) if (!m.alt) console.error(`[collections] missing alt: ${c.slug}/${d.slug}/${m.id}`)
    }
  }
}

/**
 * A collection can be shown when its media resolve to real URLs: either every
 * src is absolute (Cloudinary) or a VITE_MEDIA_BASE_URL is configured.
 */
export function isCollectionAvailable(collection) {
  if (isMediaConfigured) return true
  const all = [collection.cover, ...collection.days.flatMap(d => d.media)].filter(m => m?.src)
  return all.every(m => isRemote(m.src))
}

export const AVAILABLE_COLLECTIONS = COLLECTIONS.filter(isCollectionAvailable)

export const getCollection = slug =>
  RESERVED_SLUGS.has(slug) ? null : AVAILABLE_COLLECTIONS.find(c => c.slug === slug) ?? null

export const getDay = (collection, daySlug) =>
  collection?.days.find(d => d.slug === daySlug) ?? null

export const findMedia = (day, id) => day?.media.find(m => m.id === id) ?? null

export function countMedia(media) {
  let photos = 0
  let videos = 0
  for (const m of media) m.type === 'video' ? videos++ : photos++
  return { photos, videos }
}

export function collectionStats(collection) {
  const all = collection.days.flatMap(d => d.media)
  return { days: collection.days.length, ...countMedia(all) }
}

export function collectionCover(collection) {
  if (collection.cover?.src) return collection.cover
  const day = getDay(collection, collection.cover?.day) ?? collection.days[0]
  return findMedia(day, collection.cover?.media) ?? day?.media[0] ?? null
}

/** Up to four items for the day card mosaic: the listed ids, else the first four. */
export function dayMosaic(day) {
  const picked = (day.mosaic ?? []).map(id => findMedia(day, id)).filter(Boolean)
  return (picked.length ? picked : day.media).slice(0, 4)
}

const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/** "12–15 October 2026", or null when dates are not set yet. */
export function formatDates(dates) {
  if (!dates?.start) return null
  const start = new Date(`${dates.start}T12:00:00`)
  const end = new Date(`${(dates.end || dates.start)}T12:00:00`)
  return dateFmt.formatRange(start, end)
}

export const formatDay = iso => (iso ? dateFmt.format(new Date(`${iso}T12:00:00`)) : null)

const weekdayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

/** "Sunday, 1 November" — for diary entries. */
export const formatWeekday = iso => (iso ? weekdayFmt.format(new Date(`${iso}T12:00:00`)) : null)

/** A field-trip photo/video shaped like an API resource, for ResourceCard. */
function toResource(c, d, m) {
  return {
    _id: `${c.slug}/${d.slug}/${m.id}`,
    source: 'collection', // opens in the site's viewer; not deletable from the admin
    collectionSlug: c.slug,
    type: m.type === 'video' ? 'video' : 'image',
    title: m.alt,
    description: [c.title, `Day ${d.number}`, formatDay(d.date)].filter(Boolean).join(' · '),
    tag: 'Field trip',
    duration: m.type === 'video' ? fmtDuration(m.duration) : '',
    url: `/resources/${c.slug}/${d.slug}?m=${d.media.indexOf(m) + 1}`,
    thumbnail: thumbnailUrl(m.type === 'video' ? m.poster : m.src),
  }
}

const fmtDuration = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

/** The hand-picked highlights (each collection's `featured`), at most `limit`. */
export function featuredResources(limit = 3) {
  return AVAILABLE_COLLECTIONS.flatMap(c => (c.featured ?? []).map(ref => {
    const day = getDay(c, ref.day)
    const media = findMedia(day, ref.media)
    return day && media ? toResource(c, day, media) : null
  })).filter(Boolean).slice(0, limit)
}

/** Stable ids for Motion shared-element transitions. */
export const layoutIds = {
  /** Clipping box of the collection card ↔ collection header. */
  cover: slug => `collection-cover-${slug}`,
  /** The photo inside it (keeps its own aspect ratio, see CoverFill). */
  coverImage: slug => `collection-cover-image-${slug}`,
  /** Mosaic box of the day card ↔ day header. */
  dayCover: (slug, day) => `day-cover-${slug}-${day}`,
  /** The mosaic's lead photo ↔ the day header photo. */
  dayCoverImage: (slug, day) => `day-cover-image-${slug}-${day}`,
}
