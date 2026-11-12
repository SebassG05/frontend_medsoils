import InterviewCard from './InterviewCard'

/** Responsive grid of interview cards: 1 / 2 / 3 columns. */
export default function InterviewGrid({ interviews }) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {interviews.map(it => (
        <li key={it.slug}>
          <InterviewCard interview={it} />
        </li>
      ))}
    </ul>
  )
}
