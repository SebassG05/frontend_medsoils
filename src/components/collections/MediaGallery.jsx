import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useRef } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AlertCircle, Images, Play } from 'lucide-react'
import JustifiedGrid from './JustifiedGrid'
import MediaImage from './MediaImage'
import { countMedia } from '../../data/collections'
import { COPY } from '../../data/collections/copy'

/*
 * MediaGallery — compound component for one set of photos and videos.
 *
 *   <MediaGallery.Root media={day.media} status={status} onRetry={retry}>
 *     <MediaGallery.Toolbar />
 *     <MediaGallery.Grid />
 *     <MediaGallery.Lightbox />
 *   </MediaGallery.Root>
 *
 * State lives in the URL so it can be shared and survives reload/Back:
 *   ?show=photos|videos   filter (absent = all)
 *   ?m=5                  item 5 (1-based, position in the full list) is open
 */

const GalleryContext = createContext(null)

export function useGallery() {
  const ctx = useContext(GalleryContext)
  if (!ctx) throw new Error('MediaGallery parts must be rendered inside <MediaGallery.Root>')
  return ctx
}

const FILTERS = ['all', 'photos', 'videos']

// The viewer is only downloaded when needed; hovering or focusing a tile warms it up.
const loadLightbox = () => import('./Lightbox')
const LazyLightbox = lazy(loadLightbox)
const matches = (filter, m) => filter === 'all' || (filter === 'videos' ? m.type === 'video' : m.type === 'photo')


function Root({ media, status = 'ready', onRetry, children }) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const filter = FILTERS.includes(params.get('show')) ? params.get('show') : 'all'
  const items = useMemo(() => media.filter(m => matches(filter, m)), [media, filter])
  const counts = useMemo(() => countMedia(media), [media])

  const mParam = Number(params.get('m'))
  const current = Number.isInteger(mParam) && mParam >= 1 && mParam <= media.length ? media[mParam - 1] : null
  // A shared link may point at an item hidden by the filter; still open it.
  const viewerItems = current && !items.includes(current) ? media : items

  const searchWith = useCallback((changes) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) v == null ? next.delete(k) : next.set(k, v)
    const s = next.toString()
    return s ? `?${s}` : ''
  }, [params])

  const value = useMemo(() => ({
    media,
    items,
    viewerItems,
    counts,
    filter,
    status,
    onRetry,
    current,
    /** 1-based number of an item in the full list (what ?m= holds). */
    numberOf: item => media.indexOf(item) + 1,
    hrefFor: item => ({ search: searchWith({ m: media.indexOf(item) + 1 }) }),
    setFilter: f => setParams(p => {
      const next = new URLSearchParams(p)
      f === 'all' ? next.delete('show') : next.set('show', f)
      next.delete('m')
      return next
    }, { replace: true }),
    /** Move to another item while the viewer is open (no new history entry). */
    go: item => navigate({ search: searchWith({ m: media.indexOf(item) + 1 }) }, { replace: true, state: location.state }),
    /** Close: step back if we opened it, otherwise just drop ?m=. */
    close: () => (location.state?.lightbox ? navigate(-1) : navigate({ search: searchWith({ m: null }) }, { replace: true })),
  }), [media, items, viewerItems, counts, filter, status, onRetry, current, searchWith, setParams, navigate, location.state])

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

function Toolbar() {
  const { counts, filter, setFilter, status } = useGallery()
  const labelFor = { all: COPY.gallery.filters.all, photos: COPY.gallery.filters.photos, videos: COPY.gallery.filters.videos }
  const countFor = { all: counts.photos + counts.videos, photos: counts.photos, videos: counts.videos }
  const ready = status === 'ready'

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div>
        <h2 id="gallery-heading" tabIndex={-1} className="sr-only">{COPY.gallery.heading}</h2>
        {ready && <p className="text-[17px] text-gray-600 tabular-nums">{COPY.gallery.summary(counts.photos, counts.videos)}</p>}
      </div>
      {ready && counts.photos > 0 && counts.videos > 0 && (
        <div role="group" aria-label={COPY.gallery.filterLabel} className="flex flex-wrap items-center gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-[var(--motion-fast)]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 ${
                filter === f
                  ? 'border-orange-500 bg-orange-500 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {labelFor[f]}
              <span className={`text-xs tabular-nums ${filter === f ? 'text-white/85' : 'text-gray-500'}`}>{countFor[f]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Tile({ item }) {
  const { media, hrefFor, numberOf } = useGallery()
  const isVideo = item.type === 'video'
  return (
    <Link
      to={hrefFor(item)}
      state={{ lightbox: true }}
      preventScrollReset
      data-media-id={item.id}
      onPointerEnter={loadLightbox}
      onFocus={loadLightbox}
      aria-label={COPY.gallery.openItem(numberOf(item), media.length, item.alt) + (isVideo ? `, ${COPY.durationSpoken(item.duration)}` : '')}
      className="group relative block h-full w-full overflow-hidden rounded-xl outline-none
        focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
    >
      <MediaImage
        media={item}
        alt=""
        sizes={TILE_SIZES}
        className="h-full w-full"
        imgClassName="transition-transform duration-[var(--motion-cover)] ease-out-expo pointer-fine:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      {isVideo && (
        <>
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-gray-900 shadow-md transition-transform duration-[var(--motion-base)] pointer-fine:group-hover:scale-105">
            <Play size={20} fill="currentColor" className="translate-x-0.5" />
          </span>
          <span aria-hidden="true" className="absolute bottom-2 right-2 rounded-md bg-black/65 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
            {COPY.duration(item.duration)}
          </span>
        </>
      )}
    </Link>
  )
}

/** Grey blocks shaped like justified rows, for the loading state. */
const SKELETON = [1.5, 0.67, 1.5, 1.33, 1, 1.78, 0.67, 1.5, 1.5, 0.67, 1.33, 1.5].map((r, i) => ({ id: `s${i}`, width: r * 100, height: 100 }))

function StateMessage({ icon: Icon, title, body, action, role }) {
  return (
    <div role={role} className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] bg-gray-50 px-6 py-16 text-center">
      <Icon size={36} strokeWidth={1.4} aria-hidden="true" className="text-gray-400" />
      <p className="text-lg font-semibold text-gray-800">{title}</p>
      {body && <p className="text-[15px] text-gray-600">{body}</p>}
      {action}
    </div>
  )
}

const actionButton = 'mt-3 inline-flex min-h-11 items-center rounded-full bg-orange-500 px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-[var(--motion-fast)] hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2'

function Grid() {
  const { media, items, status, onRetry, filter, setFilter } = useGallery()

  if (status === 'loading') {
    return (
      <div aria-busy="true">
        <p role="status" className="sr-only">{COPY.gallery.loading}</p>
        <JustifiedGrid
          items={SKELETON}
          reveal={false}
          aria-hidden="true"
          renderItem={() => <div className="h-full w-full animate-pulse rounded-xl bg-gray-100 motion-reduce:animate-none" />}
        />
      </div>
    )
  }
  if (status === 'error') {
    return (
      <StateMessage
        role="alert"
        icon={AlertCircle}
        title={COPY.gallery.errorTitle}
        body={COPY.gallery.errorBody}
        action={<button type="button" onClick={onRetry} className={actionButton}>{COPY.gallery.retry}</button>}
      />
    )
  }
  if (media.length === 0) {
    return <StateMessage icon={Images} title={COPY.gallery.emptyTitle} body={COPY.gallery.emptyBody} />
  }
  if (items.length === 0) {
    return (
      <StateMessage
        icon={Images}
        title={COPY.gallery.emptyFiltered(COPY.gallery.filters[filter].toLowerCase())}
        action={<button type="button" onClick={() => setFilter('all')} className={actionButton}>{COPY.gallery.filters.all}</button>}
      />
    )
  }
  return (
    <JustifiedGrid
      key={filter}
      items={items}
      label={`${COPY.gallery.heading}, ${COPY.counts.items(items.length)}`}
      renderItem={item => <Tile item={item} />}
    />
  )
}

/** Same `sizes` the viewer uses for its placeholder layer (keep in sync with Lightbox). */
const TILE_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 40vw, 50vw'

/**
 * Mounts the viewer while ?m= points at an item. Keeps the last item during
 * the closing animation, then returns focus to that item's thumbnail.
 */
function Lightbox() {
  const { current } = useGallery()
  const location = useLocation()
  const last = useRef(null)
  if (current) last.current = current
  const fromTile = Boolean(location.state?.lightbox)

  const restoreFocus = () => {
    const id = last.current?.id
    const tile = id && document.querySelector(`[data-media-id="${CSS.escape(id)}"]`)
    ;(tile || document.getElementById('gallery-heading'))?.focus({ preventScroll: true })
  }

  return (
    <AnimatePresence onExitComplete={restoreFocus}>
      {current && (
        <Suspense key="viewer" fallback={null}>
          <LazyLightbox item={current} fromTile={fromTile} />
        </Suspense>
      )}
    </AnimatePresence>
  )
}

const MediaGallery = { Root, Toolbar, Grid, Lightbox }
export default MediaGallery
