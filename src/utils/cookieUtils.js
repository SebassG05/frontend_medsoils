/**
 * cookieUtils.js
 * ─────────────────────────────────────────────────────────────────
 * Helpers for reading / writing / removing real browser cookies.
 * All consent cookies use SameSite=Lax and a 1-year expiry.
 */

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

/**
 * Set a browser cookie.
 * @param {string} name
 * @param {string} value
 * @param {object} [options]
 * @param {number} [options.maxAge=ONE_YEAR_SECONDS] - seconds
 * @param {string} [options.path='/']
 * @param {string} [options.sameSite='Lax']
 * @param {boolean} [options.secure] - auto-true in production
 */
export function setCookie(name, value, options = {}) {
  const {
    maxAge   = ONE_YEAR_SECONDS,
    path     = '/',
    sameSite = 'Lax',
    secure   = location.protocol === 'https:',
  } = options

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
  cookie += `; max-age=${maxAge}`
  cookie += `; path=${path}`
  cookie += `; SameSite=${sameSite}`
  if (secure) cookie += '; Secure'

  document.cookie = cookie
}

/**
 * Read a browser cookie by name.
 * @param {string} name
 * @returns {string|null}
 */
export function getCookie(name) {
  const key = encodeURIComponent(name)
  const match = document.cookie.split('; ').find((row) => row.startsWith(key + '='))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

/**
 * Remove a browser cookie (sets max-age to 0).
 * @param {string} name
 * @param {string} [path='/']
 */
export function removeCookie(name, path = '/') {
  document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=${path}`
}
