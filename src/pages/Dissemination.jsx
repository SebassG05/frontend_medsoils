import { useState } from 'react'
import Footer from '../components/layout/Footer'
import PageHero from '../components/shared/PageHero'
import SearchField from '../components/shared/SearchField'
import EmptyState from '../components/dissemination/EmptyState'
import InterviewSkeleton from '../components/dissemination/InterviewSkeleton'
import useInterviews from '../hooks/useInterviews'
import { COPY } from '../data/dissemination/copy'

/** /dissemination — interviews listing. */
export default function Dissemination() {
  const { status, interviews, retry } = useInterviews()
  const [q, setQ] = useState('')

  return (
    <div className="min-h-screen bg-white">
      <PageHero eyebrow={COPY.hero.eyebrow} highlight={COPY.hero.highlight} title={COPY.hero.title} intro={COPY.hero.intro}>
        <SearchField value={q} onChange={setQ} placeholder={COPY.hero.searchPlaceholder} label={COPY.hero.searchLabel} />
      </PageHero>

      {status === 'loading' && <div className="pt-4 pb-24"><InterviewSkeleton count={6} featured /></div>}

      {status === 'error' && (
        <div role="alert" className="flex flex-col items-center gap-4 px-4 py-24 text-center">
          <p className="text-lg text-gray-700">{COPY.error.title}</p>
          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-11 items-center rounded-full bg-orange-700 px-6 py-2.5 text-[15px] font-semibold text-white transition-colors duration-[var(--motion-fast)] hover:bg-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
          >
            {COPY.error.retry}
          </button>
        </div>
      )}

      {status === 'ready' && interviews.length === 0 && <EmptyState variant="empty" />}

      <Footer />
    </div>
  )
}
