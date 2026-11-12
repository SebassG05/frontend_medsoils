import { ChevronDown, Globe } from 'lucide-react'
import FilterChips from '../shared/FilterChips'
import { languageName } from './meta'
import { COPY } from '../../data/dissemination/copy'
import { formatsWithResults } from '../../data/dissemination'

/**
 * Type chips, optional language select (only with ≥ 2 languages) and the
 * result count, announced politely to screen readers when it changes.
 */
export default function InterviewFilters({ filters, counts, languages, resultCount, onTypeChange, onLangChange }) {
  // Only formats that exist; with a single format there is nothing to choose.
  const formats = formatsWithResults(counts)
  const options = ['all', ...formats].map(value => ({
    value,
    label: COPY.filters[value],
    count: counts[value],
  }))
  const lang = filters.lang && languages.includes(filters.lang) ? filters.lang : ''

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {formats.length > 1 ? (
        <FilterChips
          label={COPY.filters.label}
          options={options}
          value={filters.type ?? 'all'}
          onChange={v => onTypeChange(v === 'all' ? null : v)}
          scrollOnMobile
        />
      ) : <span />}
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        {languages.length > 1 && (
          <label className="relative inline-flex items-center">
            <span className="sr-only">{COPY.filters.language}</span>
            <Globe size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 text-gray-500" />
            <select
              value={lang}
              onChange={e => onLangChange(e.target.value || null)}
              className="min-h-9 appearance-none rounded-full border border-gray-200 bg-white py-1.5 pl-10 pr-9 text-sm font-medium text-gray-700 transition-colors hover:border-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
            >
              <option value="">{COPY.filters.allLanguages}</option>
              {languages.map(code => <option key={code} value={code}>{languageName(code)}</option>)}
            </select>
            <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 text-gray-500" />
          </label>
        )}
        <p aria-live="polite" className="text-sm tabular-nums text-gray-600">{COPY.filters.results(resultCount)}</p>
      </div>
    </div>
  )
}
