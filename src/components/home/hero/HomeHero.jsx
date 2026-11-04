import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import '@fontsource-variable/source-serif-4/wght.css'
import IntroOverlay from './IntroOverlay'
import { useIntroPlayback } from '../../../hooks/useIntroPlayback'
import { heroImage } from '../../../data/heroMedia'

const EASE_OUT = [0.22, 1, 0.36, 1]

// Shared by the title on the photo and the band below, so both start on one line
const HERO_GRID = 'mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-14 lg:px-12'

const facts = [
  { value: 'EUR 0', label: 'Enrollment fee' },
  { value: '30', label: 'Places available' },
  { value: '60', label: 'ECTS' },
  { value: '16', label: 'Mobility grants' },
]

const copyVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
}

const strataVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1, ease: EASE_OUT } },
}

// The bands of the logo, in the order the intro curtain sweeps them
const Strata = ({ className, ...motionState }) => (
  <motion.div
    variants={strataVariants}
    {...motionState}
    className={`origin-left ${className}`}
    aria-hidden="true"
  >
    <div className="h-1 bg-leaf" />
    <div className="h-1.5 bg-earth-light" />
    <div className="h-1.5 bg-earth-mid" />
  </motion.div>
)

const HomeHero = () => {
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

  const motionState = {
    initial: shouldReduceMotion ? false : 'hidden',
    animate: intro.isPlaying ? 'hidden' : 'visible',
  }

  return (
    <>
      {intro.isActive && <IntroOverlay intro={intro} />}

      {/* MEDSOILS 2026/27 admissions hero */}
      <section
        {...(intro.isPlaying ? { inert: '' } : {})}
        className="relative isolate bg-earth text-white lg:grid lg:max-h-[1000px] lg:min-h-[calc(100svh-6rem)] lg:grid-rows-[minmax(var(--hero-photo-min),1fr)_auto]"
      >
        <div className="relative lg:overflow-hidden">
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
            className="block aspect-[4/3] h-auto w-full object-cover object-bottom md:aspect-[3/2] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
          />
          <div className="absolute inset-y-0 right-0 hidden w-2/3 bg-gradient-to-l from-earth-deep/55 to-transparent lg:block" aria-hidden="true" />

          <Strata {...motionState} className="lg:hidden" />

          <motion.div
            variants={copyVariants}
            {...motionState}
            className={`relative px-5 pt-7 sm:px-8 md:pt-9 lg:pt-6 xl:pt-8 ${HERO_GRID}`}
          >
            <div className="lg:col-start-2">
              <motion.p variants={itemVariants} className="text-sm font-semibold text-white">
                {applicationsOpen ? 'Applications open, academic year 2026/27' : '2026/27 applications closed'}
              </motion.p>

              <motion.h1 variants={itemVariants} className="mt-2 font-display text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.01em] sm:text-6xl lg:mt-3 lg:whitespace-nowrap lg:text-[clamp(2.75rem,6.8svh,5rem)]">
                MEDSOILS
                <span className="block font-normal">Master's Diploma</span>
              </motion.h1>
            </div>
          </motion.div>
        </div>

        <div>
          <Strata {...motionState} className="hidden lg:block" />
          <motion.div
            variants={copyVariants}
            {...motionState}
            className={`px-5 pb-7 pt-4 sm:px-8 md:pb-9 lg:py-5 ${HERO_GRID}`}
          >
            <motion.div variants={itemVariants}>
              <p className="max-w-[36rem] text-base leading-relaxed text-white/90">
                Applied Soil Science in Mediterranean Areas. Build advanced expertise online, then put it into practice through international field weeks in Türkiye, Spain, Slovenia, and Italy.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 xl:gap-7">
                <Link
                  to="/admission"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 whitespace-nowrap rounded-sm bg-orange-500 px-6 py-3 text-base font-semibold text-earth-deep transition-colors hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-px"
                >
                  {applicationsOpen ? 'Start your application' : 'View admission details'}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
                <a
                  href="https://www.unitus.it/post-laurea/master/master-i-livello/medsoils/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Official programme
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>

            <motion.dl variants={itemVariants} className="mt-7 grid grid-cols-4 gap-x-3 gap-y-4 lg:mt-0 lg:gap-x-6">
              <div className="col-span-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <dt className="text-sm text-white/90">
                  {applicationsOpen ? 'Application closes in' : 'Application deadline'}
                </dt>
                <dd className="font-display text-2xl font-medium">
                  {applicationsOpen ? `${daysRemaining} days` : '24 July 2026'}
                </dd>
                {applicationsOpen && (
                  <dd className="text-sm text-white/90">24 July 2026. Submit before the official deadline.</dd>
                )}
              </div>
              {facts.map(({ value, label }) => (
                <div key={label} className="flex flex-col-reverse justify-end border-t border-white/30 pt-3">
                  <dt className="mt-0.5 text-xs leading-tight text-white/90 sm:text-sm">{label}</dt>
                  <dd className="font-display text-xl font-medium tabular-nums sm:text-[1.625rem]">{value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default HomeHero
