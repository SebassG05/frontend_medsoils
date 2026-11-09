import { useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Footer from '../components/layout/Footer'
import Breadcrumbs from '../components/collections/Breadcrumbs'
import SkyBand from '../components/collections/SkyBand'
import NotFoundPanel from '../components/collections/NotFoundPanel'
import CoverHeader from '../components/collections/CoverHeader'
import MediaGallery from '../components/collections/MediaGallery'
import { dayMosaic, formatDay, getCollection, getDay, layoutIds } from '../data/collections'
import { COPY } from '../data/collections/copy'
import { RESOURCES_PATH, collectionPath } from '../utils/collectionRoutes'
import { isMediaConfigured } from '../utils/media'
import { AFTER_MORPH, fadeRise } from '../utils/motion'
import useDayMedia from '../utils/useDayMedia'
import usePageTitle from '../utils/usePageTitle'

const container = 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12'

export default function CollectionDayPage() {
  const { collectionSlug, daySlug } = useParams()
  const reduce = useReducedMotion()
  const collection = isMediaConfigured ? getCollection(collectionSlug) : null
  const day = getDay(collection, daySlug)
  const { status, media, retry } = useDayMedia(day)
  usePageTitle(day ? `${COPY.day.cardTitle(day.number, day.title)} · ${collection.title}` : COPY.day.notFoundTitle)

  if (!collection || !day) {
    return (
      <div className={container}>
        {collection ? (
          <NotFoundPanel
            title={COPY.day.notFoundTitle}
            body={COPY.day.notFoundBody}
            cta={COPY.day.notFoundCta(collection.title)}
            to={collectionPath(collection.slug)}
          />
        ) : (
          <NotFoundPanel
            title={COPY.collection.notFoundTitle}
            body={COPY.collection.notFoundBody}
            cta={COPY.collection.notFoundCta}
            to={RESOURCES_PATH}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SkyBand>
        <div className={`${container} pt-6 sm:pt-8`}>
          <motion.div variants={fadeRise(reduce, AFTER_MORPH)} initial="hidden" animate="show">
            <Breadcrumbs
              items={[
                { label: COPY.breadcrumbs.root, to: RESOURCES_PATH },
                { label: collection.title, to: collectionPath(collection.slug) },
                { label: COPY.day.label(day.number) },
              ]}
            />
          </motion.div>
          <div className="mt-5">
            <CoverHeader
              layoutId={layoutIds.dayCover(collection.slug, day.slug)}
              imageLayoutId={layoutIds.dayCoverImage(collection.slug, day.slug)}
              media={dayMosaic(day)[0]}
              eyebrow={collection.title}
              title={COPY.day.cardTitle(day.number, day.title)}
              subtitle={formatDay(day.date)}
              aspect="aspect-[4/3] sm:aspect-[21/9] lg:aspect-[3/1]"
            />
          </div>
        </div>
      </SkyBand>

      <motion.section
        aria-labelledby="gallery-heading"
        variants={fadeRise(reduce, AFTER_MORPH)} initial="hidden" animate="show"
        className={`${container} pt-8 sm:pt-10 pb-20`}
      >
        <MediaGallery.Root media={media} status={status} onRetry={retry}>
          <MediaGallery.Toolbar />
          <div className="mt-6">
            <MediaGallery.Grid />
          </div>
          <MediaGallery.Lightbox />
        </MediaGallery.Root>
      </motion.section>

      <Footer />
    </div>
  )
}
