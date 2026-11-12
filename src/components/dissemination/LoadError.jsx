import { COPY } from '../../data/dissemination/copy'

/** "We couldn't load the interviews." with a retry button. */
export default function LoadError({ onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-lg text-gray-700">{COPY.error.title}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex min-h-11 items-center rounded-full bg-orange-700 px-6 py-2.5 text-[15px] font-semibold text-white transition-colors duration-[var(--motion-fast)] hover:bg-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
      >
        {COPY.error.retry}
      </button>
    </div>
  )
}
