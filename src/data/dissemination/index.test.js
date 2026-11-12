process.env.TZ = 'America/Bogota'

import { describe, it, expect } from 'vitest'
import {
  loadInterviews, parseFilters, filterInterviews, pickFeatured, countByType, availableLanguages,
  getBySlug, related, formatDate, formatDuration, readingMinutes, layoutIds, buildInterviewMeta,
} from './index'

const person = (name, institution, role = 'Researcher') => ({ name, role, institution })
const item = (slug, over = {}) => ({
  slug, title: slug, type: 'video', date: '2026-01-01', language: 'en', summary: '', tags: [],
  cover: { alt: slug, color: '#000' }, interviewee: person('Someone', 'Somewhere'), ...over,
})
const LIST = [
  item('soils', { title: 'Why Mediterranean soils are running out of time', date: '2026-10-14', tags: ['erosion'], interviewee: person('Dr. Elena Martín', 'Universidad de Sevilla') }),
  item('carbon', { title: 'Carbon farming, explained from the field', type: 'audio', date: '2026-10-02', language: 'tr', interviewee: person('Ahmet Yılmaz', 'Adıyaman University') }),
  item('trip', { title: 'What students take home from a field trip', type: 'text', date: '2026-09-28', tags: ['erosion'], interviewee: person('Sofia Rossi', 'University of Florence') }),
  item('curriculum', { title: 'Building a soil curriculum across borders', date: '2026-09-05', language: 'es' }),
]

describe('filterInterviews', () => {
  it('ignores accents and case in the query', () => {
    expect(filterInterviews(LIST, { q: 'martin' }).map(i => i.slug)).toEqual(['soils'])
  })
  it('matches the institution', () => {
    expect(filterInterviews(LIST, { q: 'SEVILLA' }).map(i => i.slug)).toEqual(['soils'])
  })
  it('combines query and type', () => {
    expect(filterInterviews(LIST, { q: 'carbon', type: 'audio' }).map(i => i.slug)).toEqual(['carbon'])
    expect(filterInterviews(LIST, { q: 'carbon', type: 'video' })).toEqual([])
  })
  it('returns everything with empty filters', () => {
    expect(filterInterviews(LIST, { q: '', type: null, lang: null })).toHaveLength(4)
  })
  it('ignores a language that no interview has', () => {
    expect(filterInterviews(LIST, { q: '', type: null, lang: 'zz' })).toHaveLength(4)
  })
  it('filters by a known language', () => {
    expect(filterInterviews(LIST, { q: '', type: null, lang: 'es' }).map(i => i.slug)).toEqual(['curriculum'])
  })
})

it('parseFilters drops unknown types and trims the query', () => {
  expect(parseFilters(new URLSearchParams('type=podcast&lang=zz&q=%20soil%20'))).toEqual({ q: 'soil', type: null, lang: 'zz' })
  expect(parseFilters(new URLSearchParams('type=audio'))).toEqual({ q: '', type: 'audio', lang: null })
})

describe('pickFeatured', () => {
  it('prefers the newest featured interview', () => {
    const list = [item('a', { featured: true, date: '2026-01-01' }), item('b', { featured: true, date: '2026-03-01' }), item('c', { date: '2026-05-01' })]
    expect(pickFeatured(list).slug).toBe('b')
  })
  it('falls back to the newest interview', () => {
    expect(pickFeatured(LIST).slug).toBe('soils')
  })
  it('returns null for an empty list', () => {
    expect(pickFeatured([])).toBeNull()
  })
})

it('countByType counts every type', () => {
  expect(countByType(LIST)).toEqual({ all: 4, video: 2, audio: 1, text: 1 })
})

it('availableLanguages lists each language once', () => {
  expect(availableLanguages(LIST).sort()).toEqual(['en', 'es', 'tr'])
})

it('getBySlug returns null for an unknown slug', () => {
  expect(getBySlug(LIST, 'carbon').title).toMatch(/Carbon/)
  expect(getBySlug(LIST, 'nope')).toBeNull()
})

it('related excludes the interview itself and prefers same type or shared tags', () => {
  const r = related(LIST, 'soils')
  expect(r.map(i => i.slug)).not.toContain('soils')
  expect(r).toHaveLength(3)
  expect(r.slice(0, 2).map(i => i.slug).sort()).toEqual(['curriculum', 'trip'])
})

it('formatDate does not shift the day with the visitor timezone', () => {
  expect(formatDate('2026-10-14')).toBe('14 Oct 2026')
})

it('formatDuration', () => {
  expect(formatDuration(760)).toBe('12:40')
  expect(formatDuration(3725)).toBe('1:02:05')
})

it('readingMinutes uses 220 words per minute with a minimum of 1', () => {
  expect(readingMinutes([{ speaker: 'interviewee', text: 'word '.repeat(440) }])).toBe(2)
  expect(readingMinutes([{ speaker: 'interviewee', text: 'hi' }])).toBe(1)
})

it('layoutIds.cover', () => {
  expect(layoutIds.cover('x')).toBe('interview-cover-x')
})

describe('loadInterviews', () => {
  it('loads a fixture with ?demo=interviews&n=4', async () => {
    expect(await loadInterviews(new URLSearchParams('demo=interviews&n=4'))).toHaveLength(4)
  })
  it('defaults to 12 fixtures when n is missing or invalid', async () => {
    expect(await loadInterviews(new URLSearchParams('demo=interviews&n=99'))).toHaveLength(12)
  })
  it('returns the real (empty) list without demo', async () => {
    expect(await loadInterviews(new URLSearchParams(''))).toEqual([])
  })
  it('returns fixtures newest first', async () => {
    const list = await loadInterviews(new URLSearchParams('demo=interviews&n=12'))
    const dates = list.map(i => i.date)
    expect(dates).toEqual([...dates].sort().reverse())
  })
})

describe('buildInterviewMeta', () => {
  const origin = 'https://medsoil-challenge.eu'
  const video = item('soils-running-out', {
    title: 'Why soils run out', summary: 'Soil loss explained.', duration: 760, date: '2026-10-14',
    mediaUrl: 'https://youtu.be/dQw4w9WgXcQ', interviewee: person('Dr. Elena Martín', 'Universidad de Sevilla'),
  })
  const text = item('field-trip', { type: 'text', summary: 'A field trip.', transcript: [{ speaker: 'interviewer', text: 'Q?' }] })

  it('describes a video interview as a VideoObject', () => {
    const meta = buildInterviewMeta(video, { origin })
    expect(meta.type).toBe('video.other')
    expect(meta.url).toBe('https://medsoil-challenge.eu/dissemination/soils-running-out')
    expect(meta.description).toBe('Soil loss explained.')
    expect(meta.image).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg')
    expect(meta.jsonLd['@type']).toBe('VideoObject')
    expect(meta.jsonLd.embedUrl).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')
    expect(meta.jsonLd.duration).toBe('PT12M40S')
    expect(meta.jsonLd.uploadDate).toBe('2026-10-14')
  })

  it('describes a text interview as an Article', () => {
    const meta = buildInterviewMeta(text, { origin, fallbackImage: 'https://x/logo.png' })
    expect(meta.type).toBe('article')
    expect(meta.jsonLd['@type']).toBe('Article')
    expect(meta.image).toBe('https://x/logo.png')
  })

  it('resolves a self-hosted cover against the media base', () => {
    const withCover = { ...text, cover: { ...text.cover, src: 'interviews/trip' } }
    expect(buildInterviewMeta(withCover, { origin, mediaBase: 'https://media.example.org' }).image)
      .toBe('https://media.example.org/interviews/trip-1600.jpg')
  })
})
