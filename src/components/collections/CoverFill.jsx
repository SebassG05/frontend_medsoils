import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import MediaImage from './MediaImage'
import { layoutTransition } from '../../utils/motion'

/**
 * object-fit: cover, done with layout so it can be shared between screens.
 *
 * The image box always keeps the media's own aspect ratio (it overflows the
 * clipping parent instead of being squeezed). When two screens render a
 * CoverFill with the same `layoutId`, Motion only has to translate and scale
 * it uniformly, so the photo never distorts while its clipping box (card →
 * header) changes shape around it.
 */
export default function CoverFill({ media, layoutId, sizes, priority, imgClassName }) {
  const ref = useRef(null)
  const [box, setBox] = useState(null)
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    const el = ref.current
    const measure = () => {
      // Layout size, not getBoundingClientRect(): during a shared-element morph the
      // parent is transformed, and the transformed size would be the card's.
      const cw = el.offsetWidth
      const ch = el.offsetHeight
      if (!cw || !ch) return
      const ar = media.width / media.height
      const [w, h] = cw / ch > ar ? [cw, cw / ar] : [ch * ar, ch]
      setBox(prev => (prev && Math.abs(prev.w - w) < 0.5 && Math.abs(prev.h - h) < 0.5 ? prev : { w, h, x: (cw - w) / 2, y: (ch - h) / 2 }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [media.width, media.height])

  return (
    <div ref={ref} className="absolute inset-0" style={{ backgroundColor: media.color }}>
      {box && (
        <motion.div
          layoutId={layoutId}
          layoutCrossfade={false}
          transition={layoutTransition(reduce)}
          className="absolute"
          style={{ width: box.w, height: box.h, left: box.x, top: box.y }}
        >
          <MediaImage media={media} alt="" sizes={sizes} priority={priority} className="h-full w-full" imgClassName={imgClassName} />
        </motion.div>
      )}
    </div>
  )
}
