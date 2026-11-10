import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { justifiedRows, rowSettings } from '../../utils/justifiedRows'
import { fadeRise } from '../../utils/motion'

/**
 * Measures its own width before paint (no layout shift), lays items out in
 * justified rows and reveals each row as it scrolls into view.
 * `renderItem(item, { width, height })` renders one cell.
 */
export default function JustifiedGrid({ items, renderItem, label, reveal = true, ...rest }) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const settings = rowSettings(width)
  const rows = useMemo(() => justifiedRows(items, width, settings), [items, width, settings.targetHeight, settings.gap, settings.maxPerRow]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} role="list" aria-label={label} className="flex flex-col" style={{ gap: settings.gap }} {...rest}>
      {rows.map((row, i) => (
        <motion.div
          key={row.items.map(c => c.item.id).join('|')}
          role="none"
          className="flex"
          style={{ gap: settings.gap, height: row.height }}
          variants={fadeRise(reduce)}
          initial={reveal ? 'hidden' : false}
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          custom={i}
        >
          {row.items.map(({ item, width: w }) => (
            <div key={item.id} role="listitem" className="shrink-0" style={{ width: w, height: row.height }}>
              {renderItem(item, { width: w, height: row.height })}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}
