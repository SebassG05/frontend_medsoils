import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Footer from '../components/layout/Footer'
import PageHero from '../components/shared/PageHero'
import SearchField from '../components/shared/SearchField'
import EmptyState from '../components/dissemination/EmptyState'
import InterviewSkeleton from '../components/dissemination/InterviewSkeleton'
import FeaturedInterview from '../components/dissemination/FeaturedInterview'
import InterviewGrid from '../components/dissemination/InterviewGrid'
import InterviewFilters from '../components/dissemination/InterviewFilters'
import LoadError from '../components/dissemination/LoadError'
import useInterviews from '../hooks/useInterviews'
import useInterviewFilters from '../hooks/useInterviewFilters'
import { availableLanguages, buildListingMeta, countByType, filterInterviews, pickFeatured } from '../data/dissemination'
import usePageMeta from '../utils/usePageMeta'
import { COPY } from '../data/dissemination/copy'
import { fadeRise } from '../utils/motion'

const CONTAINER = 'mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12'

/**
 * /dissemination — interviews listing.
 * Without search/filters: featured interview + the rest in a grid.
 * With any of them: no featured block, every match in the grid.
 */
export default function Dissemination() {
  const { status, interviews, retry } = useInterviews()
  const { filters, setQuery, setType, setLang, clear } = useInterviewFilters()
  const reduce = useReducedMotion()
  usePageMeta(buildListingMeta(COPY, { origin: window.location.origin }))

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

      {status === 'error' && <LoadError onRetry={retry} />}

      {status === 'ready' && interviews.length === 0 && <EmptyState variant="empty" />}

      {status === 'ready' && interviews.length > 0 && (
        <div className="pb-28">
          {featured && (
            <motion.section
              variants={fadeRise(reduce, 0.24)}
              initial="hidden"
              animate="show"
              aria-label={COPY.featured.eyebrow(featured.type)}
              className={`${CONTAINER} pt-4`}
            >
              <FeaturedInterview interview={featured} />
            </motion.section>
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
