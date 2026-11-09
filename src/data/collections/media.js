import { cloudinaryPoster } from '../../utils/media.js'

/**
 * One-line helpers for collection media hosted on Cloudinary.
 *
 *   cloudPhoto(url, width, height, color, alt, extra?)
 *   cloudVideo(url, width, height, color, durationSeconds, alt, extra?)
 *
 * width/height: the size as displayed (after rotation). They reserve space
 *   and drive the justified grid; for videos use the delivered size
 *   (1280×720 landscape, 720×1280 portrait) so the viewer doesn't upscale.
 * color: dominant colour shown while the image loads.
 * alt: what the photo shows (for a video: what the clip shows).
 * extra: { caption, focus: { x, y }, tracks: [{ src, srclang, label }] }
 *
 * The id is the short suffix Cloudinary adds to the file name (…_akyoz3 → "akyoz3").
 */

const idFrom = url => url.split('/').pop().replace(/\.\w+$/, '').split('_').pop()

export const cloudPhoto = (src, width, height, color, alt, extra = {}) => ({
  id: idFrom(src), type: 'photo', src, width, height, color, alt, caption: '', ...extra,
})

export const cloudVideo = (src, width, height, color, duration, alt, extra = {}) => ({
  id: idFrom(src), type: 'video', src, poster: cloudinaryPoster(src), width, height, color, duration, alt,
  caption: '', tracks: [], ...extra,
})
