import { ChevronDown } from 'lucide-react'
import { COPY } from '../../data/dissemination/copy'

/**
 * Interview as questions and answers: questions bold, answers with an
 * orange rule. Speaker names are read out to screen readers. For video and
 * audio it is collapsed behind "Show transcript"; for text interviews it is
 * the article itself.
 */
export default function TranscriptQA({ transcript, interviewee, collapsible = false }) {
  const body = (
    <div className="space-y-6">
      {transcript.map((turn, i) =>
        turn.speaker === 'interviewer' ? (
          <p key={i} className="whitespace-pre-line font-headline text-xl font-semibold leading-snug text-gray-900 text-pretty">
            <span className="sr-only">{COPY.detail.interviewer}: </span>
            {turn.text}
          </p>
        ) : (
          <p key={i} className="whitespace-pre-line border-l-2 border-orange-300 pl-5 text-[17px] leading-relaxed text-gray-700 text-pretty">
            <span className="sr-only">{interviewee.name}: </span>
            {turn.text}
          </p>
        ),
      )}
    </div>
  )

  if (!collapsible) return body

  return (
    <details className="group rounded-[var(--radius-card)] border border-gray-200 bg-white">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--radius-card)] px-6 py-4 font-semibold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 [&::-webkit-details-marker]:hidden">
        {COPY.detail.showTranscript}
        <ChevronDown size={20} aria-hidden="true" className="text-gray-500 transition-transform duration-[var(--motion-base)] group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="border-t border-gray-100 px-6 pt-6 pb-8">{body}</div>
    </details>
  )
}
