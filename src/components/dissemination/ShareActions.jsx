import { useEffect, useRef, useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'
import { COPY } from '../../data/dissemination/copy'

const BTN = 'inline-flex min-h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors duration-[var(--motion-fast)] hover:border-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2'

/** "Copy link" (always) and the native share sheet (when the browser has one). */
export default function ShareActions({ title }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  // Share the clean URL, without dev-only demo params.
  const url = () => `${window.location.origin}${window.location.pathname}`

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url())
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked: the address bar still has the link */ }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={copy} className={BTN}>
        {copied ? <Check size={16} aria-hidden="true" className="text-green-700" /> : <Link2 size={16} aria-hidden="true" className="text-orange-700" />}
        {COPY.detail.copyLink}
      </button>
      {canShare && (
        <button type="button" onClick={() => navigator.share({ title, url: url() }).catch(() => {})} className={BTN}>
          <Share2 size={16} aria-hidden="true" className="text-orange-700" />
          {COPY.detail.share}
        </button>
      )}
      <span role="status" className="text-sm text-gray-600">{copied ? COPY.detail.copied : ''}</span>
    </div>
  )
}
