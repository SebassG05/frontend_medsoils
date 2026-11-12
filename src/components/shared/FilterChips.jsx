/**
 * Single-choice filter chips (toggle buttons with aria-pressed).
 * options: [{ value, label, count? }]. With `scrollOnMobile` the row scrolls
 * sideways below `sm` instead of wrapping.
 */
export default function FilterChips({ label, options, value, onChange, scrollOnMobile = false, className = '' }) {
  const layout = scrollOnMobile
    ? 'flex-nowrap overflow-x-auto snap-x -mx-4 px-4 py-1 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
    : 'flex-wrap'
  return (
    <div role="group" aria-label={label} className={`flex items-center gap-2 ${layout} ${className}`}>
      {options.map(opt => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`shrink-0 snap-start inline-flex min-h-9 items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 ${
              active
                ? 'bg-orange-700 text-white border-orange-700 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-700'
            }`}
          >
            {opt.label}
            {opt.count != null && (
              <span className={`tabular-nums text-xs ${active ? 'text-white' : 'text-gray-500'}`}>{opt.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
