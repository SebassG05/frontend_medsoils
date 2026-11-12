import { useMemo } from 'react'
import Footer from '../components/layout/Footer'
import PageHero from '../components/shared/PageHero'
import SearchField from '../components/shared/SearchField'
import EmptyState from '../components/dissemination/EmptyState'
import InterviewSkeleton from '../components/dissemination/InterviewSkeleton'
import FeaturedInterview from '../components/dissemination/FeaturedInterview'
import InterviewGrid from '../components/dissemination/InterviewGrid'
import InterviewFilters from '../components/dissemination/InterviewFilters'
import useInterviews from '../hooks/useInterviews'
import useInterviewFilters from '../hooks/useInterviewFilters'
import { availableLanguages, countByType, filterInterviews, pickFeatured } from '../data/dissemination'
import { COPY } from '../data/dissemination/copy'

const CONTAINER = 'mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12'

/**
 * /dissemination — interviews listing.
 * Without search/filters: featured interview + the rest in a grid.
 * With any of them: no featured block, every match in the grid.
 */
export default function Dissemination() {
  const { status, interviews, retry } = useInterviews()
  const { filters, setQuery, setType, setLang, clear } = useInterviewFilters()

  const languages = useMemo(() => availableLanguages(interviews), [interviews])
  const counts = useMemo(() => countByType(interviews), [interviews])
  const matches = useMemo(() => filterInterviews(interviews, filters), [interviews, filters.q, filters.type, filters.lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtering = Boolean(filters.q.trim() || filters.type || (filters.lang && languages.includes(filters.lang)))
  const featured = filtering ? null : pickFeatured(interviews)
  const gridItems = featured ? matches.filter(it => it.slug !== featured.slug) : matches
  const showToolbar = interviews.length > 1

  return (
    <div className="min-h-screen bg-white">
      <PageHero eyebrow={COPY.hero.eyebrow} highlight={COPY.hero.highlight} title={COPY.hero.title} intro={COPY.hero.intro}>
        <SearchField value={filters.q} onChange={setQuery} placeholder={COPY.hero.searchPlaceholder} label={COPY.hero.searchLabel} />
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

      {status === 'ready' && interviews.length > 0 && (
        <div className="pb-28">
          {featured && (
            <section aria-label={COPY.featured.eyebrow(featured.type)} className={`${CONTAINER} pt-4`}>
              <FeaturedInterview interview={featured} />
            </section>
          )}

          {(showToolbar || filtering) && (
            <section aria-labelledby="all-interviews-heading" className={`${CONTAINER} pt-14 sm:pt-16`}>
              <h2 id="all-interviews-heading" className="font-headline text-[28px] sm:text-[32px] font-bold tracking-[-0.02em] text-gray-900">
                {COPY.list.heading}
              </h2>
              <div className="mt-5 mb-8">
                <InterviewFilters
                  filters={filters}
                  counts={counts}
                  languages={languages}
                  resultCount={matches.length}
                  onTypeChange={setType}
                  onLangChange={setLang}
                />
              </div>
              {gridItems.length > 0 && <InterviewGrid interviews={gridItems} />}
              {matches.length === 0 && <EmptyState variant="noResults" query={filters.q.trim()} onClear={clear} />}
            </section>
          )}
        </div>
      )}

      <Footer />
    </div>
  )
}
