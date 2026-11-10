/** URL helpers for the Field trips section under /resources. */

export const RESOURCES_PATH = '/resources'

export const collectionPath = slug => `${RESOURCES_PATH}/${slug}`
export const dayPath = (slug, daySlug) => `${RESOURCES_PATH}/${slug}/${daySlug}`

/**
 * True for /resources, /resources/:collection and /resources/:collection/:day,
 * i.e. every page rendered by ResourcesSection (but not /resources/add/*).
 * Used so the global scroll-to-top leaves scroll handling to that section.
 */
export function isResourcesSectionPath(pathname) {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  return parts[0] === 'resources' && parts.length <= 3 && parts[1] !== 'add'
}
