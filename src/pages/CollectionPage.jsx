import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Footer from '../components/layout/Footer'
import Breadcrumbs from '../components/collections/Breadcrumbs'
import SkyBand from '../components/collections/SkyBand'
import NotFoundPanel from '../components/collections/NotFoundPanel'
import CoverHeader from '../components/collections/CoverHeader'
import DayCard from '../components/collections/DayCard'
import { MetaChips } from '../components/collections/CollectionCard'
import { collectionCover, collectionStats, formatDates, getCollection, layoutIds } from '../data/collections'
import { COPY } from '../data/collections/copy'
import { RESOURCES_PATH } from '../utils/collectionRoutes'
import { isMediaConfigured } from '../utils/media'
import { AFTER_MORPH, fadeRise, revealOnce, staggerChildren } from '../utils/motion'
import usePageTitle from '../utils/usePageTitle'

const container = 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12'

export default function CollectionPage() {
  const { collectionSlug } = useParams()
  const reduce = useReducedMotion()
  const [daysInitial] = useState(() => revealOnce(`days-${collectionSlug}`))
  const collection = isMediaConfigured ? getCollection(collectionSlug) : null
  usePageTitle(collection?.title ?? COPY.collection.notFoundTitle)

  if (!collection) {
    return (
      <div className={container}>
        <NotFoundPanel
          title={COPY.collection.notFoundTitle}
          body={COPY.collection.notFoundBody}
          cta={COPY.collection.notFoundCta}
          to={RESOURCES_PATH}
        />
      </div>
    )
  }

  const stats = collectionStats(collection)
  const subtitle = [collection.place, formatDates(collection.dates)].filter(Boolean).join(' · ')

  return (
    <div className="min-h-screen bg-white">
      <SkyBand>
        <div className={`${container} pt-6 sm:pt-8`}>
          <motion.div variants={fadeRise(reduce, AFTER_MORPH)} initial="hidden" animate="show">
            <Breadcrumbs items={[{ label: COPY.breadcrumbs.root, to: RESOURCES_PATH }, { label: collection.title }]} />
          </motion.div>
          <div className="mt-5">
            <CoverHeader
              layoutId={layoutIds.cover(collection.slug)}
              imageLayoutId={layoutIds.coverImage(collection.slug)}
              media={collectionCover(collection)}
              eyebrow={COPY.section.title}
              title={collection.title}
              subtitle={subtitle}
              aspect="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[12/5]"
            >
              <MetaChips stats={stats} />
            </CoverHeader>
          </div>
        </div>
      </SkyBand>

      <section className={`${container} pt-10 sm:pt-12`}>
        <motion.div
          variants={fadeRise(reduce, AFTER_MORPH)} initial="hidden" animate="show"
          className="max-w-3xl"
        >
          <p className="text-[19px] leading-relaxed text-gray-700">{collection.description}</p>
          {collection.partner && (
            <Link
              to={`/partners/${collection.partner.slug}`}
              className="group mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-md text-[16px] font-semibold text-orange-700 hover:text-orange-800
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
            >
              {COPY.collection.hostedBy(collection.partner.name)}
              <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-[var(--motion-base)] pointer-fine:group-hover:translate-x-0.5" />
            </Link>
          )}
        </motion.div>
      </section>

      <section aria-labelledby="days-heading" className={`${container} pt-10 pb-20`}>
        <h2 id="days-heading" className="font-headline text-[28px] font-bold tracking-[-0.02em] text-gray-900">
          {COPY.collection.daysHeading}
        </h2>
        <motion.ul
          variants={staggerChildren(reduce, AFTER_MORPH + 0.06)} initial={daysInitial} animate="show"
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {collection.days.map(day => <DayCard key={day.slug} collection={collection} day={day} returning={daysInitial === false} />)}
        </motion.ul>
      </section>

      <Footer />
    </div>
  )
}
