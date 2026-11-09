import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, usePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import MediaImage from './MediaImage'
import { useGallery } from './MediaGallery'
import { COPY } from '../../data/collections/copy'
import { imageSources, posterUrl, trackUrl, videoUrl } from '../../utils/media'
import { DURATION, EASE, SPRING } from '../../utils/motion'

/* Layout of the viewer: top bar, caption area and side gutters for the arrows. */
const TOP = 64
const BOTTOM = 96
const sideGutter = vw => (vw >= 640 ? 80 : 12)

function useViewport() {
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

/** Largest box with the item's aspect ratio that fits the stage, centred. */
function fitBox(item, vp) {
  const side = sideGutter(vp.w)
  const maxW = vp.w - side * 2
  const maxH = vp.h - TOP - BOTTOM
  const ar = item.width / item.height
  const w = Math.min(maxW, maxH * ar, item.width)
  const h = w / ar
  return { w, h, x: (vp.w - w) / 2, y: TOP + (maxH - h) / 2 }
}

const tileOf = id => document.querySelector(`[data-media-id="${CSS.escape(id)}"]`)

/** Transform that makes `box` sit exactly on the item's thumbnail. */
function towardsTile(id, box, { scrollIntoView = false } = {}) {
  const tile = tileOf(id)
  if (!tile) return null
  let r = tile.getBoundingClientRect()
  if (scrollIntoView && (r.bottom < TOP || r.top > window.innerHeight)) {
    window.scrollTo(0, window.scrollY + r.top - (window.innerHeight - r.height) / 2)
    r = tile.getBoundingClientRect()
  }
  const scale = r.width / box.w
  return {
    x: r.left + r.width / 2 - (box.x + box.w / 2),
    y: r.top + r.height / 2 - (box.y + box.h / 2),
    scale,
    borderRadius: 12 / scale,
  }
}

function preload(item) {
  if (!item || item.type !== 'photo') return
  const img = new Image()
  img.sizes = '100vw'
  img.srcset = imageSources(item.src).webp
}

/** Same `sizes` as the grid tiles, so the browser reuses the cached thumbnail. */
export const TILE_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 40vw, 50vw' // keep in sync with MediaGallery

function Slide({ item, box, direction, zoomFromTile, closing, onClosed, onSwipe, reduce }) {
  // Captured once: only the slide the viewer opened with zooms from its thumbnail.
  const [openFromTile] = useState(() => zoomFromTile.current)
  const [isFirst] = useState(() => zoomFromTile.current !== null)
  useEffect(() => { zoomFromTile.current = null }, [zoomFromTile])

  const variants = {
    open: () => (openFromTile && towardsTile(item.id, box)) || { opacity: 0, scale: 0.96 },
    enter: dir => ({ x: dir * 80, opacity: 0 }),
    center: { x: 0, y: 0, scale: 1, opacity: 1, borderRadius: 8 },
    exit: dir => ({ x: dir * -80, opacity: 0, transition: { duration: DURATION.base, ease: EASE.out } }),
  }
  const initial = reduce ? { opacity: 0 } : isFirst ? 'open' : 'enter'

  // Closing: fly back onto the thumbnail of the item on screen now (scrolling it
  // into view first if needed), then let the parent unmount.
  const [closeTarget, setCloseTarget] = useState(null)
  useLayoutEffect(() => {
    if (!closing || closeTarget) return
    const to = !reduce && towardsTile(item.id, box, { scrollIntoView: true })
    setCloseTarget(to
      ? { ...to, opacity: 1, transition: SPRING.layout }
      : { opacity: 0, transition: { duration: DURATION.fast } })
  }, [closing, closeTarget, reduce, item.id, box])

  const isPhoto = item.type === 'photo'
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial={initial}
      animate={closeTarget ?? 'center'}
      onAnimationComplete={() => { if (closeTarget) onClosed() }}
      exit="exit"
      transition={reduce ? { duration: DURATION.fast } : SPRING.layout}
      drag={isPhoto && !reduce ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, { offset, velocity }) => {
        if (offset.x < -60 || velocity.x < -400) onSwipe(1)
        else if (offset.x > 60 || velocity.x > 400) onSwipe(-1)
      }}
      className="absolute overflow-hidden bg-black/20 touch-pan-y"
      style={{ left: box.x, top: box.y, width: box.w, height: box.h, transformOrigin: '50% 50%' }}
    >
      {isPhoto ? (
        <>
          {/* Cached thumbnail underneath so the zoom never shows an empty box */}
          <MediaImage media={item} sizes={TILE_SIZES} className="absolute inset-0 h-full w-full" />
          <MediaImage media={item} sizes={`${Math.round(box.w)}px`} priority className="absolute inset-0 h-full w-full !bg-transparent" />
        </>
      ) : (
        <video
          className="h-full w-full bg-black"
          controls
          playsInline
          preload="none"
          poster={posterUrl(item.poster)}
          aria-label={item.alt}
        >
          <source src={videoUrl(item.src)} type="video/mp4" />
          {(item.tracks ?? []).map((t, i) => (
            <track key={t.src} kind="subtitles" src={trackUrl(t.src)} srcLang={t.srclang} label={t.label} default={i === 0} />
          ))}
          {COPY.lightbox.videoFallback}
        </video>
      )}
    </motion.div>
  )
}

const iconButton =
  'grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors duration-[var(--motion-fast)] hover:bg-white/20 active:scale-95 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black ' +
  'aria-disabled:opacity-35 aria-disabled:pointer-events-none'

/**
 * Full-screen viewer for the gallery's current item (?m=). Rendered lazily by
 * MediaGallery.Lightbox inside AnimatePresence; `item` is kept by the parent
 * while the closing animation runs.
 */
export default function Lightbox({ item, fromTile }) {
  const { viewerItems, go, close } = useGallery()
  const reduce = useReducedMotion()
  // We own our removal: the slide's fly-back finishes, then safeToRemove().
  const [isPresent, safeToRemove] = usePresence()
  const vp = useViewport()
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const zoomFromTile = useRef(fromTile)
  const [direction, setDirection] = useState(0)

  const index = Math.max(0, viewerItems.indexOf(item))
  const total = viewerItems.length
  const prev = viewerItems[index - 1]
  const next = viewerItems[index + 1]
  const box = fitBox(item, vp)

  const step = useCallback(dir => {
    const target = dir > 0 ? next : prev
    if (!target || !isPresent) return
    setDirection(dir)
    go(target)
  }, [next, prev, go, isPresent])

  // Lock page scroll and hide the rest of the app from AT while open.
  useLayoutEffect(() => {
    const html = document.documentElement
    const root = document.getElementById('root')
    const scrollbar = window.innerWidth - html.clientWidth
    const prevOverflow = html.style.overflow
    const prevPadding = document.body.style.paddingRight
    html.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    root?.setAttribute('inert', '')
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      html.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
      root?.removeAttribute('inert')
    }
  }, [])

  // As soon as closing starts the page is interactive again, so focus can
  // return to the thumbnail when the fly-back ends (inert would block it).
  useLayoutEffect(() => {
    if (!isPresent) document.getElementById('root')?.removeAttribute('inert')
  }, [isPresent])

  useEffect(() => { preload(next); preload(prev) }, [next, prev])

  // Keyboard: ← → navigate, Esc closes, Tab stays inside.
  useEffect(() => {
    const onKey = e => {
      if (!isPresent) return
      if (e.key === 'Escape') { e.preventDefault(); close(); return }
      const inMedia = e.target instanceof HTMLVideoElement
      if (!inMedia && !e.altKey && !e.metaKey && !e.ctrlKey) {
        if (e.key === 'ArrowRight') { e.preventDefault(); step(1); return }
        if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); return }
      }
      if (e.key === 'Tab') {
        const focusables = [...dialogRef.current.querySelectorAll('button, [href], video[controls], [tabindex]:not([tabindex="-1"])')]
          .filter(el => !el.hasAttribute('disabled'))
        if (!focusables.length) return
        const firstEl = focusables[0]
        const lastEl = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
        else if (!dialogRef.current.contains(document.activeElement)) { e.preventDefault(); firstEl.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [close, step, isPresent])

  const chrome = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: DURATION.base, delay: reduce ? 0 : 0.08 } },
    exit: { opacity: 0, transition: { duration: DURATION.fast } },
  }

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={COPY.lightbox.label}
      tabIndex={-1}
      className="fixed inset-0 z-[100] overscroll-contain outline-none"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[#0b0908]/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: DURATION.base } }}
        exit={{ opacity: 0, transition: { duration: DURATION.base, ease: EASE.inOut } }}
        onClick={close}
      />

      <AnimatePresence initial={false} custom={direction}>
        <Slide
          key={item.id}
          item={item}
          box={box}
          direction={direction}
          zoomFromTile={zoomFromTile}
          closing={!isPresent}
          onClosed={safeToRemove}
          onSwipe={step}
          reduce={reduce}
        />
      </AnimatePresence>

      {/* Top bar: counter + close */}
      <motion.div {...chrome} className="absolute inset-x-0 top-0 flex h-16 items-center justify-between px-3 sm:px-5">
        <p className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium tabular-nums text-white" aria-hidden="true">
          {COPY.lightbox.counter(index + 1, total)}
        </p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {COPY.lightbox.counterSpoken(index + 1, total)}{item.alt ? `: ${item.alt}` : ''}
        </p>
        <button ref={closeRef} type="button" onClick={close} aria-label={COPY.lightbox.close} title={COPY.lightbox.close} className={iconButton}>
          <X size={22} />
        </button>
      </motion.div>

      {/* Arrows: at the sides on wide screens, in the bottom bar on narrow ones */}
      <motion.div {...chrome} className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-between gap-4 px-3 pb-4 sm:inset-y-0 sm:h-auto sm:items-center sm:px-5 sm:pb-0">
        <button
          type="button" onClick={() => step(-1)} aria-disabled={!prev}
          aria-label={COPY.lightbox.previous} title={COPY.lightbox.previous}
          className={`${iconButton} pointer-events-auto`}
        >
          <ChevronLeft size={24} />
        </button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={item.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            className="max-w-2xl flex-1 self-center text-center text-[15px] leading-snug text-white/85 sm:absolute sm:inset-x-24 sm:bottom-6 sm:mx-auto"
          >
            {item.caption}
          </motion.p>
        </AnimatePresence>
        <button
          type="button" onClick={() => step(1)} aria-disabled={!next}
          aria-label={COPY.lightbox.next} title={COPY.lightbox.next}
          className={`${iconButton} pointer-events-auto`}
        >
          <ChevronRight size={24} />
        </button>
      </motion.div>
    </div>,
    document.body
  )
}
