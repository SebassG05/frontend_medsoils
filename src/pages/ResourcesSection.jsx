import { useLayoutEffect, useRef } from 'react'
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, MotionConfig, animate, motion, useReducedMotion } from 'framer-motion'
import Resources from './Resources'
import CollectionPage from './CollectionPage'
import CollectionDayPage from './CollectionDayPage'
import { DURATION, EASE, SPRING } from '../utils/motion'

const SCROLL_KEY = 'medsoils:resources-scroll'

function readPositions() {
  try { return JSON.parse(sessionStorage.getItem(SCROLL_KEY)) || {} } catch { return {} }
}
function writePosition(key, y) {
  try {
    const all = readPositions()
    all[key] = y
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(all))
  } catch { /* storage unavailable: back navigation just lands at the top */ }
}

/**
 * Scroll handling for /resources ↔ collection ↔ day.
 * Going deeper scrolls to the top; Back/Forward restores where you were.
 * The scroll is animated with the same spring as the shared-element morph,
 * so the card visibly travels into the header instead of jumping.
 */
function useSectionScroll(location, reduce) {
  const navType = useNavigationType()
  const prev = useRef(location)

  useLayoutEffect(() => {
    const original = history.scrollRestoration
    history.scrollRestoration = 'manual'
    return () => { history.scrollRestoration = original }
  }, [])

  useLayoutEffect(() => {
    const from = prev.current
    prev.current = location
    if (from.pathname === location.pathname) return // ?m= / ?show= changes keep the scroll

    writePosition(from.key, window.scrollY)
    const target = navType === 'POP' ? (readPositions()[location.key] ?? 0) : 0

    if (reduce || Math.abs(window.scrollY - target) < 2) {
      window.scrollTo(0, target)
      return
    }
    const controls = animate(window.scrollY, target, {
      ...SPRING.layout,
      onUpdate: y => window.scrollTo(0, y),
    })
    const stop = () => controls.stop()
    const opts = { passive: true, once: true }
    window.addEventListener('wheel', stop, opts)
    window.addEventListener('touchstart', stop, opts)
    window.addEventListener('keydown', stop, { once: true })
    return () => {
      controls.stop()
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [location, navType, reduce])
}

/**
 * /resources and its Field trips sub-pages. One AnimatePresence + LayoutGroup
 * so the collection card and day card can morph into the next level's header
 * (and back, including with the browser's Back/Forward buttons).
 */
export default function ResourcesSection() {
  const location = useLocation()
  const reduce = useReducedMotion()
  useSectionScroll(location, reduce)

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="resources">
        <div className="relative">
          {/* popLayout needs a ref-able direct child, so the page wrapper is a motion.div */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: DURATION.base, ease: EASE.out } }}
              exit={{ opacity: 0, transition: { duration: DURATION.fast, ease: EASE.inOut } }}
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
