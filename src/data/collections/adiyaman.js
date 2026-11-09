/**
 * Field trip: Visit to Adıyaman.
 *
 * To add a day, append an object to `days` (see the README note at the bottom
 * of this file). Counts on the cards are derived from `media`, never typed.
 *
 * Media fields
 *   id       unique within its day
 *   type     'photo' | 'video'
 *   src      path under VITE_MEDIA_BASE_URL, without size/extension (see utils/media.js)
 *   width, height   intrinsic pixel size — reserves space, drives the justified grid
 *   color    dominant colour shown while the image loads
 *   alt      what the photo shows (required for photos; for videos it describes the poster)
 *   caption  optional text under the item in the viewer
 *   duration seconds (videos)
 *   tracks   optional subtitles: [{ src: 'adiyaman/dia-1/video-01.en.vtt', srclang: 'en', label: 'English' }]
 *
 * PLACEHOLDERS: the media below are generated dev placeholders. Replace each
 * entry with the real file, its real size, colour, alt text and caption.
 */

/** Helpers bound to one day's folder, so each entry stays a one-liner. */
const mediaFor = folder => ({
  photo: (id, width, height, color, extra = {}) => ({
    id, type: 'photo', src: `${folder}/${id}`, width, height, color,
    alt: `Placeholder photo ${id.replace('p', '')}`, caption: '', ...extra,
  }),
  video: (id, width, height, color, duration, extra = {}) => ({
    id, type: 'video', src: `${folder}/${id}`, poster: `${folder}/${id}-poster`, width, height, color, duration,
    alt: `Placeholder video ${id.replace('v', '')}`, caption: '', tracks: [], ...extra,
  }),
})

const { photo, video } = mediaFor('adiyaman/dia-1')

const adiyaman = {
  slug: 'adiyaman',
  title: 'Visit to Adıyaman',
  place: 'Adıyaman, Türkiye',
  // PENDING: real trip dates, e.g. { start: '2026-10-12', end: '2026-10-15' }
  dates: null,
  // PENDING: confirm wording with the team.
  description:
    'Photos and videos from the MEDSOILS Challenge visit to Adıyaman, in south-eastern Türkiye.',
  partner: { name: 'Adiyaman University', slug: 'adiyaman' },
  cover: { day: 'dia-1', media: 'p01' },

  days: [
    {
      slug: 'dia-1',
      number: 1,
      title: 'Photos & videos',
      date: null, // PENDING: 'YYYY-MM-DD'
      mosaic: ['p01', 'p04', 'v01', 'p09'],
      media: [
        photo('p01', 1600, 1067, '#8a562f', { caption: 'Placeholder caption for the opening photo.' }),
        photo('p02', 1067, 1600, '#6c3a1f'),
        photo('p03', 1600, 1067, '#a87445'),
        photo('p04', 1600, 1200, '#5b7f3a'),
        video('v01', 1920, 1080, '#3f5f6b', 42, {
          caption: 'Placeholder video caption.',
          tracks: [{ src: 'adiyaman/dia-1/v01.en.vtt', srclang: 'en', label: 'English' }],
        }),
        photo('p05', 1600, 900, '#b08a5a'),
        photo('p06', 1067, 1600, '#7a4a2a'),
        photo('p07', 1600, 1600, '#94683f'),
        photo('p08', 1600, 1067, '#6dae30'),
        photo('p09', 1600, 1067, '#c08552'),
        photo('p10', 1200, 1600, '#4f6d3a'),
        photo('p11', 1600, 1067, '#8a6a4a'),
        video('v02', 1080, 1920, '#5a4636', 27),
        photo('p12', 1600, 1200, '#a0522d'),
        photo('p13', 1600, 1067, '#6b8e23'),
        photo('p14', 1067, 1600, '#8b5a2b'),
        photo('p15', 1600, 900, '#9c7a54'),
        photo('p16', 1600, 1067, '#704214'),
        photo('p17', 1600, 1600, '#7f8f4f'),
        photo('p18', 1600, 1067, '#b5835a'),
        video('v03', 1920, 1080, '#4a5a3a', 95),
        photo('p19', 1067, 1600, '#6c3a1f'),
        photo('p20', 1600, 1067, '#a87445'),
        photo('p21', 1600, 1200, '#557a3b'),
        photo('p22', 1600, 1067, '#8a562f'),
        photo('p23', 1600, 900, '#9b6b43'),
        photo('p24', 1600, 1067, '#6e8b3d'),
      ],
    },
    /*
     * Adding Day 2 (with `const d2 = mediaFor('adiyaman/dia-2')` above):
     * {
     *   slug: 'dia-2', number: 2, title: 'Photos & videos', date: null,
     *   mosaic: ['p01', 'p02', 'p03', 'p04'],   // ids from this day's media; optional
     *   media: [ d2.photo('p01', 1600, 1067, '#8a562f', { alt: '…' }), d2.video(...) ],
     * },
     */
  ],
}

export default adiyaman
