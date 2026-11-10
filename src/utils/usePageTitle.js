import { useEffect } from 'react'

/** Sets document.title for the page and restores the previous one on leave. */
export default function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = `${title} · MEDSOILS Challenge`
    return () => { document.title = previous }
  }, [title])
}
