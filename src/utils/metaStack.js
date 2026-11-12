/**
 * Which page owns the document head. Pages push their metadata on mount and
 * remove it on unmount; the newest remaining entry is applied.
 *
 * A stack (not "restore the previous value on unmount") because with
 * AnimatePresence the leaving page unmounts AFTER the new one mounted: a
 * naive restore would put the old page's values back over the new page's.
 *
 * @param {(page: object | null) => void} apply  Called with the page to show, or null for site defaults.
 */
export function createMetaStack(apply) {
  const entries = []
  return {
    push(page) {
      const entry = { page }
      entries.push(entry)
      apply(page)
      return () => {
        const i = entries.indexOf(entry)
        if (i === -1) return
        const wasTop = i === entries.length - 1
        entries.splice(i, 1)
        if (wasTop) apply(entries.at(-1)?.page ?? null)
      }
    },
  }
}
