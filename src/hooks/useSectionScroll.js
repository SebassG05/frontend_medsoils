import { useLayoutEffect, useRef } from 'react'
import { useNavigationType } from 'react-router-dom'
import { animate } from 'framer-motion'
import { SPRING } from '../utils/motion'

function readPositions(storageKey) {
  try { return JSON.parse(sessionStorage.getItem(storageKey)) || {} } catch { return {} }
}
function writePosition(storageKey, key, y) {
  try {
    const all = readPositions(storageKey)
    all[key] = y
    sessionStorage.setItem(storageKey, JSON.stringify(all))
  } catch { /* storage unavailable: back navigation just lands at the top */ }
}

/**
 * Scroll handling inside a section with shared-element transitions
 * (/resources ↔ collection ↔ day, /dissemination ↔ interview).
 * Going deeper scrolls to the top; Back/Forward restores where you were.
 * The scroll is animated with the same spring as the shared-element morph,
 * so the card visibly travels into the header instead of jumping.
 */
export default function useSectionScroll(location, reduce, storageKey) {
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
    if (from.pathname === location.pathname) return // query-string changes keep the scroll

    writePosition(storageKey, from.key, window.scrollY)
    const target = navType === 'POP' ? (readPositions(storageKey)[location.key] ?? 0) : 0

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
  }, [location, navType, reduce, storageKey])
}
