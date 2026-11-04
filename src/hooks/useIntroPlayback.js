import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * medsoils_intro_seen – sessionStorage flag, no identifier and nothing leaves
 * the browser. It only stops the intro replaying during the same tab session.
 */
const SESSION_KEY = 'medsoils_intro_seen'
const START_TIMEOUT_MS = 1500
const STALL_TIMEOUT_MS = 1500
const MAX_INTRO_MS = 9000
const HERO_HOLD_MS = 2500

// Fallback for browsers that block sessionStorage
let seenThisLoad = false

function wasSeen() {
  if (seenThisLoad) return true
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  seenThisLoad = true
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch { /* ignore */ }
}

function getSkipReason(pathname) {
  if (pathname !== '/') return 'route'
  if (wasSeen()) return 'seen'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'reduced-motion'
  if (navigator.connection?.saveData) return 'save-data'
  return null
}

/**
 * useIntroPlayback
 * ─────────────────────────────────────────────────────────────────
 * Decides whether the home intro plays and drives its phases:
 *   playing → revealing (overlay fades over the hero) → done
 *
 * The hero never waits for the video: any failure jumps straight to done.
 *
 * @param {boolean} heroReady - the hero photo is loaded under the overlay
 */
export function useIntroPlayback(heroReady) {
  const { pathname } = useLocation()
  const [phase, setPhase] = useState(() => (getSkipReason(pathname) ? 'done' : 'playing'))
  const [hasStarted, setHasStarted] = useState(false)
  const [videoFinished, setVideoFinished] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const stallTimer = useRef(null)

  // The catch-all route also renders Home, so leaving '/' must end the intro
  const currentPhase = pathname === '/' ? phase : 'done'
  const isPlaying = currentPhase === 'playing'

  const end = useCallback(() => setPhase('done'), [])
  const finishVideo = useCallback(() => setVideoFinished(true), [])

  const skip = useCallback(() => {
    setSkipped(true)
    setPhase((current) => (current === 'playing' ? 'revealing' : current))
  }, [])

  const clearStall = useCallback(() => {
    window.clearTimeout(stallTimer.current)
  }, [])

  const handlePlaying = useCallback(() => {
    clearStall()
    setHasStarted(true)
  }, [clearStall])

  const handleWaiting = useCallback(() => {
    clearStall()
    stallTimer.current = window.setTimeout(end, STALL_TIMEOUT_MS)
  }, [end, clearStall])

  useEffect(() => clearStall, [clearStall])

  useEffect(() => {
    if (isPlaying) markSeen()
  }, [isPlaying])

  // Lock on <html>: Header writes body.style.overflow when it mounts
  useEffect(() => {
    if (!isPlaying) return undefined
    const { style } = document.documentElement
    const { overflow, scrollbarGutter } = style
    style.overflow = 'hidden'
    style.scrollbarGutter = 'stable'
    return () => {
      style.overflow = overflow
      style.scrollbarGutter = scrollbarGutter
    }
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying || hasStarted) return undefined
    const timer = window.setTimeout(end, START_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [isPlaying, hasStarted, end])

  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = window.setTimeout(end, MAX_INTRO_MS)
    return () => window.clearTimeout(timer)
  }, [isPlaying, end])

  useEffect(() => {
    if (!isPlaying || !videoFinished) return undefined
    if (heroReady) {
      setPhase('revealing')
      return undefined
    }
    const timer = window.setTimeout(() => setPhase('revealing'), HERO_HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [isPlaying, videoFinished, heroReady])

  return {
    isActive: currentPhase !== 'done',
    isPlaying,
    isRevealing: currentPhase === 'revealing',
    videoFinished,
    skipped,
    end,
    skip,
    finishVideo,
    videoEvents: {
      onPlaying: handlePlaying,
      onWaiting: handleWaiting,
      onEnded: finishVideo,
      onError: end,
    },
  }
}
