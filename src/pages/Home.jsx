import React from "react"
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, GraduationCap, Globe, Microscope, Sprout, Lightbulb, Star, MessageSquare, ChevronLeft, ChevronRight, Users, BadgeEuro, MapPinned, ExternalLink } from 'lucide-react'
import Footer from '../components/layout/Footer'
import ScrollToTop from '../components/ui/ScrollToTop'
import BlogCarousel from '../components/home/BlogCarousel'
import SoilQuizBanner from '../components/home/SoilQuizBanner'
import IussEndorsement from '../components/home/IussEndorsement'
import FieldResearch from '../components/home/FieldResearch'
import { fetchBlogStats } from '../services/blogService'
import medsoilsHero from '../assets/medsoils-field-research-hero.jpg'
import soilSamplingHero from '../assets/medsoils-soil-sampling-field.jpg'
import fieldCampaignHero from '../assets/medsoils-field-campaign.jpg'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1'

const defaultReviews = [
]

const heroSlides = [
  {
    src: medsoilsHero,
    alt: 'Soil profile sampling in a Mediterranean olive grove',
    position: 'object-[63%_center] lg:object-center',
  },
  {
    src: soilSamplingHero,
    alt: 'Mediterranean soil field observation',
    position: 'object-[58%_center] lg:object-center',
  },
  {
    src: fieldCampaignHero,
    alt: 'Field research equipment in a Mediterranean landscape',
    position: 'object-[62%_center] lg:object-center',
  },
]

const Home = () => {
  const borderRectRef = useRef(null)
  const blogCardRef = useRef(null)
  const [reviews, setReviews] = useState(defaultReviews)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewsPerPage, setReviewsPerPage] = useState(3)
  const [perimeter, setPerimeter] = useState(3200)
  const [cardSize, setCardSize] = useState({ w: 1200, h: 320 })
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)
  const [isHeroPaused, setIsHeroPaused] = useState(false)
  const [blogStats, setBlogStats] = useState({
    totalArticles: 0,
    totalAuthors: 0,
    totalTopics: 0
  })

  useEffect(() => {
    heroSlides.forEach(({ src }) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    if (isHeroPaused) return undefined

    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length)
    }, 6500)

    return () => window.clearInterval(timer)
  }, [isHeroPaused])

  // Fetch reviews from backend
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`${API_URL}/reviews`)
        if (mounted && res.ok) {
          const json = await res.json()
          if (json.data?.length) setReviews(json.data)
        }
      } catch {}
    })()
    return () => { mounted = false }
  }, [])

  // Fetch blog statistics
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const stats = await fetchBlogStats()
        if (mounted) setBlogStats(stats)
      } catch (err) {
        console.error('Failed to load blog stats:', err)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Responsive cards per page for reviews
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setReviewsPerPage(1)
      else if (window.innerWidth < 1024) setReviewsPerPage(2)
      else setReviewsPerPage(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!blogCardRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setCardSize({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(blogCardRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const measure = () => {
      if (borderRectRef.current) {
        const len = borderRectRef.current.getTotalLength()
        if (len > 0) setPerimeter(len)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [cardSize])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const deadline = new Date(2026, 6, 31)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysUntilDeadline = Math.ceil((deadline - today) / 86400000)
  const applicationsOpen = daysUntilDeadline >= 0
  const daysRemaining = Math.max(0, daysUntilDeadline)

  return (
    <>
      {/* MEDSOILS 2026/27 admissions hero */}
      <div className="relative bg-white">
      <section
        className="relative isolate min-h-[680px] overflow-hidden bg-[#08101f] text-white lg:h-[calc(100svh-9rem)] lg:min-h-[680px] lg:max-h-[780px]"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        onFocusCapture={() => setIsHeroPaused(true)}
        onBlurCapture={() => setIsHeroPaused(false)}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={heroSlides[activeHeroSlide].src}
            src={heroSlides[activeHeroSlide].src}
            alt={heroSlides[activeHeroSlide].alt}
            initial={{ opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: 'linear' } }}
            className={`absolute inset-0 h-full w-full object-cover ${heroSlides[activeHeroSlide].position}`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#08101f]/55 lg:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08101f] via-[#08101f]/90 to-[#08101f]/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08101f]/95 to-transparent" />

        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 top-0 hidden w-1 origin-top bg-orange-500 md:block"
        />

        <div className="absolute right-5 top-5 z-30 flex items-center gap-2 sm:right-8 sm:top-8">
          <span className="mr-1 hidden text-[11px] font-bold tracking-[0.16em] text-white/70 sm:inline">
            {String(activeHeroSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={() => setActiveHeroSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/25 bg-[#08101f]/45 text-white backdrop-blur-sm transition-colors hover:border-orange-400 hover:bg-orange-500"
            aria-label="Previous image"
            title="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5" aria-label="Choose hero image">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveHeroSlide(index)}
                className={`h-1.5 rounded-full transition-all ${activeHeroSlide === index ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/45 hover:bg-white/80'}`}
                aria-label={`Show image ${index + 1}`}
                aria-current={activeHeroSlide === index ? 'true' : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActiveHeroSlide((current) => (current + 1) % heroSlides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/25 bg-[#08101f]/45 text-white backdrop-blur-sm transition-colors hover:border-orange-400 hover:bg-orange-500"
            aria-label="Next image"
            title="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container relative z-10 mx-auto flex min-h-[680px] max-w-7xl flex-col justify-between px-5 pb-24 pt-8 sm:px-8 md:pb-28 md:pt-12 lg:h-full lg:min-h-0 lg:px-12"
        >
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
            <div className="max-w-3xl">
              <motion.div variants={itemVariants} className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-sm border border-orange-400/40 bg-orange-500/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
                  </span>
                  {applicationsOpen ? 'Applications open' : 'Applications closed'}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Academic year 2026/27</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="max-w-3xl text-4xl font-black leading-[0.96] text-white sm:text-6xl lg:text-7xl">
                MEDSOILS
                <span className="mt-2 block text-orange-500">Master's Diploma</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-lg">
                Applied Soil Science in Mediterranean Areas. Build advanced expertise online, then put it into practice through international field weeks in Türkiye, Spain, Slovenia, and Italy.
              </motion.p>

              <motion.div variants={itemVariants} className="mt-5 hidden items-center gap-3 text-sm font-semibold text-white/80 sm:flex">
                <MapPinned className="h-5 w-5 shrink-0 text-orange-400" />
                <span>Online learning · Four countries · One international cohort</span>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/admission"
                    className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-orange-500 px-7 py-4 text-base font-bold text-white shadow-xl shadow-black/20 transition-colors hover:bg-orange-600 sm:w-auto"
                  >
                    Start your application
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
                <a
                  href="https://www.unitus.it/post-laurea/master/master-i-livello/medsoils/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md border border-white/25 bg-white/5 px-6 py-4 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/45 hover:bg-white/10 sm:w-auto"
                >
                  Official programme
                  <ExternalLink className="h-4 w-4" />
                </a>
              </motion.div>
            </div>

            <motion.aside variants={itemVariants} className="hidden border-l border-white/20 pl-8 lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">
                {applicationsOpen ? 'Application closes in' : 'Application deadline'}
              </p>
              {applicationsOpen ? (
                <div className="mt-3 flex items-end gap-3">
                  <motion.span
                    key={daysRemaining}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-7xl font-black leading-none text-white"
                  >
                    {daysRemaining}
                  </motion.span>
                  <span className="pb-2 text-lg font-semibold text-white/60">days</span>
                </div>
              ) : (
                <p className="mt-3 text-5xl font-black text-white">Closed</p>
              )}
              <div className="mt-5 h-px w-16 bg-orange-500" />
              <p className="mt-5 text-xl font-bold text-white">31 July 2026</p>
              <p className="mt-1 text-sm text-white/55">Submit before the official deadline.</p>
            </motion.aside>
          </div>

          <motion.div variants={itemVariants} className="mt-6 grid grid-cols-4 border-t border-white/20 pt-4 sm:mt-8 sm:pt-6">
            {[
              { value: 'EUR 0', label: 'Enrollment fee', icon: BadgeEuro },
              { value: '30', label: 'Places available', icon: Users },
              { value: '60', label: 'ECTS', icon: GraduationCap },
              { value: '16', label: 'Mobility grants', icon: MapPinned },
            ].map(({ value, label, icon: Icon }, index) => (
              <div
                key={label}
                className={`flex min-h-16 items-center justify-center py-2 text-center sm:min-h-20 sm:justify-start sm:gap-3 sm:py-3 sm:text-left ${index > 0 ? 'border-l border-white/15 sm:pl-6' : ''}`}
              >
                <Icon className="hidden h-5 w-5 shrink-0 text-orange-400 sm:block" />
                <div>
                  <p className="text-lg font-black text-white sm:text-2xl">{value}</p>
                  <p className="text-[10px] font-medium leading-tight text-white/55 sm:text-sm">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>
      <div className="pointer-events-none relative z-20 -mt-40 h-56" aria-hidden="true">
        <div className="absolute inset-0 backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_34%,black_82%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.06)_28%,rgba(255,255,255,0.78)_72%,white_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-white blur-xl" />
      </div>
      </div>

      {/* Sección About us - Multinational Educational Collaboration */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 py-20 md:py-32 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 -ml-48"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-4 relative z-10 max-w-6xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagen Izquierda */}
            <motion.div
              variants={imageVariants}
              className="order-2 lg:order-1 max-w-md mx-auto lg:mx-0"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 via-orange-300 to-transparent rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <img
                  src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771403759/44dc4e5d-ba4d-4c75-b7d0-f1d8dd4ea673_gkt1fv.jpg"
                  alt="MEDSOILS Team"
                  className="relative w-full rounded-3xl shadow-2xl object-cover h-96"
                />
              </motion.div>
            </motion.div>

            {/* Contenido Derecha */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <motion.p
                variants={itemVariants}
                className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-4"
              >
                About us
              </motion.p>
              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              >
                <span className="text-orange-500">A Multinational</span>
                <br />
                Educational
                <br />
                Collaboration
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 leading-relaxed mb-8 text-justify"
              >
                The International Master 'MEDSOILS CHALLENGE' is a joint initiative organized by a consortium of prestigious higher education institutions and technical partners from four Mediterranean countries.
              </motion.p>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all"
                >
                  Know more about us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Sección About the Program */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white pt-8 pb-8 md:pt-12 md:pb-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 -mr-48 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-20 -ml-36 -mb-20"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="container mx-auto px-4 relative z-10 max-w-6xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-14">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">Our Programme</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              A Joint <span className="text-orange-500">International</span> Master's
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Addressing climate change challenges in the Mediterranean region through interdisciplinary knowledge and practical skills.
            </p>
          </motion.div>

          {/* Goal cards */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {[
              {
                icon: GraduationCap,
                color: 'bg-orange-500',
                bg: 'bg-orange-50',
                border: 'border-orange-100',
                title: 'Educate Experts',
                desc: 'Thorough theoretical and practical understanding of soil science for the next generation of professionals.',
              },
              {
                icon: Lightbulb,
                color: 'bg-cyan-500',
                bg: 'bg-cyan-50',
                border: 'border-cyan-100',
                title: 'Innovative Solutions',
                desc: 'Develop sustainable soil management practices that are economically viable and ecologically responsible.',
              },
              {
                icon: Globe,
                color: 'bg-orange-500',
                bg: 'bg-orange-50',
                border: 'border-orange-100',
                title: 'International Cooperation',
                desc: 'Unite academics and professionals across four Mediterranean countries to tackle transnational climate challenges.',
              },
            ].map(({ icon: Icon, color, bg, border, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`rounded-2xl border ${border} ${bg} p-7 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/about-program"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-shadow group"
              >
                Explore the Programme
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/admission"
                className="inline-flex items-center gap-3 border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Sección Blog Carousel */}
      <section className="relative bg-white py-20 md:py-32 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-20 -mr-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 -ml-48"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-4 relative z-10 max-w-7xl"
        >
          <BlogCarousel />
        </motion.div>
      </section>

      {/* Sección Quiz de suelos */}
      <SoilQuizBanner />

      {/* Sección IUSS Endorsement */}
      <IussEndorsement />

      {/* Sección Blog CTA */}
      <section className="relative bg-white py-12 sm:py-16 md:py-24 flex items-center justify-center">
        <div className="relative w-full max-w-6xl mx-auto px-6 sm:px-8">
          <div ref={blogCardRef} className="relative rounded-2xl overflow-hidden">
            {/* Dotted subtle background pattern */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl opacity-[0.035]"
              style={{
                backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            {/* Inner glow — animated orange radial pulse */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background:
                  'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(251,146,60,0.12) 0%, rgba(251,146,60,0.05) 50%, transparent 80%)',
              }}
            />

            {/* Travelling border line — using real pixel dimensions */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={cardSize.w}
              height={cardSize.h}
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(251,146,60,0.3)" />
                  <stop offset="40%" stopColor="rgba(251,146,60,0.9)" />
                  <stop offset="100%" stopColor="rgba(251,146,60,0.3)" />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75].map((offset, i) => (
                <motion.rect
                  key={i}
                  ref={i === 0 ? borderRectRef : undefined}
                  x="1" y="1"
                  width={cardSize.w - 2}
                  height={cardSize.h - 2}
                  fill="none"
                  stroke="url(#orangeGradient)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  rx="16"
                  strokeDasharray={`${perimeter * 0.08} ${perimeter * 0.92}`}
                  animate={{ strokeDashoffset: [-offset * perimeter, -(offset + 1) * perimeter] }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                />
              ))}
            </svg>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerVariants}
              className="relative z-10 text-center py-8 sm:py-10 md:py-12 px-8 sm:px-16 md:px-20"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-full px-4 py-2 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest">Latest updates</span>
              </motion.div>

              <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Stay up to date with<br />
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">our Blog</span>
              </motion.h2>

              <motion.p variants={itemVariants} className="text-gray-600 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Research findings, field reports and insights from the MedSoils community — straight from our scientists and partners.
              </motion.p>

              {/* Stats row */}
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 md:gap-16 mb-10">
                {[
                  { value: blogStats.totalArticles > 0 ? `${blogStats.totalArticles}` : '0', label: 'Articles published' },
                  { value: blogStats.totalAuthors > 0 ? `${blogStats.totalAuthors}` : '0', label: 'Expert authors' },
                  { value: blogStats.totalTopics > 0 ? `${blogStats.totalTopics}` : '0', label: 'Topics covered' },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center min-w-[100px]">
                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-orange-500 to-orange-600 bg-clip-text text-transparent">{stat.value}</span>
                    <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider text-center font-medium">{stat.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA button */}
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} className="relative inline-block">
                <motion.span
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-orange-300 blur-2xl"
                />
                <Link
                  to="/blog"
                  className="relative inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm px-10 py-4 rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 transition-all duration-300"
                >
                  Read all articles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Sección Field Research */}
      <FieldResearch />


      {/* ─── Reviews Section ─── */}
      <section className="relative mt-0 bg-gradient-to-b from-white via-orange-50/30 to-white py-10 md:py-14 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-25 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 pointer-events-none" />
        {/* Dot grid */}
        <svg className="absolute right-8 top-8 opacity-[0.07] pointer-events-none" width="220" height="220" viewBox="0 0 220 220">
          {Array.from({ length: 7 }).map((_, r) =>
            Array.from({ length: 7 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 32 + 12} cy={r * 32 + 12} r="2" fill="#f97316" />
            ))
          )}
        </svg>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="container mx-auto px-4 max-w-6xl relative z-10"
        >
          {/* Average rating card */}
          <motion.div variants={itemVariants} className="flex justify-center mb-10">
            <div className="relative bg-white rounded-2xl border border-orange-100 shadow-md shadow-orange-100/40 px-10 py-7 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 overflow-hidden">
              {/* Subtle radial glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 opacity-70 pointer-events-none" />

              {/* Big score */}
              <div className="relative flex flex-col items-center">
                <span className="text-6xl font-black text-gray-900 leading-none">
                  {reviews.length
                    ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
                    : '0.0'}
                </span>
                <span className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">out of 5</span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-16 bg-orange-100" />

              {/* Stars + count */}
              <div className="relative flex flex-col items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => {
                    const avg = reviews.length
                      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
                      : 0
                    const filled = s + 1 <= Math.floor(avg)
                    const half = !filled && s < avg
                    return (
                      <span key={s} className="relative w-7 h-7">
                        <Star className="w-7 h-7 text-gray-200 fill-gray-200 absolute inset-0" />
                        {(filled || half) && (
                          <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: filled ? '100%' : `${(avg - Math.floor(avg)) * 100}%` }}
                          >
                            <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
                          </span>
                        )}
                      </span>
                    )
                  })}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  Based on <span className="text-gray-800 font-bold">{reviews.length}</span> review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-16 bg-orange-100" />

              {/* Distribution mini bars */}
              <div className="relative flex flex-col gap-1.5 min-w-[130px]">
                {[5, 4, 3, 2, 1].map(val => {
                  const count = reviews.filter(r => Math.round(Number(r.rating || 0)) === val).length
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={val} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-3 text-right">{val}</span>
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: (5 - val) * 0.08, ease: 'easeOut' }}
                          viewport={{ once: true }}
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-5">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-orange-100 border border-orange-300 text-orange-600 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              <MessageSquare className="w-3.5 h-3.5" />
              Community Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mt-3">
              What our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">students say</span>
            </h2>
            <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">
              Real experiences from the MedSoils community around the world.
            </p>
          </motion.div>

          {/* Cards */}
          <motion.div variants={itemVariants} className="relative">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6 shadow-inner">
                  <MessageSquare className="w-9 h-9 text-orange-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No reviews yet</h3>
                <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                  Be the first to share your experience with the MedSoils community.
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews
                .slice(reviewIndex * reviewsPerPage, reviewIndex * reviewsPerPage + reviewsPerPage)
                .map((r, i) => {
                  const displayName = (r.name || r.createdBy?.name || 'Anonymous').toUpperCase()
                  const isVerified = !!r.createdBy
                  const stars = Math.round(Number(r.rating || 0))
                  return (
                    <motion.div
                      key={r._id || r.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                      whileHover={{ y: -6, boxShadow: '0 20px 40px -8px rgba(0,0,0,0.12)' }}
                      className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all duration-400 relative overflow-hidden group"
                    >
                      {/* Top orange gradient accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-300 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${s < stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-bold text-gray-700">{Number(r.rating || 0).toFixed(1)}</span>
                      </div>

                      {/* Text */}
                      <p className="text-gray-600 text-sm leading-relaxed flex-1">
                        <span className="text-orange-400 font-serif text-xl leading-none mr-1">"</span>
                        {(r.text || '').length > 160 ? `${(r.text || '').slice(0, 160).trim()}…` : (r.text || '')}
                        <span className="text-orange-400 font-serif text-xl leading-none ml-1">"</span>
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                          isVerified
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-600'
                            : 'bg-gradient-to-br from-orange-400 to-orange-600'
                        }`}>
                          {displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(r.createdAt || r.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        {isVerified && (
                          <span className="ml-auto inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-1 rounded-full font-semibold">
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
            </div>
            )}

            {/* Pagination nav */}
            {reviews.length > reviewsPerPage && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setReviewIndex(i => Math.max(0, i - 1))}
                  disabled={reviewIndex === 0}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, p) => (
                  <button
                    key={p}
                    onClick={() => setReviewIndex(p)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      p === reviewIndex ? 'bg-orange-500 scale-125' : 'bg-gray-300 hover:bg-orange-300'
                    }`}
                  />
                ))}
                <button
                  onClick={() => setReviewIndex(i => Math.min(Math.ceil(reviews.length / reviewsPerPage) - 1, i + 1))}
                  disabled={reviewIndex >= Math.ceil(reviews.length / reviewsPerPage) - 1}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/reviews"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-9 py-4 rounded-full font-semibold shadow-lg shadow-orange-200/50 hover:shadow-orange-300/50 transition-all group"
              >
                Share your review
                <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/reviews"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-3 border-2 border-orange-400 text-orange-500 px-9 py-4 rounded-full font-semibold hover:bg-orange-50 transition-all group"
              >
                See all reviews
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
      {/* Raya decorativa */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center my-8"
      />
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default Home
