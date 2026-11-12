import { describe, it, expect } from 'vitest'
import { validateInterviews } from './schema'

const base = {
  slug: 'soils-running-out',
  title: 'Why Mediterranean soils are running out of time',
  type: 'video',
  interviewee: { name: 'Dr. Elena Martín', role: 'Soil scientist', institution: 'Universidad de Sevilla' },
  date: '2026-10-14',
  language: 'en',
  cover: { alt: 'Elena Martín in a field near Seville', color: '#a87445' },
  summary: 'A conversation about soil loss.',
  mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
}
const audio = { ...base, slug: 'carbon-farming', type: 'audio', mediaUrl: 'https://cdn.example.org/carbon.mp3' }
const text = {
  ...base, slug: 'field-trip', type: 'text', mediaUrl: undefined,
  transcript: [{ speaker: 'interviewer', text: 'Q?' }, { speaker: 'interviewee', text: 'A.' }],
}

describe('validateInterviews', () => {
  it('accepts valid video, audio and text interviews', () => {
    expect(() => validateInterviews([base, audio, text])).not.toThrow()
  })

  it('accepts a description given as paragraphs', () => {
    expect(() => validateInterviews([{ ...base, description: ['One.', 'Two.'] }])).not.toThrow()
  })

  it.each([
    ['missing cover.alt', [{ ...base, cover: { color: '#000' } }], 'cover.alt is required'],
    ['duplicate slug', [base, { ...base }], 'duplicate slug'],
    ['non-ISO date', [{ ...base, date: '14/10/2026' }], 'date must be YYYY-MM-DD'],
    ['unknown type', [{ ...base, type: 'podcast' }], 'type must be video, audio or text'],
    ['non-YouTube video', [{ ...base, mediaUrl: 'https://vimeo.com/1' }], 'mediaUrl must be a YouTube link'],
    ['text without transcript', [{ ...text, transcript: undefined }], 'transcript is required for text'],
    ['bad slug', [{ ...base, slug: 'Hello World' }], 'slug must be kebab-case'],
    ['description as one string', [{ ...base, description: 'Not a list.' }], 'description must be a list of paragraphs'],
  ])('rejects %s', (_, list, message) => {
    expect(() => validateInterviews(list)).toThrow(message)
  })

  it('names the offending interview in the message', () => {
    expect(() => validateInterviews([{ ...base, cover: { color: '#000' } }])).toThrow('interview "soils-running-out"')
  })
})
