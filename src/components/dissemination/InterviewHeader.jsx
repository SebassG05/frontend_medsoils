import Avatar from './Avatar'
import { TYPE_ICON, durationLabel, languageName, roleLine } from './meta'
import { formatDate } from '../../data/dissemination'
import { COPY } from '../../data/dissemination/copy'

/** Title, interviewee and meta line of an interview (above the player). */
export default function InterviewHeader({ interview }) {
  const Icon = TYPE_ICON[interview.type]
  const duration = durationLabel(interview)
  const person = interview.interviewee

  return (
    <header className="space-y-6">
      <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-orange-700">
        <Icon size={15} aria-hidden="true" strokeWidth={2.4} />
        {COPY.types[interview.type]}
      </p>
      <h1 className="font-headline text-[34px] sm:text-5xl font-bold leading-[1.08] tracking-[-0.025em] text-gray-900 text-balance">
        {interview.title}
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <Avatar person={person} size={56} />
          <p className="min-w-0 leading-snug">
            <span className="block font-semibold text-gray-900">{person.name}</span>
            <span className="block text-sm text-gray-600 [overflow-wrap:anywhere]">{roleLine(person)}</span>
          </p>
        </div>
        <p className="text-sm text-gray-600">
          <time dateTime={interview.date}>{formatDate(interview.date)}</time>
          {duration && <> · {duration}</>}
          {' · '}{languageName(interview.language)}
        </p>
      </div>
      {interview.tags?.length > 0 && (
        <ul role="list" className="flex flex-wrap gap-2">
          {interview.tags.map(tag => (
            <li key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{tag}</li>
          ))}
        </ul>
      )}
    </header>
  )
}
