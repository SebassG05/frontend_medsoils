import { COPY } from '../../data/dissemination/copy'

const BLOCK = 'bg-gray-100 animate-pulse motion-reduce:animate-none'

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-white shadow-card">
      <div className={`aspect-video ${BLOCK}`} />
      <div className="space-y-4 px-6 pt-5 pb-6">
        <div className="space-y-2">
          <div className={`h-5 w-11/12 rounded ${BLOCK}`} />
          <div className={`h-5 w-2/3 rounded ${BLOCK}`} />
        </div>
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-full ${BLOCK}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-3.5 w-1/2 rounded ${BLOCK}`} />
            <div className={`h-3 w-3/4 rounded ${BLOCK}`} />
          </div>
        </div>
        <div className={`h-3 w-1/4 rounded ${BLOCK}`} />
      </div>
    </div>
  )
}

/** Placeholder with the same shapes as the featured block and the cards. */
export default function InterviewSkeleton({ count = 6, featured = false }) {
  return (
    <div aria-busy="true" aria-label={COPY.loading} role="status" className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
      {featured && (
        <div className="mb-14 grid overflow-hidden rounded-[2rem] bg-white shadow-card lg:grid-cols-12">
          <div className={`aspect-video lg:col-span-7 lg:aspect-auto lg:min-h-[28rem] ${BLOCK}`} />
          <div className="space-y-5 p-8 lg:col-span-5 lg:p-12">
            <div className={`h-3 w-1/3 rounded ${BLOCK}`} />
            <div className={`h-9 w-full rounded ${BLOCK}`} />
            <div className={`h-9 w-3/4 rounded ${BLOCK}`} />
            <div className={`h-16 w-full rounded ${BLOCK}`} />
            <div className={`h-11 w-44 rounded-full ${BLOCK}`} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  )
}
