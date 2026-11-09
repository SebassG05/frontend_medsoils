import { motion, useReducedMotion } from 'framer-motion'
import CollectionCard from './CollectionCard'
import { COLLECTIONS } from '../../data/collections'
import { COPY } from '../../data/collections/copy'
import { isMediaConfigured } from '../../utils/media'
import { fadeRise, staggerChildren } from '../../utils/motion'

/** "Field trips" block shown above the resource filters on /resources. */
export default function CollectionsSection() {
  const reduce = useReducedMotion()
  if (!isMediaConfigured || COLLECTIONS.length === 0) return null

  return (
    <section aria-labelledby="field-trips-heading" className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-4">
      <motion.div variants={fadeRise(reduce)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
        <h2 id="field-trips-heading" className="font-headline text-[28px] sm:text-[32px] font-bold tracking-[-0.02em] text-gray-900">
          {COPY.section.title}
        </h2>
        <p className="mt-1 text-[17px] text-gray-600">{COPY.section.intro}</p>
      </motion.div>

      <motion.ul
        variants={staggerChildren(reduce)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {COLLECTIONS.map(c => <CollectionCard key={c.slug} collection={c} />)}
      </motion.ul>
    </section>
  )
}
