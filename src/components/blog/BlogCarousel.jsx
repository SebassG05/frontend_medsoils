import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * BlogCarousel
 * Renders a set of images (2 per slide) with prev/next arrows and dot indicators.
 * Usage in blog HTML content: wrap <img> tags inside <div class="carousel">...</div>
 */
export default function BlogCarousel({ images = [] }) {
  const perPage = 2
  const total   = Math.ceil(images.length / perPage)
  const [page, setPage]   = useState(0)
  const [dir,  setDir]    = useState(1)

  if (!images.length) return null

  function go(delta) {
    setDir(delta)
    setPage(p => (p + delta + total) % total)
  }

  const slice = images.slice(page * perPage, page * perPage + perPage)

  const variants = {
    enter: d => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center:    { x: 0,   opacity: 1 },
    exit:  d => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
  }

  return (
    <div className="relative w-full my-6 select-none rounded-2xl overflow-hidden bg-gray-900">
      {/* slides */}
      <AnimatePresence initial={false} custom={dir} mode="wait">
        <motion.div
          key={page}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="flex gap-1"
        >
          {slice.map((img, i) => (
            <div
              key={i}
              className="flex-1 overflow-hidden"
              style={{ maxHeight: 360 }}
            >
              <img
                src={img.src}
                alt={img.alt || ''}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                style={{ height: 360, borderRadius: 0, margin: 0, boxShadow: 'none' }}
              />
            </div>
          ))}
          {/* fill empty slot if odd number of images on last slide */}
          {slice.length < perPage && (
            <div className="flex-1 bg-gray-800" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* left arrow */}
      {total > 1 && (
        <button
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
          aria-label="Previous"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
      )}

      {/* right arrow */}
      {total > 1 && (
        <button
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition"
          aria-label="Next"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      )}

      {/* dots */}
      {total > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > page ? 1 : -1); setPage(i) }}
              className={`rounded-full transition-all ${
                i === page ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
