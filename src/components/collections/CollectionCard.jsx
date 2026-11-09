import { useId } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import CoverFill from './CoverFill'
import { collectionCover, collectionStats, formatDates, layoutIds } from '../../data/collections'
import { COPY } from '../../data/collections/copy'
import { collectionPath } from '../../utils/collectionRoutes'
import { AFTER_MORPH, DURATION, fadeRise, layoutTransition } from '../../utils/motion'

/** Warm scrim from the brand's deepest earth tone; ≥ 0.6 alpha where text sits keeps white text AA on any photo. */
export const SCRIM =
  'linear-gradient(to top, rgb(42 21 10 / 0.86) 0%, rgb(42 21 10 / 0.72) 40%, rgb(42 21 10 / 0.22) 75%, rgb(42 21 10 / 0) 100%)'

/** Cover is likely in the first viewport only on tall desktop windows. */
const coverIsAboveFold = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px) and (min-height: 820px)').matches

export function MetaChips({ stats, tone = 'onImage' }) {
  const chip =
    tone === 'onImage'
      ? 'bg-white/16 text-white ring-1 ring-inset ring-white/20'
      : 'bg-gray-100 text-gray-700'
  const items = [COPY.counts.days(stats.days), COPY.counts.photos(stats.photos), COPY.counts.videos(stats.videos)]
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(text => (
        <li key={text} className={`rounded-full px-3 py-1 text-[13px] font-medium tabular-nums ${chip}`}>{text}</li>
      ))}
    </ul>
  )
}

/**
 * Field-trip card (variant A, "editorial cover"). The whole card is one link.
 * The cover box carries a layoutId so it grows into the collection header.
 */
export default function CollectionCard({ collection, returning = false }) {
  const reduce = useReducedMotion()
  const titleId = useId()
  const cover = collectionCover(collection)
  const stats = collectionStats(collection)
  const dates = formatDates(collection.dates)
  const subtitle = [collection.place, dates].filter(Boolean).join(' · ')

  return (
    <motion.li variants={fadeRise(reduce)} className="list-none">
      <Link
        to={collectionPath(collection.slug)}
        aria-labelledby={titleId}
        className="group relative block rounded-[var(--radius-card)] outline-none
          transition-transform duration-[var(--motion-base)] ease-out-expo active:scale-[0.985]
          pointer-fine:hover:-translate-y-0.5 motion-reduce:transform-none
          focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-4"
      >
        <motion.div
          layoutId={layoutIds.cover(collection.slug)}
          layoutCrossfade={false}
          transition={layoutTransition(reduce)}
          style={{ borderRadius: 24 }}
          className="relative z-10 aspect-[4/5] sm:aspect-[16/11] overflow-hidden shadow-card
            transition-shadow duration-[var(--motion-base)] pointer-fine:group-hover:shadow-card-hover"
        >
          {cover && (
            <CoverFill
              media={cover}
              layoutId={layoutIds.coverImage(collection.slug)}
              layoutCrossfade={false}
              priority={coverIsAboveFold()}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              imgClassName="scale-100 transition-transform duration-[var(--motion-cover)] ease-out-expo pointer-fine:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          )}
          <div aria-hidden="true" className="absolute inset-0" style={{ background: SCRIM }} />
        </motion.div>

        {/* Coming back, the cover morphs into this card first; the text follows. */}
        <motion.div
          initial={returning ? { opacity: 0 } : false}
          animate={{ opacity: 1, transition: { duration: DURATION.base, delay: reduce ? 0 : AFTER_MORPH } }}
          className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-5 sm:p-6"
        >
          <div className="min-w-0">
            <h3 id={titleId} className="font-headline text-[26px] sm:text-[28px] font-bold leading-tight tracking-[-0.02em] text-white">
              {collection.title}
            </h3>
            <p className="mt-1 text-[15px] text-white/85">{subtitle}</p>
            <div className="mt-4">
              <MetaChips stats={stats} />
            </div>
          </div>
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-600 text-white shadow-md
              transition-transform duration-[var(--motion-base)] ease-out-expo pointer-fine:group-hover:translate-x-1 motion-reduce:transform-none"
          >
            <ArrowRight size={20} />
          </span>
        </motion.div>
      </Link>
    </motion.li>
  )
}
