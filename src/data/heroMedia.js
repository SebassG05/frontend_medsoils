const CLOUDINARY_BASE = 'https://res.cloudinary.com/dktr2wcto'
const HERO_IMAGE_ID = 'v1793785442/WhatsApp_Image_2026-11-03_at_20.10.19_wirtdu.jpg'
const INTRO_VIDEO_ID = 'v1793787699/WhatsApp_Video_2026-11-03_at_21.07.30_qozrk8.mp4'

const HERO_IMAGE_WIDTHS = [640, 828, 1080, 1280, 1600, 2000]

const heroImageUrl = (width) => `${CLOUDINARY_BASE}/image/upload/f_auto,q_auto,w_${width}/${HERO_IMAGE_ID}`

export const heroImage = {
  src: heroImageUrl(1600),
  srcSet: HERO_IMAGE_WIDTHS.map((width) => `${heroImageUrl(width)} ${width}w`).join(', '),
  sizes: '100vw',
  width: 2000,
  height: 1500,
  alt: 'A group of people on a gravel track studying a tall cut of dark soil beneath a grassy hillside',
}

export const introVideo = {
  // q_97 keeps the High profile; q_100 switches to High 4:4:4, which iOS can't decode
  src: `${CLOUDINARY_BASE}/video/upload/ac_none,q_97/${INTRO_VIDEO_ID}`,
  width: 1920,
  height: 1080,
  playbackRate: 1.3,
  // The closing curtain enters at 4.36 s of the clip. On portrait screens it is
  // letterboxed, so the fade to earth has to start before the curtain does.
  portraitFadeAt: 4,
}
