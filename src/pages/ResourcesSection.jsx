import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import Resources from './Resources'
import CollectionPage from './CollectionPage'
import CollectionDayPage from './CollectionDayPage'
import { DURATION, EASE } from '../utils/motion'
import useSectionScroll from '../hooks/useSectionScroll'

/**
 * /resources and its Field trips sub-pages. One AnimatePresence + LayoutGroup
 * so the collection card and day card can morph into the next level's header
 * (and back, including with the browser's Back/Forward buttons).
 */
export default function ResourcesSection() {
  const location = useLocation()
  const reduce = useReducedMotion()
  useSectionScroll(location, reduce, 'medsoils:resources-scroll')

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="resources">
        <div className="relative">
          {/* popLayout needs a ref-able direct child, so the page wrapper is a motion.div */}
          <AnimatePresence mode="popLayout" initial={false}>
            {/*
              The entering page sits on top and stays opaque, so the shared cover
              morphs at full opacity; its other content fades in on its own.
              With reduced motion the whole page simply cross-fades.
            */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: reduce ? 0 : 1, zIndex: 1 }}
              animate={{ opacity: 1, zIndex: 1, transition: { duration: DURATION.fast, ease: EASE.out } }}
              exit={{ opacity: 0, zIndex: 0, transition: { duration: DURATION.fast, ease: EASE.inOut } }}
              style={{ position: 'relative' }}
            >
              <Routes location={location}>
                <Route index element={<Resources />} />
                <Route path=":collectionSlug" element={<CollectionPage />} />
                <Route path=":collectionSlug/:daySlug" element={<CollectionDayPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </MotionConfig>
  )
}
