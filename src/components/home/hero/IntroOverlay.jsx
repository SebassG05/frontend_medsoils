import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { introVideo } from '../../../data/heroMedia'

const PORTRAIT_QUERY = '(max-aspect-ratio: 1/1)'
const PORTRAIT_FADE_MS = 350

const IntroOverlay = ({ intro }) => {
  const rootRef = useRef(null)
  const videoRef = useRef(null)
  const [isFadingToEarth, setIsFadingToEarth] = useState(false)
  const { end, finishVideo, isPlaying, isRevealing, skip, skipped, videoEvents, videoFinished } = intro

  useEffect(() => {
    // Puts the first Tab on "Skip intro" without drawing a focus ring on load
    rootRef.current?.focus({ preventScroll: true })
    const video = videoRef.current
    if (!video) return
    video.defaultPlaybackRate = introVideo.playbackRate
    video.playbackRate = introVideo.playbackRate
    video.play().catch((err) => {
      if (err.name !== 'AbortError') end()
    })
  }, [end])

  // Portrait letterboxes the clip, and its curtain would show as a strip
  // between two white areas. Fade to the same earth tone before it enters.
  useEffect(() => {
    if (!isPlaying) return undefined
    const portrait = window.matchMedia(PORTRAIT_QUERY)
    let frame = 0
    const watch = () => {
      if (portrait.matches && videoRef.current?.currentTime >= introVideo.portraitFadeAt) {
        setIsFadingToEarth(true)
        return
      }
      frame = window.requestAnimationFrame(watch)
    }
    frame = window.requestAnimationFrame(watch)
    return () => window.cancelAnimationFrame(frame)
  }, [isPlaying])

  useEffect(() => {
    if (!isFadingToEarth) return undefined
    const timer = window.setTimeout(finishVideo, PORTRAIT_FADE_MS)
    return () => window.clearTimeout(timer)
  }, [isFadingToEarth, finishVideo])

  return (
    <motion.div
      ref={rootRef}
      tabIndex={-1}
      role="group"
      aria-label="MEDSOILS intro animation"
      initial={false}
      animate={{ opacity: isRevealing ? 0 : 1 }}
      transition={{ duration: skipped ? 0.35 : 0.6, ease: 'easeInOut' }}
      onAnimationComplete={() => { if (isRevealing) end() }}
      className={`fixed inset-0 z-[9000] overflow-hidden bg-white outline-none ${isRevealing ? 'pointer-events-none' : ''}`}
    >
      <video
        ref={videoRef}
        src={introVideo.src}
        width={introVideo.width}
        height={introVideo.height}
        muted
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover [@media(max-aspect-ratio:1/1)]:h-auto [@media(max-aspect-ratio:1/1)]:w-[187vw]"
        {...videoEvents}
      />
      <div
        className={`absolute inset-0 bg-earth transition-opacity duration-[350ms] ease-out ${isFadingToEarth ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
      {!videoFinished && (
        <button
          type="button"
          onClick={skip}
          className="absolute right-4 top-4 rounded-sm bg-white/90 px-3 py-2 text-sm font-medium text-earth-deep underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-deep sm:right-6 sm:top-6"
        >
          Skip intro
        </button>
      )}
    </motion.div>
  )
}

export default IntroOverlay
