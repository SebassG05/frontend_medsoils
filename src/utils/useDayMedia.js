import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Media for one day plus a load status.
 *
 * Today the data is a local module, so it is always 'ready'. The status and
 * retry exist so the gallery already handles loading/error once media come
 * from a remote source (hosting is still pending).
 *
 * Development only: ?state=loading|empty|error forces a state for review.
 */
export default function useDayMedia(day) {
  const [params] = useSearchParams()
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt(a => a + 1), [])

  const forced = import.meta.env.DEV && attempt === 0 ? params.get('state') : null
  if (forced === 'loading') return { status: 'loading', media: [], retry }
  if (forced === 'error') return { status: 'error', media: [], retry }
  if (forced === 'empty') return { status: 'ready', media: [], retry }
  return { status: 'ready', media: day?.media ?? [], retry }
}
