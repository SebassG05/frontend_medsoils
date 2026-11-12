import Avatar from './Avatar'
import { TYPE_ICON, languageName, lengthLabel, roleLine } from './meta'
import { formatDate } from '../../data/dissemination'
import { COPY } from '../../data/dissemination/copy'

/** Title, interviewee and meta line of an interview (above the player). */
export default function InterviewHeader({ interview }) {
  const Icon = TYPE_ICON[interview.type]
  const duration = lengthLabel(interview)
  const person = interview.interviewee

  return (
    <header className="space-y-6">
      <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-orange-700">
        <Icon size={15} aria-hidden="true" strokeWidth={2.4} />
        {COPY.types[interview.type]}
      </p>
      <h1 className="font-headline text-[40px] sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.03em] text-gray-900 text-balance">
        {interview.title}
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar person={person} size={64} />
          <p className="min-w-0 leading-snug">
            <span dir="auto" className="block text-lg font-semibold text-gray-900">{person.name}</span>
            <span dir="auto" className="block text-base text-gray-600 [overflow-wrap:anywhere]">{roleLine(person)}</span>
          </p>
        </div>
        <p className="text-base text-gray-600">
          <time dateTime={interview.date}>{formatDate(interview.date)}</time>
          {duration && <> · {duration}</>}
          {' · '}{languageName(interview.language)}
        </p>
      </div>
      {interview.tags?.length > 0 && (
        // Plain text, not pills: pills read as clickable filters, and these aren't.
        <p className="text-base text-gray-600 [overflow-wrap:anywhere]">
          <span className="font-semibold text-gray-700">{COPY.detail.topics}: </span>
          {interview.tags.join(' · ')}
        </p>
      )}
    </header>
  )
}
