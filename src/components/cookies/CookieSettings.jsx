import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Shield, BarChart3, Megaphone, CheckCircle2, Info } from 'lucide-react'
import { useCookieConsent } from '../../hooks/useCookieConsent'

/**
 * CookieSettings.jsx
 * ─────────────────────────────────────────────────────────────────
 * Advanced cookie preference management for Settings page.
 * 
 * INTEGRATION WITH GOOGLE ANALYTICS:
 * ──────────────────────────────────
 * This component is fully integrated with Google Analytics 4 Consent Mode v2:
 * 
 * 1. Uses `useCookieConsent` hook which manages:
 *    - HTTP cookies (mc_consent) readable by server
 *    - localStorage backup (medsoils_consent)
 *    - Real-time GA4 Consent Mode v2 updates
 * 
 * 2. Cookie categories mapped to GA4 consent types:
 *    - Necessary  → security_storage (always granted)
 *    - Analytics  → analytics_storage + functionality_storage
 *    - Marketing  → ad_storage + ad_user_data + ad_personalization
 * 
 * 3. Changes are synchronized immediately via:
 *    - saveCustom() → persistConsent() → applyConsent()
 *    - acceptAll() → grants all GA4 consent types
 *    - rejectAll() → denies optional consents, purges GA cookies
 * 
 * 4. Persistence: Cookies stored for 1 year (for logged-in users)
 * 
 * SYNC WITH BANNER:
 * ─────────────────
 * The CookieBanner.jsx component and this Settings page share the same
 * useCookieConsent hook, so preferences set in either location are
 * synchronized across the entire app.
 */

/* ─── Toggle Component ────────────────────────────────────────────────── */
function CookieToggle({ checked, onChange, disabled = false, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        checked ? 'bg-orange-500' : 'bg-gray-200',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  )
}

/* ─── Cookie Category Card ────────────────────────────────────────────── */
function CookieCategoryCard({ icon: Icon, title, description, checked, onChange, disabled, badge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        'relative bg-white rounded-xl border-2 p-4 transition-all duration-200',
        checked 
          ? 'border-orange-500 bg-orange-50/30'
          : 'border-gray-200 hover:border-gray-300',
        disabled && 'bg-gray-50/50',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={[
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          checked ? 'bg-orange-500' : 'bg-gray-100',
        ].join(' ')}>
          <Icon className={[
            'w-5 h-5',
            checked ? 'text-white' : 'text-gray-600',
          ].join(' ')} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wide rounded">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        </div>

        {/* Toggle */}
        <div className="flex flex-col items-center gap-1">
          <CookieToggle
            id={`cookie-toggle-${title}`}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
          {checked && !disabled && (
            <CheckCircle2 className="w-3 h-3 text-orange-500" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main Cookie Settings Component ──────────────────────────────────── */
export default function CookieSettings() {
  const { consent, saveCustom, acceptAll, rejectAll } = useCookieConsent()
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Initialize preferences from current consent
  useEffect(() => {
    if (consent) {
      setPreferences({
        necessary: true,
        analytics: consent.analytics || false,
        marketing: consent.marketing || false,
      })
    }
  }, [consent])

  const handleSave = async () => {
    setIsSaving(true)
    
    // Use the existing cookie consent system which handles:
    // - HTTP cookie persistence
    // - localStorage backup
    // - Google Analytics Consent Mode v2 update
    // - Event dispatching
    saveCustom(preferences)
    
    // Show success feedback
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 600)
  }

  const handleAcceptAll = () => {
    setPreferences({ necessary: true, analytics: true, marketing: true })
    setIsSaving(true)
    acceptAll()
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 600)
  }

  const handleRejectAll = () => {
    setPreferences({ necessary: true, analytics: false, marketing: false })
    setIsSaving(true)
    rejectAll()
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 600)
  }

  const hasChanges = consent && (
    preferences.analytics !== consent.analytics ||
    preferences.marketing !== consent.marketing
  )

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4"
      >
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">About Cookie Preferences</p>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            We use cookies to enhance your browsing experience and analyze our traffic using <strong>Google Analytics 4</strong> with <strong>Consent Mode v2</strong>. 
            Your preferences are synchronized in real-time. Essential cookies are always active for core functionality.
          </p>
        </div>
      </motion.div>

      {/* Cookie Categories */}
      <div className="space-y-3">
        <CookieCategoryCard
          icon={Shield}
          title="Strictly Necessary"
          description="These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility. These cannot be disabled."
          checked={true}
          onChange={() => {}}
          disabled={true}
          badge="Required"
        />

        <CookieCategoryCard
          icon={BarChart3}
          title="Analytics Cookies"
          description="Help us understand how visitors interact with our website using Google Analytics 4. Enables analytics_storage and functionality_storage. Cookies: _ga, _ga_*, _gid. All data is anonymized until consent is granted."
          checked={preferences.analytics}
          onChange={(val) => setPreferences(p => ({ ...p, analytics: val }))}
          disabled={false}
        />

        <CookieCategoryCard
          icon={Megaphone}
          title="Marketing Cookies"
          description="Used for personalized advertising and remarketing campaigns. Enables ad_storage, ad_user_data, and ad_personalization in Google Consent Mode v2. May be set by advertising partners to build interest profiles."
          checked={preferences.marketing}
          onChange={(val) => setPreferences(p => ({ ...p, marketing: val }))}
          disabled={false}
        />
      </div>

      {/* Save Button & Success Message */}
      <div className="flex flex-col gap-3 pt-2">
        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAcceptAll}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold shadow-md shadow-orange-200
              hover:bg-orange-600 active:scale-95 transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept all cookies
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRejectAll}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg border-2 border-gray-300 bg-white text-gray-700 text-sm font-semibold
              hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject all cookies
          </motion.button>
        </div>

        {/* Custom Save */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={hasChanges ? { scale: 1.02 } : {}}
            whileTap={hasChanges ? { scale: 0.98 } : {}}
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={[
              'px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
              hasChanges && !isSaving
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md shadow-orange-200 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            ].join(' ')}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save custom preferences'
            )}
          </motion.button>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2 text-green-600"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-semibold">Preferences saved!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Additional Info */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
          <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            <strong>Real-time sync:</strong> Your preferences are instantly synchronized with Google Analytics Consent Mode v2. 
            Changes take effect immediately and are stored for 1 year.
          </p>
        </div>
        <p className="text-xs text-gray-500">
          For more information about how we handle your data, please read our{' '}
          <a 
            href="/privacy-policy" 
            className="text-orange-500 hover:text-orange-600 font-medium underline underline-offset-2 transition-colors"
          >
            Privacy Policy
          </a>
          {' '}and{' '}
          <a 
            href="/cookie-policy" 
            className="text-orange-500 hover:text-orange-600 font-medium underline underline-offset-2 transition-colors"
          >
            Cookie Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
