/** FICTIONAL — 50 interviews (dev only): ?demo=interviews&n=50. The 12-item set, repeated with unique slugs and dates. */
import twelve from './interviews-12.js'

const day = i => new Date(Date.UTC(2026, 4, 1) - i * 86400000 * 3).toISOString().slice(0, 10)

export default Array.from({ length: 50 }, (_, i) => {
  const base = twelve[i % twelve.length]
  return { ...base, slug: `${base.slug}-${i + 1}`, date: i < 12 ? base.date : day(i), featured: i === 0 }
})
