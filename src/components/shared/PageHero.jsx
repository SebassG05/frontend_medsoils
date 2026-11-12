import { motion, useReducedMotion } from 'framer-motion'
import { fadeRise } from '../../utils/motion'
import Wave from './Wave'

export const SKY_GRADIENT = 'linear-gradient(135deg, #dcf6f8 0%, #edfcfd 50%, #dcf6f8 100%)'

/**
 * Sky-coloured page header shared by Resources and Dissemination:
 * eyebrow, h1 with one highlighted word, intro, optional slot (search) and
 * the wave into the white content. Elements enter one after another.
 */
export default function PageHero({ eyebrow, highlight, title, intro, children }) {
  const reduce = useReducedMotion()
  const step = i => ({ variants: fadeRise(reduce, i * 0.06), initial: 'hidden', animate: 'show' })

  return (
    <section className="relative pt-24 pb-32" style={{ background: SKY_GRADIENT, overflow: 'clip' }}>
      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <motion.p {...step(0)} className="text-sm font-semibold tracking-widest uppercase text-orange-700 mb-6">
          {eyebrow}
        </motion.p>
        <motion.h1 {...step(1)} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight text-balance mb-7">
          <span className="text-orange-600">{highlight}</span> {title}
        </motion.h1>
        <motion.p {...step(2)} className="max-w-2xl mx-auto text-xl text-gray-600 text-pretty mb-12">
          {intro}
        </motion.p>
        {children && <motion.div {...step(3)} className="max-w-xl mx-auto">{children}</motion.div>}
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <Wave className="h-20" />
      </div>
    </section>
  )
}
