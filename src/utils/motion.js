/**
 * Motion tokens. Mirrors the --motion-* custom properties in index.css so CSS
 * transitions and Motion (framer-motion) springs share one vocabulary.
 *
 * For now only the collections feature uses these; other pages still define
 * their own easing locally (pending clean-up, out of scope for that change).
 */

export const DURATION = {
  fast: 0.15,   // press feedback, colour changes
  base: 0.24,   // fades, small moves
  slow: 0.4,    // entrances
  cover: 0.9,   // slow hover zoom on cover photos
}

export const EASE = {
  out: [0.16, 1, 0.3, 1],    // decelerate — entrances
  inOut: [0.65, 0, 0.35, 1], // symmetric — exits that stay on screen
}

export const SPRING = {
  /** Shared-element morphs between levels and the lightbox zoom. Interruptible. */
  layout: { type: 'spring', stiffness: 420, damping: 40, mass: 1 },
  /** Small UI moves (arrow nudge, swipe snap-back). */
  snappy: { type: 'spring', stiffness: 600, damping: 38 },
}

/** Entrance offset in px (spec: 8–12 px). */
export const ENTER_OFFSET = 10
export const STAGGER = 0.06

/** Fade + short rise; collapses to a plain fade when motion is reduced. */
export function fadeRise(reduce, delay = 0) {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : ENTER_OFFSET },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? DURATION.fast : DURATION.slow, ease: EASE.out, delay: reduce ? 0 : delay },
    },
  }
}

export function staggerChildren(reduce, delayChildren = 0) {
  return { hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : STAGGER, delayChildren: reduce ? 0 : delayChildren } } }
}

/**
 * Entrance animations that should play only the first time a list is shown.
 * Coming back (Back button) the card is the target of a shared-element morph
 * and must already be visible, so later mounts start in the final state.
 */
const revealed = new Set()
export function revealOnce(key) {
  const first = !revealed.has(key)
  revealed.add(key)
  return first ? 'hidden' : false
}

/** Delay for content that enters next to a shared-element morph, so the morph leads. */
export const AFTER_MORPH = 0.14

/** Transition for layoutId morphs: spring normally, short fade-only when reduced. */
export function layoutTransition(reduce) {
  return reduce ? { duration: 0 } : SPRING.layout
}
