/**
 * Resolves collection media to URLs. Two kinds of `src` are supported:
 *
 * 1. Cloudinary URLs (https://res.cloudinary.com/<cloud>/image|video/upload/…),
 *    the hosting used today. Sizes and formats come from URL transformations:
 *    photos and video posters get an AVIF/WebP srcset, videos are delivered as
 *    H.264 ≤ 1280 px (phones record 4K HEVC, which many browsers can't play).
 *
 * 2. Relative paths (e.g. "adiyaman/dia-2/photo-01") under VITE_MEDIA_BASE_URL,
 *    for self-hosted media. Expected files for a photo "<src>":
 *      <src>-480|960|1600.avif, <src>-480|960|1600.webp, <src>-1600.jpg
 *    and for a video "<src>": <src>.mp4 (+ optional <src>.<lang>.vtt).
 *    In development, when VITE_MEDIA_BASE_URL is unset, the Vite dev server
 *    serves generated placeholders from /__dev-media
 *    (see vite.config.js and scripts/generate-dev-media.mjs).
 */

const ENV_BASE = (import.meta.env?.VITE_MEDIA_BASE_URL || '').replace(/\/$/, '')
const DEV_BASE = '/__dev-media'

export const MEDIA_BASE = ENV_BASE || (import.meta.env?.DEV ? DEV_BASE : '')
export const isMediaConfigured = Boolean(MEDIA_BASE)

/** Absolute URLs (Cloudinary today) don't depend on VITE_MEDIA_BASE_URL. */
export const isRemote = src => /^https?:\/\//.test(src ?? '')

export const IMAGE_WIDTHS = [480, 960, 1600]

const url = path => `${MEDIA_BASE}/${path}`

const srcSet = (src, ext) => IMAGE_WIDTHS.map(w => `${url(`${src}-${w}.${ext}`)} ${w}w`).join(', ')

/* ── Cloudinary ─────────────────────────────────────────────────────────── */

const CLOUDINARY = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(.+)$/
const CLOUDINARY_WIDTHS = [480, 960, 1600, 1920]

/** Delivery for videos: H.264, ≤ 1280 px on the long side, automatic quality. */
export const CLOUDINARY_VIDEO = 'vc_h264,q_auto,w_1280,h_1280,c_limit'

/**
 * Splits "so_1/v123/name.jpg" into a leading transformation ("so_1", e.g. the
 * frame of a video poster) and the rest, so ours can be merged into it.
 */
function splitLeadingTransform(rest) {
  const m = /^([a-z]+_[^/]+)\/(.+)$/.exec(rest)
  return m ? [`${m[1]},`, m[2]] : ['', rest]
}

function cloudinarySources([, base, rest]) {
  const [lead, path] = splitLeadingTransform(rest)
  const at = (fmt, w) => `${base}${lead}f_${fmt},q_auto,w_${w},c_limit/${path}`
  const set = fmt => CLOUDINARY_WIDTHS.map(w => `${at(fmt, w)} ${w}w`).join(', ')
  return { avif: set('avif'), webp: set('webp'), fallback: at('jpg', 1600) }
}

/** Poster (frame at 1 s) for a Cloudinary video URL. */
export const cloudinaryPoster = videoSrc =>
  videoSrc.replace('/video/upload/', '/video/upload/so_1/').replace(/\.\w+$/, '.jpg')

/* ── Public API ─────────────────────────────────────────────────────────── */

/** Sources for a <picture>: AVIF, then WebP, then a JPEG fallback. */
export function imageSources(src) {
  const cloud = CLOUDINARY.exec(src)
  if (cloud) return cloudinarySources(cloud)
  return {
    avif: srcSet(src, 'avif'),
    webp: srcSet(src, 'webp'),
    fallback: url(`${src}-1600.jpg`),
  }
}

export const posterUrl = src => (CLOUDINARY.test(src) ? imageSources(src).fallback : url(`${src}-1600.jpg`))

export const videoUrl = src =>
  CLOUDINARY.test(src) ? src.replace('/video/upload/', `/video/upload/${CLOUDINARY_VIDEO}/`) : url(`${src}.mp4`)

/** Single image of ~`w` px for small previews (resource cards). */
export function thumbnailUrl(src, w = 960) {
  const cloud = CLOUDINARY.exec(src)
  if (!cloud) return url(`${src}-960.webp`)
  const [, base, rest] = cloud
  const [lead, path] = splitLeadingTransform(rest)
  return `${base}${lead}f_auto,q_auto,w_${w},c_limit/${path}`
}

export const trackUrl = path => (isRemote(path) ? path : url(path))
