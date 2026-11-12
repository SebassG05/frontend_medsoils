import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseFilters } from '../data/dissemination'

const SEARCH_DEBOUNCE_MS = 250

/**
 * Search and filters for /dissemination, kept in the URL (?q=&type=&lang=).
 * Typing filters immediately and writes `q` to the URL after a pause,
 * replacing the history entry; chips and language push one, so Back undoes
 * a filter. Other params (demo, n) are preserved.
 */
export default function useInterviewFilters() {
  const [params, setParams] = useSearchParams()
  const fromUrl = parseFilters(params)
  const [query, setQueryState] = useState(fromUrl.q)
  const pending = useRef(null)

  // Back/Forward changes ?q= — follow it unless the user is mid-typing.
  useEffect(() => {
    if (!pending.current) setQueryState(fromUrl.q)
  }, [fromUrl.q])

  useEffect(() => () => clearTimeout(pending.current), [])

  const update = useCallback((changes, replace) => {
    setParams(prev => {
      const next = new URLSearchParams(prev)
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      return next
    }, { replace, preventScrollReset: true })
  }, [setParams])

  const setQuery = useCallback(q => {
    setQueryState(q)
    clearTimeout(pending.current)
    pending.current = setTimeout(() => {
      pending.current = null
      update({ q: q.trim() }, true)
    }, SEARCH_DEBOUNCE_MS)
  }, [update])

  const setType = useCallback(type => update({ type }, false), [update])
  const setLang = useCallback(lang => update({ lang }, false), [update])
  const clear = useCallback(() => {
    clearTimeout(pending.current)
    pending.current = null
    setQueryState('')
    update({ q: null, type: null, lang: null }, false)
  }, [update])

  return { filters: { ...fromUrl, q: query }, setQuery, setType, setLang, clear }
}
