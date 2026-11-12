import { FileText, Headphones, Play } from 'lucide-react'
import { formatDuration, formatMinutes, readingMinutes } from '../../data/dissemination'
import { COPY } from '../../data/dissemination/copy'

export const TYPE_ICON = { video: Play, audio: Headphones, text: FileText }

/** '12:40' for video/audio, '6 min read' for text, or null when unknown. */
export function durationLabel(interview) {
  if (interview.type === 'text') return interview.transcript?.length ? COPY.card.readTime(readingMinutes(interview.transcript)) : null
  return interview.duration ? formatDuration(interview.duration) : null
}

/** For meta lines next to a date: '13 min' / '6 min read' (the cover badge keeps '12:40'). */
export function lengthLabel(interview) {
  if (interview.type === 'text') return durationLabel(interview)
  return interview.duration ? formatMinutes(interview.duration) : null
}

let names
/** 'tr' → 'Turkish'. Falls back to the code if the browser has no data. */
export function languageName(code) {
  try {
    names ??= new Intl.DisplayNames(['en'], { type: 'language' })
    return names.of(code) ?? code
  } catch {
    return code
  }
}

/** 'Soil scientist · Universidad de Sevilla' */
export const roleLine = person => [person.role, person.institution].filter(Boolean).join(' · ')
