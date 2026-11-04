import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, BadgeEuro, ExternalLink, GraduationCap, MapPinned, Users } from 'lucide-react'
import '@fontsource-variable/bricolage-grotesque/wght.css'
import IntroOverlay from './IntroOverlay'
import { useIntroPlayback } from '../../../hooks/useIntroPlayback'
import { heroImage } from '../../../data/heroMedia'

const EASE_OUT = [0.22, 1, 0.36, 1]

const facts = [
  { value: 'EUR 0', label: 'Enrollment fee', icon: BadgeEuro },
  { value: '30', label: 'Places available', icon: Users },
  { value: '60', label: 'ECTS', icon: GraduationCap },
  { value: '16', label: 'Mobility grants', icon: MapPinned },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

const HeroField = () => {
  const imageRef = useRef(null)
  const [imageReady, setImageReady] = useState(false)
  const intro = useIntroPlayback(imageReady)
  const shouldReduceMotion = useReducedMotion()

  const deadline = new Date(2026, 6, 24)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysUntilDeadline = Math.ceil((deadline - today) / 86400000)
  const applicationsOpen = daysUntilDeadline >= 0
  const daysRemaining = Math.max(0, daysUntilDeadline)

  useEffect(() => {
    if (imageRef.current?.complete) setImageReady(true)
  }, [])

  const handleImageLoad = (event) => {
    event.currentTarget.decode().catch(() => {}).finally(() => setImageReady(true))
  }

  return (
    <>
      {intro.isActive && <IntroOverlay intro={intro} />}

      {/* MEDSOILS 2026/27 admissions hero */}
      <section
        {...(intro.isPlaying ? { inert: '' } : {})}
        className="relative isolate overflow-hidden bg-earth-deep text-white lg:h-[calc(100svh-6rem)] lg:max-h-[1000px] lg:min-h-[620px]"
      >
        {/* Only as dark as the text needs: the group and the soil stay in full colour */}
        <div className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_75%_95%_at_0%_0%,var(--color-earth-deep)_38%,transparent_100%)] lg:block" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 hidden bg-[radial-gradient(ellipse_42%_62%_at_100%_0%,color-mix(in_srgb,var(--color-earth-deep)_82%,transparent)_30%,transparent_100%)] lg:block" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-44 bg-gradient-to-t from-earth-deep via-earth-deep/80 to-transparent lg:block" aria-hidden="true" />

        <div className="absolute bottom-0 left-0 top-0 hidden w-1 bg-orange-500 md:block" aria-hidden="true" />

        <motion.div
          variants={containerVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={intro.isPlaying ? 'hidden' : 'visible'}
          className="mx-auto flex h-full max-w-7xl flex-col px-5 pt-7 sm:px-8 md:pt-9 lg:px-12 lg:pt-[clamp(1.25rem,4svh,3rem)]"
        >
          <div className="lg:flex lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="rounded-sm border border-orange-400/70 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-orange-300">
                  {applicationsOpen ? 'Applications open' : 'Applications closed'}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/85">Academic year 2026/27</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="mt-4 font-headline text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:whitespace-nowrap lg:text-[clamp(3rem,7.6svh,5.25rem)]">
                MEDSOILS
                <span className="block text-orange-500">Master's Diploma</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="mt-4 max-w-[38rem] text-base leading-relaxed text-white/90 xl:text-lg">
                Applied Soil Science in Mediterranean Areas. Build advanced expertise online, then put it into practice through international field weeks in Türkiye, Spain, Slovenia, and Italy.
              </motion.p>

              <motion.div variants={itemVariants} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/admission"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 whitespace-nowrap rounded-md bg-orange-500 px-6 py-3 text-base font-semibold text-earth-deep transition-colors hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px"
                >
                  {applicationsOpen ? 'Start your application' : 'View admission details'}
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
                <a
                  href="https://www.unitus.it/post-laurea/master/master-i-livello/medsoils/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-white/50 px-5 py-3 text-sm font-semibold transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Official programme
                  <ExternalLink className="size-4" />
                </a>
              </motion.div>
            </div>

            <motion.aside variants={itemVariants} className="hidden shrink-0 border-l border-white/40 pl-7 lg:block lg:w-56">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-300">
                {applicationsOpen ? 'Application closes in' : 'Application deadline'}
              </p>
              <p className="mt-2 font-headline text-5xl font-extrabold leading-none">
                {applicationsOpen ? `${daysRemaining} days` : 'Closed'}
              </p>
              <div className="mt-4 h-px w-14 bg-orange-500" aria-hidden="true" />
              <p className="mt-4 text-lg font-semibold">24 July 2026</p>
              {applicationsOpen && <p className="mt-1 text-sm text-white/90">Submit before the official deadline.</p>}
            </motion.aside>
          </div>

          {/* In the flow on small screens, behind everything from lg up */}
          <div className="relative -mx-5 mt-7 sm:-mx-8 lg:contents">
            <img
              ref={imageRef}
              src={heroImage.src}
              srcSet={heroImage.srcSet}
              sizes={heroImage.sizes}
              width={heroImage.width}
              height={heroImage.height}
              alt={heroImage.alt}
              fetchpriority="high"
              onLoad={handleImageLoad}
              onError={() => setImageReady(true)}
              className="block aspect-[4/3] h-auto w-full object-cover object-bottom lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto lg:h-full"
            />
            <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-earth-deep to-transparent lg:hidden" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-earth-deep to-transparent lg:hidden" aria-hidden="true" />
          </div>

          <motion.div variants={itemVariants} className="relative pt-3 lg:mt-auto lg:pt-0">
            <p className="mb-3 text-sm font-medium lg:hidden">
              {applicationsOpen ? `Application closes in ${daysRemaining} days, 24 July 2026` : 'Application deadline 24 July 2026'}
            </p>
            <dl className="grid grid-cols-4 border-t border-white/40 py-4 lg:py-5">
              {facts.map(({ value, label, icon: Icon }, index) => (
                <div
                  key={label}
                  className={`grid grid-cols-[auto_minmax(0,1fr)] items-center sm:gap-x-3 ${index > 0 ? 'border-l border-white/30 pl-3 sm:pl-6' : ''}`}
                >
                  <dt className="col-start-2 row-start-2 text-[11px] font-medium leading-tight text-white/90 sm:text-sm">{label}</dt>
                  <dd className="contents">
                    <Icon strokeWidth={1.5} className="col-start-1 row-span-2 row-start-1 hidden size-6 text-orange-400 sm:block" aria-hidden="true" />
                    <span className="col-start-2 row-start-1 font-headline text-lg font-bold tabular-nums sm:text-2xl">{value}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}

export default HeroField
