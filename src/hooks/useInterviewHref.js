import { useSearchParams } from 'react-router-dom'
import { interviewPath } from '../utils/disseminationRoutes'

/**
 * Link to an interview. In development, keeps ?demo=interviews&n= so the
 * detail page loads the same fixtures (otherwise it would say "not found").
 */
export default function useInterviewHref(slug) {
  const [params] = useSearchParams()
  const path = interviewPath(slug)
  if (!import.meta.env.DEV || params.get('demo') !== 'interviews') return path
  const keep = new URLSearchParams({ demo: 'interviews' })
  if (params.get('n')) keep.set('n', params.get('n'))
  return `${path}?${keep}`
}
