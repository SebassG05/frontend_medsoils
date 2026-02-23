import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Lightbulb, Globe, BookOpen, Users, Wrench, ArrowRight } from 'lucide-react'
import Footer from '../components/layout/Footer'
import ScrollToTop from '../components/ui/ScrollToTop'

/* ─────────────────────────────────────────────────────────────────────────
   ScrollText — fades IN when entering the viewport, fades OUT when leaving
───────────────────────────────────────────────────────────────────────── */
const ScrollText = ({ children }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { margin: '-18% 0px -18% 0px' })

  return (
    <motion.div
      ref={ref}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 36 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   StickyPanel — stays fixed while the opposite column scrolls
───────────────────────────────────────────────────────────────────────── */
const StickyPanel = ({ children, className = '' }) => (
  <div className={`flex justify-center py-8 lg:py-0 lg:sticky lg:top-0 lg:h-screen lg:items-center ${className}`}>
    {children}
  </div>
)

const goals = [
  {
    icon: GraduationCap,
    title: 'Educate experts',
    desc: 'with a thorough theoretical and practical understanding of soil science.',
  },
  {
    icon: Lightbulb,
    title: 'Develop innovative solutions',
    desc: 'for sustainable soil management that are economically viable and ecologically responsible.',
  },
  {
    icon: Globe,
    title: 'Promote international cooperation',
    desc: 'among academics and professionals to address transnational challenges of climate change.',
  },
]

const reasons = [
  {
    icon: BookOpen,
    title: 'Interdisciplinary Training',
    desc: 'Courses designed to provide knowledge and skills in soil sciences, sustainable management, and digital technologies.',
  },
  {
    icon: Users,
    title: 'International Collaboration',
    desc: 'Study and collaborate with experts and peers from various Mediterranean regions, enriching your educational and professional experience.',
  },
  {
    icon: Wrench,
    title: 'Practical Focus',
    desc: 'Engage in real projects addressing soil issues in the Mediterranean context, using cutting-edge tools and data analysis.',
  },
]



const AboutProgram = () => {
  return (
    <>  
      <section
        className="relative pt-32 pb-24 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #dcf6f8 0%, #ffffff 60%, #f0fafb 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative max-w-5xl mx-auto text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100/70 text-orange-700 text-sm font-semibold tracking-wide mb-6">
            Our programme
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight max-w-3xl mx-auto mb-6">
            A Joint <span className="text-orange-500">International</span> Master's Programme for{' '}
            <span className="text-orange-500">Future Soil Experts</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base mb-10">
            Addressing climate change challenges in the Mediterranean region through
            interdisciplinary knowledge and practical skills.
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 w-24 bg-orange-500 rounded-full mx-auto origin-left"
          />
        </motion.div>
      </section>

      {/* ── SCROLL SECTION 1 — Programme ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 flex flex-col lg:grid lg:grid-cols-2 lg:gap-16">

        {/* Sticky visual — order-2 on mobile so text appears first */}
        <StickyPanel className="order-2 lg:order-1">
          <div className="w-full max-w-sm h-[300px] lg:h-[480px] rounded-3xl overflow-hidden shadow-xl bg-gray-100">
            {/* Replace with your image, e.g: <img src="..." className="w-full h-full object-cover" /> */}
          </div>
        </StickyPanel>

        {/* Scrolling text blocks — order-1 on mobile */}
        <div className="order-1 lg:order-2 py-8 lg:py-20 space-y-12 lg:space-y-24">

          <ScrollText>
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">
              About the programme
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              Train the next generation of soil experts
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The MEDSOILS CHALLENGE Master's programme is designed to train the next generation
              of soil experts, equipped with interdisciplinary knowledge and practical skills to
              tackle urgent environmental challenges, especially those exacerbated by climate
              change in the Mediterranean region.
            </p>
          </ScrollText>

          <ScrollText>
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">
              Collaboration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              Built across four countries
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Developed in collaboration with four academic institutions and two technical partners
              from four Mediterranean countries, this unique programme offers an integrated and
              applied approach to sustainable soil management and conservation.
            </p>
          </ScrollText>

          <ScrollText>
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">
              Our goals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
              What we aim to achieve
            </h2>
            <ul className="space-y-5">
              {goals.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-100/60 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollText>

        </div>
      </section>

      {/* ── SCROLL SECTION 2 — Why Join ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 flex flex-col lg:grid lg:grid-cols-2 lg:gap-16">

        {/* Scrolling text blocks — naturally first in DOM = first on mobile */}
        <div className="py-8 lg:py-20 space-y-12 lg:space-y-24">

          <ScrollText>
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">
              Why join
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              Why Join{' '}
              <span className="text-orange-500">MEDSOILS CHALLENGE?</span>
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Join a programme that combines rigorous academic training with hands-on field
              experience across the Mediterranean region, preparing you to lead the way in
              sustainable soil management.
            </p>
          </ScrollText>

          {reasons.map(({ icon: Icon, title, desc }, i) => (
            <ScrollText key={title}>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-100/60 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-1.5">{title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-14">{desc}</p>
              {i === reasons.length - 1 && (
                <div className="pl-14 mt-6">
                  <Link
                    to="/admission"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow group"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </ScrollText>
          ))}

        </div>

        {/* Sticky visual — naturally after text in DOM = after text on mobile */}
        <StickyPanel>
          <div className="w-full max-w-sm h-[300px] lg:h-[480px] rounded-3xl overflow-hidden shadow-xl bg-gray-100">
            {/* Replace with your image, e.g: <img src="..." className="w-full h-full object-cover" /> */}
          </div>
        </StickyPanel>

      </section>

      {/* ── SCROLL SECTION 3 — Curriculum ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 flex flex-col lg:grid lg:grid-cols-2 lg:gap-16">

        {/* Sticky visual — order-2 on mobile so text appears first */}
        <StickyPanel className="order-2 lg:order-1">
          <div className="w-full max-w-sm h-[300px] lg:h-[480px] rounded-3xl overflow-hidden shadow-xl bg-gray-100">
            {/* Replace with your image, e.g: <img src="..." className="w-full h-full object-cover" /> */}
          </div>
        </StickyPanel>

        {/* Scrolling text blocks — order-1 on mobile */}
        <div className="order-1 lg:order-2 py-8 lg:py-20 space-y-12 lg:space-y-24">

          <ScrollText>
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">
              Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              One year. Four modules.
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The programme spans one academic year and is structured in modules ranging from
              fundamental soil science to the practical application of technologies in the field.
            </p>
          </ScrollText>

          <ScrollText>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Soil Science Fundamentals</h3>
            <p className="text-gray-600 leading-relaxed">
              Gain deep theoretical knowledge of soil composition, properties, and degradation
              processes specific to Mediterranean ecosystems.
            </p>
          </ScrollText>

          <ScrollText>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Field Technologies</h3>
            <p className="text-gray-600 leading-relaxed">
              Learn to use remote sensing, GIS, and data analysis tools to monitor and assess
              soil health at scale across the region.
            </p>
          </ScrollText>

          <ScrollText>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Capstone Project</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Apply your knowledge in a real-world context, supported by our technical partners,
              addressing a genuine soil challenge in the Mediterranean region.
            </p>
            <Link
              to="/admission"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow group"
            >
              Apply Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollText>

        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </>
  )
}

export default AboutProgram
