/**
 * Registry of field-trip collections and read-only selectors.
 * Add a new trip by creating `<slug>.js` next to this file and listing it here.
 */
import adiyaman from './adiyaman.js'

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

export const getCollection = slug =>
  RESERVED_SLUGS.has(slug) ? null : COLLECTIONS.find(c => c.slug === slug) ?? null

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
