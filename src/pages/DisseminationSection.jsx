import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import Dissemination from './Dissemination'
import InterviewPage from './InterviewPage'
import { DURATION, EASE } from '../utils/motion'
import useSectionScroll from '../hooks/useSectionScroll'

/**
 * /dissemination and /dissemination/:slug. Same structure as ResourcesSection:
 * one AnimatePresence + LayoutGroup so an interview card's cover can morph
 * into the detail page's player (and back with the browser's Back button).
 */
export default function DisseminationSection() {
  const location = useLocation()
  const reduce = useReducedMotion()
  useSectionScroll(location, reduce, 'medsoils:dissemination-scroll')

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="dissemination">
        <div className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: reduce ? 0 : 1, zIndex: 1 }}
              animate={{ opacity: 1, zIndex: 1, transition: { duration: DURATION.fast, ease: EASE.out } }}
              exit={{ opacity: 0, zIndex: 0, transition: { duration: DURATION.fast, ease: EASE.inOut } }}
              style={{ position: 'relative' }}
            >
              <Routes location={location}>
                <Route index element={<Dissemination />} />
                <Route path=":slug" element={<InterviewPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </MotionConfig>
  )
}
