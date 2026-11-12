import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import InterviewCover from './InterviewCover'
import Avatar from './Avatar'
import { TYPE_ICON, durationLabel, roleLine } from './meta'
import { formatDate, layoutIds } from '../../data/dissemination'
import { layoutTransition } from '../../utils/motion'
import { COPY } from '../../data/dissemination/copy'
import useInterviewHref from '../../hooks/useInterviewHref'

const CARD_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'

/**
 * Interview card: the whole card is one link (accessible name = title).
 * Text sits below the cover, so contrast never depends on the photo; only
 * the type and duration pills sit on it, on opaque backgrounds.
 */
export default function InterviewCard({ interview, headingLevel = 3 }) {
  const href = useInterviewHref(interview.slug)
  const reduce = useReducedMotion()
  const Heading = `h${headingLevel}`
  const Icon = TYPE_ICON[interview.type]
  const duration = durationLabel(interview)

  return (
    <Link
      to={href}
      aria-label={interview.title}
      className="group flex h-full flex-col rounded-[var(--radius-card)] bg-white shadow-card outline-none transition-[translate,scale,box-shadow] duration-[var(--motion-base)] ease-out-expo active:scale-[0.985] pointer-fine:hover:-translate-y-0.5 pointer-fine:hover:shadow-card-hover motion-reduce:transition-none motion-reduce:transform-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-4"
    >
      {/* Shared element: grows into the player on the detail page. */}
      <motion.div
        layoutId={layoutIds.cover(interview.slug)}
        layoutCrossfade={false}
        transition={layoutTransition(reduce)}
        style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        className="relative z-10 aspect-video overflow-hidden"
      >
        <InterviewCover interview={interview} sizes={CARD_SIZES} className="absolute inset-0" imgClassName="scale-100 transition-transform duration-[var(--motion-cover)] ease-out-expo pointer-fine:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 py-1 pl-2.5 pr-3 text-xs font-semibold text-gray-900">
          <Icon size={13} aria-hidden="true" className="text-orange-600" strokeWidth={2.4} />
          {COPY.types[interview.type]}
        </span>
        {duration && (
          <span className="absolute bottom-4 right-4 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold tabular-nums text-white">
            {duration}
          </span>
        )}
      </motion.div>

      <div className="flex flex-1 flex-col gap-3.5 px-6 pt-5 pb-6">
        <Heading className="font-headline text-[21px] font-semibold leading-[1.25] tracking-[-0.01em] text-gray-900 line-clamp-3">
          {interview.title}
        </Heading>
        <div className="flex items-start gap-3">
          <Avatar person={interview.interviewee} size={40} />
          <p className="min-w-0 text-sm leading-snug">
            <span className="block font-semibold text-gray-900 [overflow-wrap:anywhere]">{interview.interviewee.name}</span>
            <span className="block text-gray-600 [overflow-wrap:anywhere]">{roleLine(interview.interviewee)}</span>
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 pt-1">
          <time dateTime={interview.date} className="text-[13px] text-gray-600">{formatDate(interview.date)}</time>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-700">
            {COPY.card.cta[interview.type]}
            <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-[var(--motion-base)] ease-out-expo group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
