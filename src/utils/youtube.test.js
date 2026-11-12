import { describe, it, expect } from 'vitest'
import { parseYouTubeId, youtubeThumb, youtubeEmbedUrl } from './youtube'

describe('parseYouTubeId', () => {
  it.each([
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s',
    'https://youtu.be/dQw4w9WgXcQ?si=abc',
    'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
  ])('reads the id from %s', url => {
    expect(parseYouTubeId(url)).toBe('dQw4w9WgXcQ')
  })

  it.each([
    'https://cdn.example.org/a.mp3',
    '',
    undefined,
    'https://youtube.com/watch?v=short',
  ])('returns null for %s', url => {
    expect(parseYouTubeId(url)).toBeNull()
  })
})

it('youtubeThumb builds i.ytimg.com URLs', () => {
  expect(youtubeThumb('x', 'hq')).toEqual({
    webp: 'https://i.ytimg.com/vi_webp/x/hqdefault.webp',
    jpg: 'https://i.ytimg.com/vi/x/hqdefault.jpg',
  })
})

it('youtubeEmbedUrl uses the privacy-enhanced host', () => {
  expect(youtubeEmbedUrl('x')).toBe('https://www.youtube-nocookie.com/embed/x?autoplay=1&rel=0')
})
