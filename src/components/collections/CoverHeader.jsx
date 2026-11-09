import { motion, useReducedMotion } from 'framer-motion'
import CoverFill from './CoverFill'
import { SCRIM } from './CollectionCard'
import { DURATION, EASE, ENTER_OFFSET, layoutTransition } from '../../utils/motion'

/**
 * Photo header for a collection or a day. The cover box shares `layoutId`
 * with the card that opened it, so the card grows into this header.
 * The cover image is the page's LCP candidate, hence `priority`.
 */
export default function CoverHeader({ layoutId, imageLayoutId, media, eyebrow, title, subtitle, children, aspect }) {
  const reduce = useReducedMotion()
  const textIn = {
    initial: { opacity: 0, y: reduce ? 0 : ENTER_OFFSET },
    animate: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.out, delay: reduce ? 0 : 0.18 } },
  }

  return (
    <header className="relative">
      <motion.div
        layoutId={layoutId}
        layoutCrossfade={false}
        transition={layoutTransition(reduce)}
        style={{ borderRadius: 24 }}
        className={`relative z-10 overflow-hidden shadow-card ${aspect}`}
      >
        {media && (
          <CoverFill media={media} layoutId={imageLayoutId} priority sizes="(min-width: 1536px) 1440px, 100vw" />
        )}
        <div aria-hidden="true" className="absolute inset-0" style={{ background: SCRIM }} />
      </motion.div>

      <motion.div {...textIn} className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 lg:p-10">
        {eyebrow && <p className="text-[15px] font-semibold text-orange-200">{eyebrow}</p>}
        <h1 className="mt-1 font-headline text-[34px] sm:text-[44px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.025em] text-white text-balance">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-[16px] sm:text-[17px] text-white/85">{subtitle}</p>}
        {children && <div className="mt-4">{children}</div>}
      </motion.div>
    </header>
  )
}
