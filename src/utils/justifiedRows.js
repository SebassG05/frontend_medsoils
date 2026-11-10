/**
 * Justified ("Google Photos") rows: every item keeps its aspect ratio, all
 * items in a row share one height, and full rows exactly fill the width.
 *
 * @param {Array<{width:number,height:number}>} items
 * @param {number} width       container width in px
 * @param {{targetHeight:number, gap:number, maxPerRow?:number}} opts
 * @returns {Array<{ items: Array<{ item, width:number }>, height:number }>}
 */
export function justifiedRows(items, width, { targetHeight, gap, maxPerRow = Infinity }) {
  if (!width || !items.length) return []
  const rows = []
  let row = []
  let ratioSum = 0

  const close = (height) => {
    rows.push({ height, items: row.map(item => ({ item, width: (item.width / item.height) * height })) })
    row = []
    ratioSum = 0
  }

  for (const item of items) {
    row.push(item)
    ratioSum += item.width / item.height
    const height = (width - gap * (row.length - 1)) / ratioSum
    if (height <= targetHeight || row.length >= maxPerRow) close(height)
  }
  // Last, incomplete row: keep the target height instead of blowing it up.
  if (row.length) close(Math.min(targetHeight, (width - gap * (row.length - 1)) / ratioSum))
  return rows
}

/** Layout parameters by available width (not by device). */
export function rowSettings(width) {
  if (width < 640) return { targetHeight: 150, gap: 6, maxPerRow: 2 }
  if (width < 1024) return { targetHeight: 220, gap: 8 }
  return { targetHeight: 280, gap: 10 }
}
