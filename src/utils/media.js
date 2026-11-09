/**
 * Resolves collection media paths (e.g. "adiyaman/dia-1/photo-01") to URLs.
 *
 * Hosting is still undecided, so everything goes through VITE_MEDIA_BASE_URL.
 * Expected files for a photo "<src>":
 *   <src>-480.avif  <src>-960.avif  <src>-1600.avif
 *   <src>-480.webp  <src>-960.webp  <src>-1600.webp
 *   <src>-1600.jpg  (fallback)
 * and for a video "<src>": <src>.mp4 (+ optional <src>.<lang>.vtt).
 *
 * In development, when VITE_MEDIA_BASE_URL is unset, the Vite dev server
 * serves generated placeholders from /__dev-media (see vite.config.js and
 * scripts/generate-dev-media.mjs). Production builds without a base URL
 * report media as unconfigured and the Field trips section stays hidden.
 */

const ENV_BASE = (import.meta.env.VITE_MEDIA_BASE_URL || '').replace(/\/$/, '')
const DEV_BASE = '/__dev-media'

export const MEDIA_BASE = ENV_BASE || (import.meta.env.DEV ? DEV_BASE : '')
export const isMediaConfigured = Boolean(MEDIA_BASE)

export const IMAGE_WIDTHS = [480, 960, 1600]

const url = path => `${MEDIA_BASE}/${path}`

const srcSet = (src, ext) => IMAGE_WIDTHS.map(w => `${url(`${src}-${w}.${ext}`)} ${w}w`).join(', ')

/** Sources for a <picture>: AVIF, then WebP, then a JPEG fallback. */
export function imageSources(src) {
  return {
    avif: srcSet(src, 'avif'),
    webp: srcSet(src, 'webp'),
    fallback: url(`${src}-1600.jpg`),
  }
}

export const posterUrl = src => url(`${src}-1600.jpg`)
export const videoUrl = src => url(`${src}.mp4`)
export const trackUrl = path => url(path)
