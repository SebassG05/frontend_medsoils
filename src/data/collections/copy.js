/**
 * Every user-facing string used by the collections feature (Field trips →
 * collection → day gallery → lightbox). Kept in one place so it can be moved
 * into an i18n catalogue later without touching components.
 */

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

export const COPY = {
  section: {
    eyebrow: 'Field trips',
    title: 'Field trips',
    intro: 'Photo and video journals from MEDSOILS Challenge visits.',
  },

  breadcrumbs: {
    label: 'Breadcrumb',
    root: 'Resources',
  },

  counts: {
    days: n => plural(n, 'day', 'days'),
    photos: n => plural(n, 'photo', 'photos'),
    videos: n => plural(n, 'video', 'videos'),
    items: n => plural(n, 'item', 'items'),
  },

  collection: {
    openLabel: title => `Open ${title}`,
    daysHeading: 'Days',
    hostedBy: name => `With our partner ${name}`,
    notFoundTitle: 'Collection not found',
    notFoundBody: 'This field trip doesn’t exist or has been moved.',
    notFoundCta: 'Back to Resources',
  },

  day: {
    label: n => `Day ${n}`,
    cardTitle: (n, title) => `Day ${n} · ${title}`,
    openLabel: (n, title) => `Open Day ${n}: ${title}`,
    notFoundTitle: 'Day not found',
    notFoundBody: 'This day isn’t part of the collection.',
    notFoundCta: collectionTitle => `Back to ${collectionTitle}`,
  },

  gallery: {
    heading: 'Photos & videos',
    filterLabel: 'Show',
    filters: { all: 'All', photos: 'Photos', videos: 'Videos' },
    summary: (photos, videos) =>
      [photos && plural(photos, 'photo', 'photos'), videos && plural(videos, 'video', 'videos')]
        .filter(Boolean).join(' · '),
    openItem: (index, total, alt) => `Open item ${index} of ${total}${alt ? `: ${alt}` : ''}`,
    playVideo: 'Play video',
    loading: 'Loading photos and videos…',
    emptyTitle: 'Photos from this day are on their way.',
    emptyBody: 'Check back soon.',
    emptyFiltered: kind => `No ${kind} for this day yet.`,
    errorTitle: 'We couldn’t load this gallery.',
    errorBody: 'Check your connection and try again.',
    retry: 'Try again',
  },

  lightbox: {
    label: 'Media viewer',
    counter: (index, total) => `${index} / ${total}`,
    counterSpoken: (index, total) => `Item ${index} of ${total}`,
    previous: 'Previous',
    next: 'Next',
    close: 'Close',
    videoFallback: 'Your browser can’t play this video.',
  },

  duration: seconds => {
    const m = Math.floor(seconds / 60)
    const s = String(Math.round(seconds % 60)).padStart(2, '0')
    return `${m}:${s}`
  },
}
