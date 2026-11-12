import { Link } from 'react-router-dom'
import { ArrowRight, Headphones, Play } from 'lucide-react'
import InterviewCover from './InterviewCover'
import Avatar from './Avatar'
import { durationLabel, languageName, roleLine } from './meta'
import { formatDate } from '../../data/dissemination'
import { COPY } from '../../data/dissemination/copy'
import useInterviewHref from '../../hooks/useInterviewHref'

/**
 * Large editorial block for the featured interview (variant A in Figma):
 * full-bleed cover 7/12, text 5/12; stacked below lg. One link; the CTA is
 * only visual.
 */
export default function FeaturedInterview({ interview }) {
  const href = useInterviewHref(interview.slug)
  const duration = durationLabel(interview)
  const PlayIcon = interview.type === 'audio' ? Headphones : Play
  const meta = [formatDate(interview.date), duration, languageName(interview.language)].filter(Boolean)

  return (
    <Link
      to={href}
      aria-label={interview.title}
      className="group grid overflow-hidden rounded-[2rem] bg-white shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-4 lg:grid-cols-12"
    >
      <div className="relative aspect-video lg:col-span-7 lg:aspect-auto lg:min-h-[30rem]">
        <InterviewCover
          interview={interview}
          size="maxres"
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="absolute inset-0"
        />
        {interview.type !== 'text' && (
          <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex size-16 sm:size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg">
            <PlayIcon className="size-6 sm:size-7 translate-x-[2px] fill-orange-500 text-orange-500" strokeWidth={interview.type === 'audio' ? 2 : 0} />
          </span>
        )}
        {duration && interview.type !== 'text' && (
          <span className="absolute bottom-5 right-5 rounded-md bg-black/70 px-2.5 py-1 text-[13px] font-semibold tabular-nums text-white">{duration}</span>
        )}
      </div>

      <div className="flex flex-col gap-5 p-7 sm:p-10 lg:col-span-5 lg:p-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-orange-700">
          {COPY.featured.eyebrow(interview.type)}
        </p>
        <h2 className="font-headline text-[30px] sm:text-[38px] font-bold leading-[1.12] tracking-[-0.02em] text-gray-900 text-balance">
          {interview.title}
        </h2>
        {interview.quote && (
          <blockquote className="border-l-[3px] border-orange-500 pl-4 font-headline text-lg sm:text-[19px] font-medium leading-relaxed text-gray-700 text-pretty">
            “{interview.quote}”
          </blockquote>
        )}
        <div className="flex items-center gap-3.5">
          <Avatar person={interview.interviewee} size={52} />
          <p className="min-w-0 leading-snug">
            <span className="block font-semibold text-gray-900">{interview.interviewee.name}</span>
            <span className="block text-sm text-gray-600 [overflow-wrap:anywhere]">{roleLine(interview.interviewee)}</span>
          </p>
        </div>
        <p className="text-sm text-gray-600">{meta.join('  ·  ')}</p>
        <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-orange-700 py-3 pl-6 pr-5 text-[15px] font-semibold text-white transition-colors duration-[var(--motion-fast)] group-hover:bg-orange-800">
          {COPY.featured.cta[interview.type]}
          <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-[var(--motion-base)] ease-out-expo group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
