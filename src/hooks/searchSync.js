/**
 * Should the search input follow ?q= from the URL? Only when the user isn't
 * mid-typing and the URL says something different from what the input holds.
 * The URL stores the trimmed query, so "soil " (trailing space, about to type
 * the next word) must not be overwritten by the "soil" we just wrote.
 */
export function shouldFollowUrl({ urlQ, localQ, pending }) {
  return !pending && urlQ !== localQ.trim()
}
