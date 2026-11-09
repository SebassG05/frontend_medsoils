import { useId } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import MediaImage from './MediaImage'
import CoverFill from './CoverFill'
import { countMedia, dayMosaic, formatDay, layoutIds } from '../../data/collections'
import { COPY } from '../../data/collections/copy'
import { dayPath } from '../../utils/collectionRoutes'
import { AFTER_MORPH, DURATION, fadeRise, layoutTransition } from '../../utils/motion'

const HOVER_ZOOM =
  'transition-transform duration-[var(--motion-cover)] ease-out-expo pointer-fine:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100'

function MosaicTile({ media, className, sizes, layoutId }) {
  return (
    // `className` must set the positioning (relative or absolute); two position utilities would conflict.
    <div className={`overflow-hidden ${className}`}>
      {layoutId ? (
        <CoverFill media={media} layoutId={layoutId} sizes={sizes} imgClassName={HOVER_ZOOM} />
      ) : (
        <MediaImage media={media} alt="" sizes={sizes} className="absolute inset-0" imgClassName={HOVER_ZOOM} />
      )}
      {media.type === 'video' && (
        <span aria-hidden="true" className="absolute left-2 bottom-2 grid size-7 place-items-center rounded-full bg-black/60 text-white">
          <Play size={13} fill="currentColor" className="translate-x-px" />
        </span>
      )}
    </div>
  )
}

/** Compact card for one day: 1 + 3 mosaic, "Day N", title, counts. One link. */
export default function DayCard({ collection, day, returning = false }) {
  const reduce = useReducedMotion()
  const titleId = useId()
  const metaId = useId()
  const [lead, ...rest] = dayMosaic(day)
  const { photos, videos } = countMedia(day.media)
  const meta = [COPY.gallery.summary(photos, videos), formatDay(day.date)].filter(Boolean).join(' · ')
  // Coming back from the day page only the lead photo morphs; the rest follows.
  const after = {
    initial: returning ? { opacity: 0 } : false,
    animate: { opacity: 1, transition: { duration: 0.2, delay: reduce ? 0 : AFTER_MORPH / 2 } },
  }

  return (
    <motion.li variants={fadeRise(reduce)} className="list-none">
      <Link
        to={dayPath(collection.slug, day.slug)}
        aria-labelledby={titleId}
        aria-describedby={metaId}
        className="group block rounded-[var(--radius-card)] bg-white p-2 shadow-card outline-none
          transition-[transform,box-shadow] duration-[var(--motion-base)] ease-out-expo active:scale-[0.985]
          pointer-fine:hover:-translate-y-0.5 pointer-fine:hover:shadow-card-hover motion-reduce:transform-none
          focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-4"
      >
        <motion.div
          layoutId={layoutIds.dayCover(collection.slug, day.slug)}
          layoutCrossfade={false}
          transition={layoutTransition(reduce)}
          style={{ borderRadius: 18, backgroundColor: lead?.color }}
          className="relative z-10 aspect-[4/3] overflow-hidden bg-gray-100"
        >
          {lead && (
            <div className="grid h-full grid-cols-3 grid-rows-3 gap-1">
              <MosaicTile media={lead} layoutId={layoutIds.dayCoverImage(collection.slug, day.slug)} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 66vw" className={`relative ${rest.length ? 'col-span-2 row-span-3' : 'col-span-3 row-span-3'}`} />
              {rest.map(m => (
                <motion.div key={m.id} {...after} className="col-span-1 row-span-1 relative">
                  <MosaicTile media={m} sizes="(min-width: 1024px) 11vw, 33vw" className="absolute inset-0" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div {...after} className="flex items-end justify-between gap-4 px-3 pb-3 pt-4">
          <div className="min-w-0">
            <p aria-hidden="true" className="text-[15px] font-semibold text-orange-700">{COPY.day.label(day.number)}</p>
            <h3 id={titleId} className="font-headline text-[22px] font-bold leading-tight tracking-[-0.015em] text-gray-900">
              <span className="sr-only">{COPY.day.label(day.number)}: </span>{day.title}
            </h3>
            <p id={metaId} className="mt-1 text-[15px] text-gray-600 tabular-nums">{meta}</p>
          </div>
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-600
              transition-[transform,background-color,color] duration-[var(--motion-base)] ease-out-expo
              pointer-fine:group-hover:translate-x-1 pointer-fine:group-hover:bg-orange-600 pointer-fine:group-hover:text-white motion-reduce:transform-none"
          >
            <ArrowRight size={20} />
          </span>
        </motion.div>
      </Link>
    </motion.li>
  )
}
