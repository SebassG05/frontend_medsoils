import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import InterviewCard from './InterviewCard'
import { DURATION, fadeRise, layoutTransition, revealOnce, staggerChildren } from '../../utils/motion'

/**
 * Responsive grid of interview cards: 1 / 2 / 3 columns.
 * Cards enter staggered the first time the grid scrolls into view (not again
 * when coming Back, where a card is the target of the cover morph), and
 * slide to their new place when filters change. Interruptible: a new filter
 * mid-animation simply retargets.
 *
 * Two layers on purpose: the <li> is AnimatePresence's child and owns
 * presence (fade in when a filter adds it, fade out when one removes it) and
 * layout; the inner div inherits the first-reveal stagger from the <ul>. If
 * the <li> also inherited the <ul>'s variants, every re-render would
 * re-apply "show" over its exit and removed cards would never leave.
 */
export default function InterviewGrid({ interviews, revealKey = 'dissemination-grid' }) {
  const reduce = useReducedMotion()
  const [initial] = useState(() => revealOnce(revealKey))

  return (
    <motion.ul
      role="list"
      variants={staggerChildren(reduce)}
      initial={initial}
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {interviews.map(it => (
          <motion.li
            key={it.slug}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: DURATION.base } }}
            exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
            transition={layoutTransition(reduce)}
          >
            <motion.div variants={fadeRise(reduce)} className="h-full">
              <InterviewCard interview={it} />
            </motion.div>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
