import { useState, useEffect, useCallback } from 'react'
import { setCookie, getCookie, removeCookie } from '../utils/cookieUtils'
import { applyConsent } from '../utils/analyticsManager'

/**
 * ─── Cookie names ──────────────────────────────────────────────
 * mc_consent        – real HTTP cookie (readable by server too)
 * medsoils_consent  – localStorage backup for fast UI hydration
 */
const HTTP_COOKIE    = 'mc_consent'
const LS_KEY         = 'medsoils_consent'
const CONSENT_VERSION = '1'

const DEFAULT_PREFS = { necessary: true, analytics: false, marketing: false }

/**
 * Encode / decode preferences as a compact cookie value.
 * Format: "v=1;n=1;a=0;m=0"
 */
function encodePrefs(prefs) {
  return [
    `v=${CONSENT_VERSION}`,
    `n=1`,
    `a=${prefs.analytics ? 1 : 0}`,
    `m=${prefs.marketing ? 1 : 0}`,
  ].join(';')
}

function decodePrefs(raw) {
  if (!raw) return null
  const map = Object.fromEntries(raw.split(';').map((p) => p.split('=')))
  if (map.v !== CONSENT_VERSION) return null
  return {
    necessary: true,
    analytics: map.a === '1',
    marketing: map.m === '1',
  }
}

/**
 * Reads stored consent from the HTTP cookie (preferred) or
 * localStorage fallback.  Returns null if no valid stored consent.
 */
function readStoredConsent() {
  // 1. HTTP cookie (also sent to the server on every request)
  const fromCookie = decodePrefs(getCookie(HTTP_COOKIE))
  if (fromCookie) return fromCookie

  // 2. localStorage fallback (e.g. cookie was cleared but LS wasn't)
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.v === CONSENT_VERSION) {
        return { necessary: true, analytics: !!parsed.a, marketing: !!parsed.m }
      }
    }
  } catch { /* ignore */ }

  return null
}

/**
 * Persists consent in both the HTTP cookie and localStorage,
 * then fires the GA4 Consent Mode v2 update.
 */
function persistConsent(prefs) {
  // HTTP cookie — readable by server-side code too
  setCookie(HTTP_COOKIE, encodePrefs(prefs))

  // localStorage (fast UI reads, doesn't need server access)
  localStorage.setItem(
    LS_KEY,
    JSON.stringify({ v: CONSENT_VERSION, a: prefs.analytics ? 1 : 0, m: prefs.marketing ? 1 : 0 })
  )

  // Fire real GA4 Consent Mode v2 update
  applyConsent(prefs)

  // Dispatch event so other parts of the app can react
  window.dispatchEvent(new CustomEvent('medsoils:consent', { detail: prefs }))
}

/**
 * useCookieConsent
 * ─────────────────────────────────────────────────────────────────
 * Central hook for cookie consent management.
 *
 * Behaviour:
 *  - Logged-in users: banner shown only once; choice remembered 1 year.
 *  - Guests (not logged in): banner shown on every page load.
 */
export function useCookieConsent() {
  const [consent, setConsent]       = useState(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('user')
    const stored     = readStoredConsent()

    if (isLoggedIn && stored) {
      // Registered user already decided — apply silently, skip banner
      applyConsent(stored)
      setConsent(stored)
      setShowBanner(false)
    } else {
      // Guest OR first-time registered user — show banner
      setConsent(DEFAULT_PREFS)
      setShowBanner(true)
    }
  }, [])

  const saveConsent = useCallback((prefs) => {
    persistConsent(prefs)
    setConsent(prefs)
    setShowBanner(false)
  }, [])

  const acceptAll = useCallback(() =>
    saveConsent({ necessary: true, analytics: true, marketing: true }),
  [saveConsent])

  const rejectAll = useCallback(() => {
    // Remove any previously set GA cookies when user rejects
    removeCookie(HTTP_COOKIE)
    saveConsent({ necessary: true, analytics: false, marketing: false })
    // Re-set the consent cookie (saveConsent will call persistConsent)
  }, [saveConsent])

  const saveCustom = useCallback((prefs) =>
    saveConsent({ ...prefs, necessary: true }),
  [saveConsent])

  /** Re-open the banner (e.g. from a Settings / Privacy page) */
  const openBanner = useCallback(() => setShowBanner(true), [])

  return { consent, showBanner, acceptAll, rejectAll, saveCustom, openBanner }
}
