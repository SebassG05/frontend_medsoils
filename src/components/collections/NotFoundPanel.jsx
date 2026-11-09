import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFoundPanel({ title, body, cta, to }) {
  return (
    <div className="flex flex-col items-center text-center py-24 gap-3">
      <Compass size={40} strokeWidth={1.3} aria-hidden="true" className="text-gray-400" />
      <h1 className="font-headline text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600">{body}</p>
      <Link
        to={to}
        className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-orange-500 text-white shadow-sm hover:bg-orange-600 transition-colors duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {cta}
      </Link>
    </div>
  )
}
