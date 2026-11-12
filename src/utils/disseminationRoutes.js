/** URL helpers for the Dissemination (interviews) section. */

export const DISSEMINATION_PATH = '/dissemination'

export const interviewPath = slug => `${DISSEMINATION_PATH}/${slug}`

/**
 * True for /dissemination and /dissemination/:slug (trailing slash allowed),
 * i.e. every page rendered by DisseminationSection. Used so the global
 * scroll-to-top leaves scroll handling to that section.
 */
export function isDisseminationSectionPath(pathname) {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  return parts[0] === 'dissemination' && parts.length <= 2
}
