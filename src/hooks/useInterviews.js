import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadInterviews } from '../data/dissemination'

/**
 * Interviews for the Dissemination pages. Data is local, but loading is async
 * (dev fixtures are a dynamic import), so pages get loading/error states.
 * Only `demo` and `n` trigger a reload; search/filter params do not.
 */
export default function useInterviews() {
  const [params] = useSearchParams()
  const demo = params.get('demo')
  const n = params.get('n')
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ status: 'loading', interviews: [] })

  useEffect(() => {
    let alive = true
    setState(s => (s.status === 'loading' ? s : { status: 'loading', interviews: [] }))
    const query = new URLSearchParams()
    if (demo) query.set('demo', demo)
    if (n) query.set('n', n)
    loadInterviews(query).then(
      interviews => alive && setState({ status: 'ready', interviews }),
      error => {
        console.error(error)
        if (alive) setState({ status: 'error', interviews: [] })
      },
    )
    return () => { alive = false }
  }, [demo, n, attempt])

  const retry = useCallback(() => setAttempt(a => a + 1), [])
  return { ...state, retry }
}
