import { parseYouTubeId } from '../../utils/youtube'

/**
 * @typedef {'video' | 'audio' | 'text'} InterviewType
 *
 * @typedef {object} Person
 * @property {string} name
 * @property {string} role
 * @property {string} institution
 * @property {string} [country]
 * @property {{ src: string, alt: string }} [photo]   Without a photo the initials are shown.
 *
 * @typedef {object} Cover
 * @property {string} [src]     Cloudinary URL or self-hosted path (see utils/media.js). Omit for a video to use the YouTube thumbnail.
 * @property {string} alt
 * @property {string} color     Dominant colour, shown while the image loads.
 * @property {number} [width]
 * @property {number} [height]
 *
 * @typedef {object} Turn
 * @property {'interviewer' | 'interviewee'} speaker
 * @property {string} text
 *
 * @typedef {object} Interview
 * @property {string} slug                URL: /dissemination/<slug> (kebab-case, unique)
 * @property {string} title
 * @property {InterviewType} type
 * @property {Person} interviewee
 * @property {string} date                YYYY-MM-DD
 * @property {number} [duration]          Seconds. For text, reading time is computed from the transcript.
 * @property {string} language            ISO 639-1, e.g. 'en', 'es', 'tr'
 * @property {Cover} cover
 * @property {string} summary             Used for the card, meta description and sharing.
 * @property {string} [quote]
 * @property {string} [mediaUrl]          Video: YouTube link. Audio: YouTube link or direct audio file URL.
 * @property {{ src: string, srclang: string, label: string }[]} [captions]  Only for self-hosted audio.
 * @property {Turn[]} [transcript]        Required for text interviews.
 * @property {string[]} [tags]
 * @property {boolean} [featured]
 */

const TYPES = ['video', 'audio', 'text']
const SPEAKERS = ['interviewer', 'interviewee']
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const LANG = /^[a-z]{2,3}$/
const isText = v => typeof v === 'string' && v.trim().length > 0
const isUrl = v => { try { return /^https?:$/.test(new URL(v).protocol) } catch { return false } }

/** Problems with one interview, as short messages ('' list when valid). */
function problemsOf(it) {
  const p = []
  if (!isText(it.slug) || !KEBAB.test(it.slug)) p.push('slug must be kebab-case')
  if (!isText(it.title)) p.push('title is required')
  if (!TYPES.includes(it.type)) p.push('type must be video, audio or text')
  const who = it.interviewee || {}
  for (const k of ['name', 'role', 'institution']) if (!isText(who[k])) p.push(`interviewee.${k} is required`)
  if (who.photo && (!isText(who.photo.src) || !isText(who.photo.alt))) p.push('interviewee.photo needs src and alt')
  if (!ISO_DATE.test(it.date ?? '') || Number.isNaN(Date.parse(it.date))) p.push('date must be YYYY-MM-DD')
  if (it.duration != null && !(Number.isFinite(it.duration) && it.duration > 0)) p.push('duration must be a positive number of seconds')
  if (!LANG.test(it.language ?? '')) p.push('language must be an ISO 639-1 code like "en"')
  if (!it.cover || !isText(it.cover.alt)) p.push('cover.alt is required')
  if (!it.cover || !isText(it.cover.color)) p.push('cover.color is required')
  if (!isText(it.summary)) p.push('summary is required')
  if (it.type === 'video' && !parseYouTubeId(it.mediaUrl)) p.push('mediaUrl must be a YouTube link')
  if (it.type === 'audio' && !parseYouTubeId(it.mediaUrl) && !isUrl(it.mediaUrl)) p.push('mediaUrl must be a YouTube link or an audio file URL')
  if (it.type === 'text' && !(Array.isArray(it.transcript) && it.transcript.length)) p.push('transcript is required for text')
  if (it.transcript != null && !(Array.isArray(it.transcript) && it.transcript.every(t => SPEAKERS.includes(t?.speaker) && isText(t?.text)))) {
    p.push('transcript turns need speaker ("interviewer" | "interviewee") and text')
  }
  if (it.tags != null && !(Array.isArray(it.tags) && it.tags.every(isText))) p.push('tags must be a list of strings')
  if (it.featured != null && typeof it.featured !== 'boolean') p.push('featured must be true or false')
  return p
}

/**
 * Throws on the first invalid interview so a badly filled entry fails in
 * development. Only called under import.meta.env.DEV (see index.js).
 * @param {Interview[]} list
 */
export function validateInterviews(list) {
  const seen = new Set()
  list.forEach((it, i) => {
    const name = isText(it?.slug) ? it.slug : `#${i + 1}`
    const problems = problemsOf(it || {})
    if (seen.has(it?.slug)) problems.unshift('duplicate slug')
    seen.add(it?.slug)
    if (problems.length) throw new Error(`interview "${name}": ${problems.join('; ')}`)
  })
}
