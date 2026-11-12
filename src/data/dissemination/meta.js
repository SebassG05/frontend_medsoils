import { parseYouTubeId, youtubeThumb } from '../../utils/youtube.js'

/**
 * Page metadata (title, description, Open Graph, JSON-LD) for an interview.
 * Pure and free of import.meta.env so the build plugin can import it from
 * Node to write a static HTML per interview (see scripts/vite-dissemination-pages.js).
 */

const isRemote = src => /^https?:\/\//.test(src ?? '')

/** 760 → 'PT12M40S' (ISO 8601 duration). */
export function isoDuration(seconds) {
  const s = Math.round(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${r || (!h && !m) ? `${r}S` : ''}`
}

/** Absolute image for sharing: own cover, else the YouTube thumbnail, else the fallback. */
function shareImage(interview, mediaBase, fallbackImage) {
  const src = interview.cover?.src
  if (src) return isRemote(src) ? src : `${mediaBase.replace(/\/$/, '')}/${src}-1600.jpg`
  const youtubeId = parseYouTubeId(interview.mediaUrl)
  if (youtubeId) return youtubeThumb(youtubeId, 'hq').jpg // hq always exists; maxres may not
  return fallbackImage
}

/**
 * @param {import('./schema').Interview} interview
 * @param {{ origin: string, mediaBase?: string, fallbackImage?: string }} options
 */
export function buildInterviewMeta(interview, { origin, mediaBase = '', fallbackImage } = {}) {
  const url = `${origin}/dissemination/${interview.slug}`
  const image = shareImage(interview, mediaBase, fallbackImage)
  const youtubeId = parseYouTubeId(interview.mediaUrl)
  const author = { '@type': 'Person', name: interview.interviewee.name, affiliation: { '@type': 'Organization', name: interview.interviewee.institution } }

  const jsonLd = interview.type === 'video' && youtubeId
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: interview.title,
        description: interview.summary,
        thumbnailUrl: [image],
        uploadDate: interview.date,
        ...(interview.duration ? { duration: isoDuration(interview.duration) } : {}),
        embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}`,
        inLanguage: interview.language,
        url,
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: interview.title,
        description: interview.summary,
        ...(image ? { image: [image] } : {}),
        datePublished: interview.date,
        author,
        inLanguage: interview.language,
        publisher: { '@type': 'Organization', name: 'MEDSOILS Challenge' },
        mainEntityOfPage: url,
      }

  return {
    title: interview.title,
    description: interview.summary,
    image,
    url,
    type: interview.type === 'video' ? 'video.other' : 'article',
    jsonLd,
  }
}

/** Share image when an interview has neither a cover nor a YouTube thumbnail (the site logo). */
export const SHARE_FALLBACK_IMAGE = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1771245130/Medsoil_Challenge_lrkqnt.png' // PNG: link previews don't all accept WebP

/** Metadata for the /dissemination listing. */
export function buildListingMeta(copy, { origin }) {
  return {
    title: copy.meta.title,
    description: copy.meta.description,
    image: SHARE_FALLBACK_IMAGE,
    url: `${origin}/dissemination`,
    type: 'website',
    jsonLd: null,
  }
}
