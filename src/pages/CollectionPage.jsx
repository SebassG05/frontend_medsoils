import { useParams } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Breadcrumbs from '../components/collections/Breadcrumbs'
import SkyBand from '../components/collections/SkyBand'
import NotFoundPanel from '../components/collections/NotFoundPanel'
import { getCollection } from '../data/collections'
import { COPY } from '../data/collections/copy'
import { RESOURCES_PATH } from '../utils/collectionRoutes'
import { isMediaConfigured } from '../utils/media'

const container = 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12'

export default function CollectionPage() {
  const { collectionSlug } = useParams()
  const collection = isMediaConfigured ? getCollection(collectionSlug) : null

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

  return (
    <div className="min-h-screen bg-white">
      <SkyBand>
        <div className={`${container} pt-8`}>
          <Breadcrumbs items={[{ label: COPY.breadcrumbs.root, to: RESOURCES_PATH }, { label: collection.title }]} />
          <h1 className="mt-6 font-headline text-4xl font-bold text-gray-900">{collection.title}</h1>
        </div>
      </SkyBand>
      <Footer />
    </div>
  )
}
