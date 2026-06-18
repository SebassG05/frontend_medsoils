import { useState } from 'react'
import { useCookieConsent } from '../../hooks/useCookieConsent'

/* ─── Toggle ────────────────────────────────────────────────── */
function Toggle({ checked, onChange, disabled = false, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        checked ? 'bg-orange-500' : 'bg-gray-200',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}

/* ─── Fila de categoría ─────────────────────────────────────── */
function CategoryRow({ label, description, checked, onChange, disabled }) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-3 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0 flex flex-col items-center gap-0.5">
        <Toggle id={`toggle-${label}`} checked={checked} onChange={onChange} disabled={disabled} />
        {disabled && (
          <span className="text-[10px] font-semibold text-orange-500 tracking-wide">Always on</span>
        )}
      </div>
    </div>
  )
}

/* ─── Banner ────────────────────────────────────────────────── */
export default function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, saveCustom } = useCookieConsent()
  const [expanded, setExpanded] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false })
  const [visible, setVisible] = useState(true)

  function withExit(fn) {
    return () => { setVisible(false); setTimeout(fn, 280) }
  }
  function handleSaveCustom() {
    setVisible(false); setTimeout(() => saveCustom(prefs), 280)
  }

  if (!showBanner) return null

  return (
    <div
      className={[
        'fixed bottom-0 inset-x-0 z-[9999] px-4 pb-4 sm:px-6',
        'transition-transform duration-300 ease-out',
        visible ? 'translate-y-0' : 'translate-y-[calc(100%+16px)]',
      ].join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
    >
      {/* Card contenedor */}
      <div className="mx-auto max-w-5xl rounded-2xl bg-white shadow-[0_8px_48px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.06]">

        {/* Panel de preferencias (expandible) */}
        <div
          className={[
            'overflow-hidden transition-all duration-300 ease-out',
            expanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
          aria-hidden={!expanded}
        >
          <div className="px-6 pt-5 pb-1 border-b border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-300 mb-2">
              Cookie preferences
            </p>
            <CategoryRow
              label="Strictly Necessary"
              description="Required for core site functionality. Always active and cannot be disabled."
              checked={true}
              onChange={() => {}}
              disabled={true}
            />
            <CategoryRow
              label="Analytics"
              description="Helps us understand how visitors use the site so we can continuously improve it."
              checked={prefs.analytics}
              onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
            />
            <CategoryRow
              label="Marketing"
              description="Allows us to deliver personalised content and relevant communications."
              checked={prefs.marketing}
              onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
            />
          </div>
        </div>

        {/* Fila principal */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4">
          {/* Icono + texto */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3.003-2.937.005-.034.016-.136.017-.17a1 1 0 0 0-1.224-1.01A3 3 0 0 1 15 7c-1.654 0-3-1.346-3-3 0-.462.111-.897.301-1.285a1 1 0 0 0-1.09-1.425C5.558 2.198 2 6.554 2 12c0 5.514 4.486 10 10 10s10-4.486 10-10c0-.384-.023-.763-.065-1.14a1.001 1.001 0 0 0-.337-.796zM12 20c-4.411 0-8-3.589-8-8 0-3.723 2.496-6.88 6.07-7.769C10.035 5.49 11 6.617 11 8c0 1.486.804 2.814 2 3.547V12.5a1.5 1.5 0 0 0 3 0v-.468c.361.295.765.528 1.203.683C17.15 16.753 14.825 20 12 20z"/>
                <circle cx="9.5" cy="13.5" r="1.5"/><circle cx="14.5" cy="17.5" r="1.5"/><circle cx="8.5" cy="17.5" r="1.5"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">This website uses cookies</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed max-w-xl">
                We use our own and third-party cookies to improve our services and show you advertising related to your preferences, based on a profile built from your browsing habits.{' '}
                <a
                  href="/politica-cookies"
                  className="font-medium text-orange-500 hover:text-orange-600 underline underline-offset-2 transition-colors"
                >
                  Cookie Policy
                </a>
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded((e) => !e)}
              className={[
                'rounded-lg border px-4 py-2 text-xs font-semibold transition-all duration-150 active:scale-95',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
                expanded
                  ? 'border-orange-200 bg-orange-50 text-orange-600'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700',
              ].join(' ')}
            >
              {expanded ? 'Hide settings' : 'Manage cookies'}
            </button>

            {expanded && (
              <button
                onClick={handleSaveCustom}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600
                  hover:border-gray-300 hover:text-gray-800 active:scale-95
                  transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                Save selection
              </button>
            )}

            <button
              onClick={withExit(rejectAll)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600
                hover:border-gray-300 hover:text-gray-800 active:scale-95
                transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              Reject all
            </button>

            <button
              onClick={withExit(acceptAll)}
              className="rounded-lg bg-orange-500 px-5 py-2 text-xs font-bold text-white
                hover:bg-orange-600 active:scale-95
                transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500
                shadow-md shadow-orange-200"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
