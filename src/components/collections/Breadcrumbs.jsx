import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { COPY } from '../../data/collections/copy'

/** items: [{ label, to }] — the last item is the current page and is not a link. */
export default function Breadcrumbs({ items, label = COPY.breadcrumbs.label }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-600">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1.5 min-w-0">
              {last ? (
                <span aria-current="page" className="font-medium text-gray-900 truncate">{item.label}</span>
              ) : (
                <>
                  <Link
                    to={item.to}
                    className="inline-flex -my-3 py-3 rounded-md hover:text-orange-600 transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight size={14} aria-hidden="true" className="text-gray-400 shrink-0" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
