import { useRef } from 'react'
import { Search, X } from 'lucide-react'

/**
 * Rounded search input used in page heroes. Controlled: `onChange` receives
 * the new string. The clear button returns focus to the input.
 */
export default function SearchField({ value, onChange, placeholder, label, clearLabel = 'Clear search', className = '' }) {
  const input = useRef(null)
  return (
    <div className={`relative ${className}`}>
      <Search size={18} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      <input
        ref={input}
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => { onChange(''); input.current?.focus() }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:text-gray-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
