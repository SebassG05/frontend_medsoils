/**
 * Field trip: Visit to Cáceres.
 *
 * PENDING: dates and days. Until the photos are uploaded the card shows no
 * count chips.
 * Follow ./adiyaman.js for the shape of `cover`, `featured` and `days`.
 */
import { cloudPhoto as photo } from './media.js'

const IMG = 'https://res.cloudinary.com/dktr2wcto/image/upload'

const caceres = {
  slug: 'caceres',
  title: 'Visit to Cáceres',
  place: 'Cáceres, Spain',
  // PENDING: set when the visit dates are confirmed, e.g. { start: '2026-12-01', end: '2026-12-04' }.
  dates: null,
  // PENDING: confirm wording with the team.
  description:
    'Photos and videos from the MEDSOILS Challenge visit to Cáceres, in Extremadura, Spain.',
  partner: { name: 'Universidad de Extremadura', slug: 'universidad-extremadura' },
  // Cover for the Field trips card and the collection header.
  cover: {
    ...photo(`${IMG}/v1794489364/que-ver-caceres-1_oxjslq.webp`, 800, 531, '#8f6e5d',
      'Rooftops, stone towers and the medieval walls of the old town of Cáceres in warm evening light'),
    id: 'cover',
    focus: { x: 0.55, y: 0.5 }, // the wall tower in the middle, so narrow crops keep it
  },
  featured: [],
  days: [],
}

export default caceres
