import InterviewCard from './InterviewCard'
import { COPY } from '../../data/dissemination/copy'

/** "More interviews" at the end of an interview; hidden when there are none. */
export default function RelatedInterviews({ interviews }) {
  if (!interviews.length) return null
  return (
    <section aria-labelledby="related-heading" className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
      <h2 id="related-heading" className="font-headline text-[28px] sm:text-[32px] font-bold tracking-[-0.02em] text-gray-900">
        {COPY.detail.related}
      </h2>
      <ul role="list" className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {interviews.map(it => (
          <li key={it.slug}><InterviewCard interview={it} /></li>
        ))}
      </ul>
    </section>
  )
}
