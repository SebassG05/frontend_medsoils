import { motion } from 'framer-motion'
import Footer from '../components/layout/Footer'

const Flag = ({ code, alt }) => (
  <motion.img
    src={`https://flagcdn.com/w40/${code}.png`}
    srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
    width="24"
    height="16"
    alt={alt}
    className="rounded-sm shadow-sm object-cover flex-shrink-0 cursor-pointer"
    whileHover={{ scale: 1.4, rotate: [0, -10, 10, -6, 6, 0], y: -4 }}
    whileTap={{ scale: 0.85 }}
    transition={{ type: 'spring', stiffness: 300, damping: 12 }}
  />
)

const mobilityRows = [
  {
    flag: <Flag code="tr" alt="Turkey" />,
    place: 'Adıyaman, Turkiye',
    when: 'October 2026',
    notes: '—',
  },
  {
    flag: <Flag code="es" alt="Spain" />,
    place: 'Cáceres, Spain',
    when: 'January 2027',
    notes: (
      <>
        May shift to{' '}
        <strong className="text-orange-600">Nov 2026</strong> or{' '}
        <strong className="text-orange-600">Feb 2027</strong>
      </>
    ),
  },
  {
    flag: <Flag code="si" alt="Slovenia" />,
    place: 'Ljubljana, Slovenia',
    when: 'March 2027',
    notes: '—',
  },
  {
    flag: <Flag code="it" alt="Italy" />,
    place: 'Viterbo, Italy',
    when: 'September 2027',
    notes: 'Final discussion & dissertation defence',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
}

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
}

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: 'easeOut', delay },
  }),
}

const About = () => {
  return (
    <>
      <div className="min-h-screen bg-white overflow-hidden">

        {/* ── INTRODUCTION ─────────────────────────────────────────────── */}
        <motion.section
          className="relative bg-orange-50 py-16 px-6 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            {/* Image — slide in from left */}
            <motion.div
              className="flex-shrink-0 order-2 md:order-1 w-[200px] sm:w-[260px] md:w-[360px] mx-auto md:mx-0"
              variants={fadeLeft}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <img
                src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771502757/suelo2_qif9y9.webp"
                alt="Soil layers cross section"
                className="w-full rounded-2xl shadow-xl object-cover"
              />
            </motion.div>

            {/* Text — slide in from right */}
            <motion.div
              className="flex-1 order-1 md:order-2"
              variants={fadeRight}
              custom={0.15}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.p
                className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-3"
                initial={{ opacity: 0, letterSpacing: '0.05em' }}
                whileInView={{ opacity: 1, letterSpacing: '0.15em' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                MEDSOILS – CHALLENGE
              </motion.p>
              <motion.h2
                className="text-3xl font-bold text-gray-800 mb-5"
                variants={fadeUp}
                custom={0.25}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                Introduction
              </motion.h2>
              <motion.p
                className="text-gray-700 leading-relaxed text-justify"
                variants={fadeUp}
                custom={0.35}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                The <strong className="text-orange-500">MEDSOILS CHALLENGE</strong> project arises from the urgent need to address
                the complex and interconnected challenges that soils face in the <strong className="text-orange-500">Mediterranean region</strong>,
                exacerbated by climate change. This project aims to develop a new generation of soil
                experts equipped with interdisciplinary training and an integrated approach to designing
                and implementing innovative and sustainable long-term solutions.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* ── MOBILITY ─────────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left column */}
            <motion.div
              variants={fadeLeft}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-5 leading-snug">
                <span className="text-orange-500">Mobility:</span> learning through experience across four countries
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-justify">
                One of the most enriching aspects of the <strong className="text-orange-500">MEDSOILS CHALLENGE Master</strong> is its international
                mobility pathway, allowing students to{' '}
                <strong>experience soil science in real-life contexts</strong> across four different
                European countries.
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                Throughout the academic year, students will take part in{' '}
                <strong className="text-orange-500">four short-term mobility stays</strong>, each lasting approximately{' '}
                <strong>5 to 7 days</strong>. These on-site periods are carefully scheduled between{' '}
                <strong>January and June 2027</strong>, providing a perfect complement to the online
                components of the programme.
              </p>
            </motion.div>

            {/* Right column — each paragraph staggers in */}
            <div className="space-y-5">
              {[
                <>The journey begins in <strong className="inline-flex items-center gap-1 text-orange-500">Turkey <Flag code="tr" alt="Turkey" /></strong> (January 2027), where students will engage in <strong>hands-on fieldwork</strong>, including erosion assessments, sampling techniques and data collection in rural settings.</>,
                <>The second mobility takes place in <strong className="inline-flex items-center gap-1 text-orange-500">Spain <Flag code="es" alt="Spain" /></strong> (February 2027), focusing on <strong>agro-environmental indicators and land evaluation</strong>. Here, participants will visit farms, take part in soil lab analyses and work alongside local experts and stakeholders.</>,
                <>In March, the group moves to <strong className="inline-flex items-center gap-1 text-orange-500">Slovenia <Flag code="si" alt="Slovenia" /></strong>, where attention shifts to <strong>soil governance, policy development and sustainable management practices</strong>. This stay includes seminars with policymakers, local organisations and applied case studies.</>,
                <>Finally, in <strong className="inline-flex items-center gap-1 text-orange-500">Italy <Flag code="it" alt="Italy" /></strong> (June 2027), students will attend the programme's closing conference, defend their final group projects, and participate in innovation-focused workshops hosted by the Università della Tuscia.</>,
              ].map((text, i) => (
                <motion.p
                  key={i}
                  className="text-gray-600 leading-relaxed text-justify"
                  variants={fadeRight}
                  custom={i * 0.12}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>
          </div>
        </section>

        {/* ── MOBILITY TABLE ───────────────────────────────────────────── */}
        <section className="pb-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.h3
              className="text-2xl font-bold text-center text-gray-800 mb-8"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Face<span className="text-orange-500">-</span>to<span className="text-orange-500">-</span>Face Mobility Weeks{' '}
              <span className="text-orange-500 font-semibold">(16 ECTS)</span>
            </motion.h3>

            <motion.div
              className="rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Table head */}
              <div className="grid grid-cols-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm font-bold uppercase tracking-wider">
                <div className="px-6 py-4">Where</div>
                <div className="px-6 py-4">When</div>
                <div className="px-6 py-4">Notes</div>
              </div>

              {/* Table body */}
              {mobilityRows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
                  whileHover={{ backgroundColor: 'rgba(255,237,213,0.5)', x: 4 }}
                  className={`grid grid-cols-3 text-sm border-t border-gray-100 transition-colors duration-150 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'
                  }`}
                >
                  <div className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                    {row.flag}
                    {row.place}
                  </div>
                  <div className="px-6 py-4 text-gray-600">{row.when}</div>
                  <div className="px-6 py-4 text-gray-500">{row.notes}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}

export default About
