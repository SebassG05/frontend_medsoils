import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Headphones, Play } from 'lucide-react'
import { COPY } from '../../data/dissemination/copy'

/** One dashed "ghost" interview card for the empty-state illustration. */
function GhostCard({ icon: Icon, className }) {
  return (
    <div className={`absolute w-[38%] overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white shadow-[0_12px_28px_-14px_rgb(42_21_10/0.25)] ${className}`}>
      <div className="flex aspect-video items-center justify-center bg-orange-50">
        <span className="flex size-9 sm:size-11 items-center justify-center rounded-full bg-white">
          <Icon className="size-4 sm:size-5 text-orange-500" strokeWidth={2} />
        </span>
      </div>
      <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4">
        <div className="h-1.5 sm:h-2 w-[80%] rounded-full bg-gray-200" />
        <div className="h-1.5 sm:h-2 w-[60%] rounded-full bg-gray-200" />
        <div className="h-1.5 sm:h-2 w-[38%] rounded-full bg-gray-100" />
      </div>
    </div>
  )
}

const LINK = 'group inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-2.5 text-[15px] font-semibold transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2'

/**
 * `empty`: no interviews published yet (what the page shows today).
 * `noResults`: interviews exist but the search/filters match none.
 */
export default function EmptyState({ variant = 'empty', query = '', onClear }) {
  if (variant === 'noResults') {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-lg text-gray-700">{COPY.noResults.title(query)}</p>
        <button
          type="button"
          onClick={onClear}
          className={`${LINK} border border-gray-300 bg-white text-gray-900 hover:border-orange-300`}
        >
          {COPY.noResults.clear}
        </button>
      </div>
    )
  }

  return (
    <section aria-labelledby="empty-heading" className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-6 pb-28 sm:pb-36 text-center">
      <div aria-hidden="true" className="relative mx-auto mb-10 h-40 w-full max-w-[22rem] sm:mb-12 sm:h-64 sm:max-w-[35rem]">
        <GhostCard icon={Headphones} className="left-[2%] top-[22%] rotate-6 opacity-75" />
        <GhostCard icon={FileText} className="right-[2%] top-[22%] -rotate-6 opacity-75" />
        <GhostCard icon={Play} className="left-[31%] top-[4%]" />
      </div>
      <h2 id="empty-heading" className="font-headline text-[28px] sm:text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-gray-900 text-balance">
        {COPY.empty.title}
      </h2>
      <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-gray-600 text-pretty">{COPY.empty.body}</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link to="/resources" className={`${LINK} bg-orange-700 text-white hover:bg-orange-800`}>
          {COPY.empty.resources}
          <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5" />
        </Link>
        <Link to="/blog" className={`${LINK} border border-gray-300 bg-white text-gray-900 hover:border-orange-300`}>
          {COPY.empty.blog}
          <ArrowRight size={16} aria-hidden="true" className="text-orange-700 transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}
