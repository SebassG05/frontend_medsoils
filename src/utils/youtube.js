/**
 * YouTube helpers for interviews. Interviews are hosted as unlisted YouTube
 * videos; the page shows a thumbnail facade and only loads the player
 * (privacy-enhanced youtube-nocookie.com) after the visitor clicks play.
 */

const ID = /^[A-Za-z0-9_-]{11}$/
const HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'])

/** Video id from any common YouTube link (watch, youtu.be, shorts, embed, live), or null. */
export function parseYouTubeId(url) {
  if (!url) return null
  let u
  try { u = new URL(url) } catch { return null }
  let id = null
  if (u.hostname === 'youtu.be') id = u.pathname.split('/')[1]
  else if (HOSTS.has(u.hostname)) {
    const [first, second] = u.pathname.split('/').filter(Boolean)
    id = first === 'watch' ? u.searchParams.get('v') : ['embed', 'shorts', 'live'].includes(first) ? second : null
  }
  return id && ID.test(id) ? id : null
}

/** Thumbnail URLs. 'hq' (480×360) always exists; 'maxres' (1280×720) may not. */
export function youtubeThumb(id, size = 'hq') {
  return {
    webp: `https://i.ytimg.com/vi_webp/${id}/${size}default.webp`,
    jpg: `https://i.ytimg.com/vi/${id}/${size}default.jpg`,
  }
}

export function youtubeEmbedUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
}
