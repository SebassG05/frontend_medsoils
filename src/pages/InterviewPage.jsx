import { useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Footer from '../components/layout/Footer'
import SkyBand from '../components/collections/SkyBand'
import Breadcrumbs from '../components/collections/Breadcrumbs'
import NotFoundPanel from '../components/collections/NotFoundPanel'
import InterviewSkeleton from '../components/dissemination/InterviewSkeleton'
import LoadError from '../components/dissemination/LoadError'
import InterviewHeader from '../components/dissemination/InterviewHeader'
import InterviewMedia from '../components/dissemination/InterviewMedia'
import TranscriptQA from '../components/dissemination/TranscriptQA'
import ShareActions from '../components/dissemination/ShareActions'
import RelatedInterviews from '../components/dissemination/RelatedInterviews'
import useInterviews from '../hooks/useInterviews'
import { SHARE_FALLBACK_IMAGE, buildInterviewMeta, getBySlug, related } from '../data/dissemination'
import { MEDIA_BASE } from '../utils/media'
import usePageMeta from '../utils/usePageMeta'
import { DISSEMINATION_PATH } from '../utils/disseminationRoutes'
import { COPY } from '../data/dissemination/copy'
import { AFTER_MORPH, fadeRise } from '../utils/motion'

const NARROW = 'mx-auto max-w-5xl px-4 sm:px-6'
const READING = 'mx-auto max-w-3xl px-4 sm:px-6'

/** /dissemination/:slug — one interview. */
export default function InterviewPage() {
  const { slug } = useParams()
  const { status, interviews, retry } = useInterviews()
  const interview = status === 'ready' ? getBySlug(interviews, slug) : null
  const reduce = useReducedMotion()
  usePageMeta(
    interview
      ? buildInterviewMeta(interview, { origin: window.location.origin, mediaBase: MEDIA_BASE, fallbackImage: SHARE_FALLBACK_IMAGE })
      : status === 'ready'
        ? { title: COPY.detail.notFoundTitle, description: COPY.detail.notFoundBody, url: `${window.location.origin}${DISSEMINATION_PATH}`, type: 'website' }
        : null,
  )
  // Everything except the player waits for the cover morph to lead.
  const follow = { variants: fadeRise(reduce, AFTER_MORPH), initial: 'hidden', animate: 'show' }

  let content
  if (status === 'loading') content = <div className="pt-8 pb-24"><InterviewSkeleton count={3} /></div>
  else if (status === 'error') content = <LoadError onRetry={retry} />
  else if (!interview) {
    content = (
      <div className={NARROW}>
        <NotFoundPanel title={COPY.detail.notFoundTitle} body={COPY.detail.notFoundBody} cta={COPY.detail.notFoundCta} to={DISSEMINATION_PATH} />
      </div>
    )
  } else {
    content = (
      <>
        <article className="pb-20">
          <div className={`${NARROW} space-y-10`}>
            <motion.div {...follow}><InterviewHeader interview={interview} /></motion.div>
            <InterviewMedia interview={interview} />
          </div>

          <motion.div {...follow} className={`${READING} mt-12 space-y-10`}>
            <p className="text-xl leading-relaxed text-gray-700 text-pretty">{interview.summary}</p>
            {interview.quote && interview.type !== 'text' && (
              <blockquote className="border-l-[3px] border-orange-500 pl-5 font-headline text-2xl font-medium leading-snug text-gray-900 text-pretty">
                “{interview.quote}”
              </blockquote>
            )}
            {interview.transcript?.length > 0 && (
              <section aria-label={COPY.detail.transcript}>
                <TranscriptQA transcript={interview.transcript} interviewee={interview.interviewee} collapsible={interview.type !== 'text'} />
              </section>
            )}
            <div className="border-t border-gray-100 pt-8">
              <ShareActions title={interview.title} />
            </div>
          </motion.div>
        </article>

        <div className="border-t border-gray-100 pt-16 pb-28">
          <RelatedInterviews interviews={related(interviews, interview.slug)} />
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SkyBand>
        <div className={`${NARROW} pt-10 pb-8`}>
          <Breadcrumbs
            label={COPY.detail.breadcrumbLabel}
            items={[{ label: COPY.detail.breadcrumb, to: DISSEMINATION_PATH }, { label: interview?.title ?? '…' }]}
          />
        </div>
        {content}
      </SkyBand>
      <Footer />
    </div>
  )
}
