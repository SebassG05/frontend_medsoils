/**
 * analyticsManager.js
 * ─────────────────────────────────────────────────────────────────
 * Google Analytics 4 + Google Consent Mode v2
 *
 * HOW IT WORKS
 * ────────────
 * 1. index.html bootstraps window.dataLayer and `gtag` with all
 *    consents set to 'denied' BEFORE any other scripts run.
 * 2. This module dynamically injects the GA4 script tag once (lazy)
 *    and exposes `applyConsent()` which calls gtag('consent','update').
 * 3. Until `analytics_storage` is 'granted', GA4 only sends
 *    cookieless pings — no identifying data is stored.
 *
 * CONSENT MAPPING
 * ───────────────
 *  analytics  → analytics_storage + functionality_storage
 *  marketing  → ad_storage + ad_user_data + ad_personalization
 *  necessary  → security_storage (always granted)
 */

const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID

let _initialized = false

/* ─── Internal gtag helper ─────────────────────────────────── */
function gtag(...args) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
}

/* ─── Lazily inject the GA4 <script> tag ───────────────────── */
function injectGA4Script() {
  if (!GA4_ID || document.getElementById('ga4-script')) return
  const script = document.createElement('script')
  script.id    = 'ga4-script'
  script.async = true
  script.src   = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  document.head.appendChild(script)
}

/**
 * Called once on app start (from main.jsx or App.jsx).
 * Sets up gtag with default 'denied' state before the GA4 script
 * loads — this is the Consent Mode v2 requirement.
 */
export function initGA4() {
  if (_initialized) return
  _initialized = true

  window.dataLayer = window.dataLayer || []

  // Default consent: everything denied until user chooses
  gtag('consent', 'default', {
    analytics_storage:      'denied',
    ad_storage:             'denied',
    ad_user_data:           'denied',
    ad_personalization:     'denied',
    functionality_storage:  'denied',
    security_storage:       'granted', // necessary cookies – always on
    wait_for_update:        500,       // ms to wait before firing hits
  })

  gtag('js', new Date())

  if (GA4_ID) {
    gtag('config', GA4_ID, {
      // Anonymize IPs while consent is pending / denied
      anonymize_ip: true,
    })
    injectGA4Script()
  }
}

/**
 * Apply the user's consent choice.
 * Call this every time consent is saved (accept, reject, or custom).
 *
 * @param {{ necessary: boolean, analytics: boolean, marketing: boolean }} preferences
 */
export function applyConsent(preferences) {
  const { analytics = false, marketing = false } = preferences

  gtag('consent', 'update', {
    analytics_storage:      analytics ? 'granted' : 'denied',
    functionality_storage:  analytics ? 'granted' : 'denied',
    ad_storage:             marketing ? 'granted' : 'denied',
    ad_user_data:           marketing ? 'granted' : 'denied',
    ad_personalization:     marketing ? 'granted' : 'denied',
    security_storage:       'granted',
  })

  // If analytics was just granted and GA4 is configured, ensure
  // the script is loaded (may not be if initGA4 ran before consent)
  if (analytics && GA4_ID) {
    injectGA4Script()
  }

  // If analytics was denied, remove GA cookies left from prior sessions
  if (!analytics) {
    purgeGACookies()
  }
}

/**
 * Remove Google Analytics cookies from the browser.
 * Called when user rejects / withdraws analytics consent.
 */
function purgeGACookies() {
  const gaCookiePattern = /^(_ga|_gid|_gat|__utma|__utmb|__utmc|__utmz)/
  document.cookie.split('; ').forEach((row) => {
    const name = row.split('=')[0]
    if (gaCookiePattern.test(name)) {
      // Remove for current domain and common subdomains
      ;[location.hostname, '.' + location.hostname].forEach((domain) => {
        document.cookie = `${name}=; max-age=0; path=/; domain=${domain}`
      })
    }
  })
}
