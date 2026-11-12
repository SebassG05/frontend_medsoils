import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Headphones, Play } from 'lucide-react'
import InterviewCover from './InterviewCover'
import { youtubeEmbedUrl } from '../../utils/youtube'
import { layoutIds } from '../../data/dissemination'
import { layoutTransition } from '../../utils/motion'
import { COPY } from '../../data/dissemination/copy'

let preconnected = false
function preconnect() {
  if (preconnected) return
  preconnected = true
  for (const href of ['https://www.youtube-nocookie.com', 'https://i.ytimg.com']) {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    document.head.appendChild(link)
  }
}

/**
 * Lightweight YouTube player: shows the thumbnail and a play button; the
 * iframe (privacy-enhanced youtube-nocookie.com) is only created after the
 * click, which counts as consent for that video. Nothing from YouTube except
 * the thumbnail loads before that.
 */
export default function YouTubeFacade({ videoId, interview, audio = false }) {
  const [playing, setPlaying] = useState(false)
  const frame = useRef(null)
  const Icon = audio ? Headphones : Play
  const reduce = useReducedMotion()

  useEffect(() => {
    if (playing) frame.current?.focus()
  }, [playing])

  return (
    <div>
      {/* Shared element: the card or featured cover grows into this box. */}
      <motion.div
        layoutId={layoutIds.cover(interview.slug)}
        layoutCrossfade={false}
        transition={layoutTransition(reduce)}
        style={{ borderRadius: 24 }}
        className="relative aspect-video overflow-hidden bg-gray-900 shadow-card"
      >
        {playing ? (
          <iframe
            ref={frame}
            src={youtubeEmbedUrl(videoId)}
            title={interview.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            onPointerEnter={preconnect}
            onFocus={preconnect}
            aria-label={(audio ? COPY.player.playAudio : COPY.player.play)(interview.title)}
            className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-orange-400"
          >
            <InterviewCover
              interview={interview}
              size="maxres"
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="absolute inset-0"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex size-[72px] sm:size-[88px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-xl transition-transform duration-[var(--motion-base)] ease-out-expo group-hover:scale-105 group-active:scale-95 motion-reduce:transition-none"
            >
              <Icon className={`size-7 sm:size-8 text-orange-600 ${audio ? '' : 'translate-x-[3px] fill-orange-600'}`} strokeWidth={audio ? 2 : 0} />
            </span>
          </button>
        )}
      </motion.div>
      <p className="mt-2.5 text-xs text-gray-600">{COPY.player.notice}</p>
    </div>
  )
}
