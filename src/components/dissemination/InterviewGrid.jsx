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
      <AnimatePresence mode="popLayout">
        {interviews.map(it => (
          <motion.li
            key={it.slug}
            layout
            variants={fadeRise(reduce)}
            exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
            transition={layoutTransition(reduce)}
          >
            <InterviewCard interview={it} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  )
}
