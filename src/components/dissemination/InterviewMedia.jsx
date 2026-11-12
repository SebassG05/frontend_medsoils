import { motion, useReducedMotion } from 'framer-motion'
import YouTubeFacade from './YouTubeFacade'
import AudioPlayer from './AudioPlayer'
import InterviewCover from './InterviewCover'
import { parseYouTubeId } from '../../utils/youtube'
import { layoutIds } from '../../data/dissemination'
import { layoutTransition } from '../../utils/motion'

/**
 * The media block at the top of an interview:
 * video → YouTube facade; audio on YouTube → facade with a headphones badge;
 * self-hosted audio → cover + native player; text → cover only.
 */
export default function InterviewMedia({ interview }) {
  const youtubeId = parseYouTubeId(interview.mediaUrl)
  const reduce = useReducedMotion()

  if (youtubeId && interview.type !== 'text') {
    return <YouTubeFacade videoId={youtubeId} interview={interview} audio={interview.type === 'audio'} />
  }

  const cover = (
    <motion.div
      layoutId={layoutIds.cover(interview.slug)}
      layoutCrossfade={false}
      transition={layoutTransition(reduce)}
      style={{ borderRadius: 24 }}
      className="relative aspect-video overflow-hidden shadow-card"
    >
      <InterviewCover interview={interview} size="maxres" priority sizes="(min-width: 1024px) 1024px, 100vw" className="absolute inset-0" />
    </motion.div>
  )

  if (interview.type === 'audio') {
    return (
      <div className="space-y-4">
        {cover}
        <AudioPlayer src={interview.mediaUrl} title={interview.title} captions={interview.captions} />
      </div>
    )
  }
  return cover
}
