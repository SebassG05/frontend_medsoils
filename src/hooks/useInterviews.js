import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadInterviews } from '../data/dissemination'

/**
 * Loaded lists by source ('' = real data, 'demo:12' = fixtures). Once a list
 * is loaded, the next page renders it on its first frame: no skeleton flash,
 * and the card cover has a target to morph into on the detail page.
 */
const cache = new Map()

/**
 * Interviews for the Dissemination pages. Data is local, but loading is async
 * (dev fixtures are a dynamic import), so pages get loading/error states.
 * Only `demo` and `n` trigger a reload; search/filter params do not.
 */
export default function useInterviews() {
  const [params] = useSearchParams()
  const demo = params.get('demo')
  const n = params.get('n')
  const key = demo ? `${demo}:${n ?? ''}` : ''
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState(() =>
    cache.has(key) ? { status: 'ready', interviews: cache.get(key) } : { status: 'loading', interviews: [] })

  useEffect(() => {
    if (cache.has(key)) {
      setState(s => (s.interviews === cache.get(key) ? s : { status: 'ready', interviews: cache.get(key) }))
      return
    }
    let alive = true
    setState(s => (s.status === 'loading' ? s : { status: 'loading', interviews: [] }))
    const query = new URLSearchParams()
    if (demo) query.set('demo', demo)
    if (n) query.set('n', n)
    loadInterviews(query).then(
      interviews => {
        cache.set(key, interviews)
        if (alive) setState({ status: 'ready', interviews })
      },
      error => {
        console.error(error)
        if (alive) setState({ status: 'error', interviews: [] })
      },
    )
    return () => { alive = false }
  }, [key, demo, n, attempt])

  const retry = useCallback(() => setAttempt(a => a + 1), [])
  return { ...state, retry }
}
