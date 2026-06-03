import { motion } from 'framer-motion'
import Footer from '../components/layout/Footer'

const ease = [0.16, 1, 0.3, 1]

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

// ── PARTNERS DATA ───────────────────────────────────────────────────────────
const MEDSOILS_LOGO = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1771245130/Medsoil_Challenge_lrkqnt.webp'

const TIMESIS_LOGO = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1780475839/logo_timesis-HD-blu-nuovo_trasp_yxe3rj.png'
const UNITUS_LOGO  = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1780476461/UNITUS_02-removebg-preview_jhxsds.png'

const PARTNERS = [
  { id: 1, name: 'Timesis Srl',                            country: 'San Giuliano Terme, Pisa', logo: TIMESIS_LOGO, coordinator: true },
  { id: 2, name: 'Università degli Studi della Tuscia',    country: 'Viterbo, Italy',           logo: UNITUS_LOGO },
  { id: 3, name: 'University of Ljubljana',                country: 'Ljubljana, Slovenia',      logo: MEDSOILS_LOGO },
  { id: 4, name: 'Adıyaman Üniversitesi',                  country: 'Adıyaman, Turkiye',        logo: MEDSOILS_LOGO },
]

// ── PARTNER CARD ─────────────────────────────────────────────────────────────
const PartnerCard = ({ name, country, logo, coordinator = false, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true }}
    className="relative"
  >
    {/* Coordinator badge */}
    {coordinator && (
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md whitespace-nowrap">
        <span>★</span> Project Coordinator
      </div>
    )}
    <motion.div
      className="relative overflow-hidden rounded-2xl cursor-pointer shadow-md border border-gray-100"
      style={{ aspectRatio: '3/4' }}
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      {/* ── BACK: revealed partner info ───────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 py-8"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage:
            'linear-gradient(rgba(249,115,22,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.12) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      >
        <motion.img
          src={logo}
          alt={name}
          className="w-40 h-40 object-contain"
          variants={{
            rest: { scale: 0.85, opacity: 0, transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] } },
            hover: { scale: 1, opacity: 1, transition: { duration: 0.7, delay: 0.35, ease: [0.4, 0, 0.2, 1] } },
          }}
        />
        <motion.div
          className="text-center"
          variants={{
            rest: { y: 12, opacity: 0, transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] } },
            hover: { y: 0, opacity: 1, transition: { duration: 0.7, delay: 0.42, ease: [0.4, 0, 0.2, 1] } },
          }}
        >
          <p className="text-gray-900 font-bold text-sm md:text-base leading-snug">{name}</p>
          <p className="text-orange-500 text-xs md:text-sm mt-1 font-medium">{country}</p>
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-orange-500 to-orange-300 rounded-b-2xl"
          variants={{
            rest: { width: '0%', transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] } },
            hover: { width: '100%', transition: { duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] } },
          }}
        />
      </div>

      {/* ── FRONT: top-left white triangle ────────────── */}
      <motion.div
        className="absolute inset-0 bg-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        variants={{
          rest: { x: '0%', y: '0%', transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } },
          hover: { x: '-101%', y: '-101%', transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } },
        }}
      />

      {/* ── FRONT: bottom-right white triangle ────────── */}
      <motion.div
        className="absolute inset-0 bg-white"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        variants={{
          rest: { x: '0%', y: '0%', transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } },
          hover: { x: '101%', y: '101%', transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } },
        }}
      />

      {/* ── FRONT: logo — fades out on hover ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        variants={{
          rest: { opacity: 1, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
          hover: { opacity: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
        }}
      >
        <img src={MEDSOILS_LOGO} alt="MedSoils" className="w-28 h-28 object-contain" />
      </motion.div>
    </motion.div>
  </motion.div>
)

const About = () => {
  return (
    <>
      <div className="min-h-screen bg-white overflow-hidden">

        {/* ── INTRODUCTION ─────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 60%, #ffffff 100%)' }}
        >
          {/* Orange orb top-right */}
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)' }} />

          {/* Cyan orb bottom-left */}
          <div className="absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 65%)' }} />

          {/* Dot pattern — top-left */}
          <motion.svg className="absolute top-10 left-10 pointer-events-none" width="130" height="130" viewBox="0 0 130 130"
            initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1, delay: 0.4 }}>
            {Array.from({ length: 5 }).map((_, row) => Array.from({ length: 5 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 26 + 13} cy={row * 26 + 13} r="2" fill="#f97316" />
            )))}
          </motion.svg>

          {/* Dot pattern — bottom-right */}
          <motion.svg className="absolute bottom-10 right-10 pointer-events-none" width="130" height="130" viewBox="0 0 130 130"
            initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} transition={{ duration: 1, delay: 0.6 }}>
            {Array.from({ length: 5 }).map((_, row) => Array.from({ length: 5 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 26 + 13} cy={row * 26 + 13} r="2" fill="#0ea5e9" />
            )))}
          </motion.svg>

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

            {/* ── LEFT: Image ── */}
            <motion.div
              className="flex-shrink-0 w-[220px] sm:w-[260px] lg:w-[300px] relative mt-10"
              initial={{ opacity: 0, x: -48, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease, delay: 0.3 }}
            >
              {/* Angled accent block behind */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #dcf6f8 0%, #edfcfd 100%)',
                  transform: 'rotate(4deg) scale(1.04)',
                  zIndex: 0,
                }}
              />
              {/* Second layer — orange tint, opposite angle */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, transparent 60%)',
                  transform: 'rotate(-3deg) scale(1.02)',
                  zIndex: 0,
                }}
              />

              {/* Image */}
              <img
                src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771502757/suelo2_qif9y9.webp"
                alt="Soil layers cross section"
                className="relative w-full rounded-2xl shadow-2xl object-cover"
                style={{ zIndex: 1, paddingTop: '15%' }}
              />

              {/* Vertical orange bar left edge */}
              <div className="absolute -left-3 top-8 bottom-8 w-1 bg-orange-500 rounded-full" style={{ zIndex: 2 }} />
            </motion.div>

            {/* ── RIGHT: Text ── */}
            <div className="flex-1 min-w-0 pt-6 lg:pt-0">

              {/* Badge */}
              <motion.div className="inline-flex items-center gap-2 mb-8"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, ease, delay: 0.4 }}>
                <span className="h-px w-8 bg-orange-500" />
                <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">Medsoils – Challenge</span>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-gray-900 leading-[1.05] mb-5"
                initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.85, ease, delay: 0.5 }}
              >
                Intro<span className="text-orange-500">duction</span>
              </motion.h2>

              {/* Underline bars */}
              <motion.div className="flex items-center gap-3 mb-8" style={{ transformOrigin: 'left center' }}
                initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.55, ease, delay: 0.65 }}>
                <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
                <div className="h-[3px] w-4 bg-orange-200 rounded-full" />
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-gray-600 leading-relaxed text-[18px] max-w-xl text-justify"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.75 }}
              >
                The <strong className="text-gray-900">MEDSOILS CHALLENGE</strong> project arises from the urgent need to address
                the complex and interconnected challenges that soils face in the{' '}
                <strong className="text-orange-500">Mediterranean region</strong>,
                exacerbated by climate change. This project aims to develop a new generation of soil
                experts equipped with interdisciplinary training and an integrated approach to designing
                and implementing innovative and sustainable long-term solutions.
              </motion.p>

            </div>
          </div>
        </section>

        {/* ── MOBILITY ─────────────────────────────────────────────────── */}
        <section className="relative py-24 px-6 overflow-hidden bg-white">

          {/* Orb top-right */}
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)' }} />

          {/* Orb bottom-left */}
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 65%)' }} />

          {/* Dot pattern top-right */}
          <motion.svg className="absolute top-10 right-10 pointer-events-none" width="120" height="120" viewBox="0 0 120 120"
            initial={{ opacity: 0 }} whileInView={{ opacity: 0.13 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}>
            {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 4 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={c * 30 + 15} cy={r * 30 + 15} r="2" fill="#f97316" />
            )))}
          </motion.svg>

          <div className="max-w-6xl mx-auto relative z-10">

            {/* Badge + title */}
            <motion.div className="inline-flex items-center gap-2 mb-8"
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }} viewport={{ once: true }}>
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">International Experience</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.08] mb-5"
              initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, ease, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Mobility: <span className="text-orange-500">learning</span> through experience
            </motion.h2>

            <motion.div className="flex items-center gap-3 mb-12" style={{ transformOrigin: 'left center' }}
              initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.55, ease, delay: 0.25 }} viewport={{ once: true }}>
              <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
              <div className="h-[3px] w-4 bg-orange-200 rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

              {/* Left column */}
              <motion.div
                initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75, ease, delay: 0.15 }} viewport={{ once: true, amount: 0.2 }}>
                <p className="text-gray-600 leading-relaxed mb-5 text-[17px] text-justify">
                  One of the most enriching aspects of the <strong className="text-gray-900">MEDSOILS CHALLENGE Master</strong> is its international
                  mobility pathway, allowing students to{' '}
                  <strong className="text-gray-900">experience soil science in real-life contexts</strong> across four different
                  European countries.
                </p>
                <p className="text-gray-600 leading-relaxed text-[17px] text-justify">
                  Throughout the academic year, students will take part in{' '}
                  <strong className="text-orange-500">four short-term mobility stays</strong>, each lasting approximately{' '}
                  <strong className="text-gray-900">5 to 7 days</strong>. These on-site periods are carefully scheduled between{' '}
                  <strong className="text-gray-900">January and June 2027</strong>, providing a perfect complement to the online
                  components of the programme.
                </p>
              </motion.div>

              {/* Right column — staggered paragraphs */}
              <div className="space-y-5">
                {[
                  <>The journey begins in <strong className="inline-flex items-center gap-1 text-orange-500">Turkey <Flag code="tr" alt="Turkey" /></strong> (January 2027), where students will engage in <strong className="text-gray-900">hands-on fieldwork</strong>, including erosion assessments, sampling techniques and data collection in rural settings.</>,
                  <>The second mobility takes place in <strong className="inline-flex items-center gap-1 text-orange-500">Spain <Flag code="es" alt="Spain" /></strong> (February 2027), focusing on <strong className="text-gray-900">agro-environmental indicators and land evaluation</strong>. Participants visit farms, conduct soil lab analyses and work alongside local experts.</>,
                  <>In March, the group moves to <strong className="inline-flex items-center gap-1 text-orange-500">Slovenia <Flag code="si" alt="Slovenia" /></strong>, where attention shifts to <strong className="text-gray-900">soil governance, policy development and sustainable management practices</strong>, including seminars with policymakers and applied case studies.</>,
                  <>Finally, in <strong className="inline-flex items-center gap-1 text-orange-500">Italy <Flag code="it" alt="Italy" /></strong> (June 2027), students attend the closing conference, defend their final group projects, and participate in innovation-focused workshops hosted by the Università della Tuscia.</>,
                ].map((text, i) => (
                  <motion.p key={i} className="text-gray-600 leading-relaxed text-[17px] text-justify"
                    initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                    viewport={{ once: true, amount: 0.2 }}>
                    {text}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── MOBILITY TABLE ───────────────────────────────────────────── */}
        <section className="relative pb-28 pt-4 px-6 overflow-hidden bg-white">

          {/* Subtle bottom orb */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)' }} />

          <div className="max-w-6xl mx-auto relative z-10">

            <motion.div className="inline-flex items-center gap-2 mb-6"
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease }} viewport={{ once: true }}>
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">Schedule</span>
            </motion.div>

            <motion.h3
              className="text-3xl md:text-4xl lg:text-[2.8rem] font-extrabold text-gray-900 mb-3"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, ease, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Face-to-Face <span className="text-orange-500">Mobility Weeks</span>{' '}
              <span className="text-gray-400 font-semibold text-[1.6rem]">(16 ECTS)</span>
            </motion.h3>

            <motion.div className="flex items-center gap-3 mb-10" style={{ transformOrigin: 'left center' }}
              initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5, ease, delay: 0.25 }} viewport={{ once: true }}>
              <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
              <div className="h-[3px] w-4 bg-orange-200 rounded-full" />
            </motion.div>

            <motion.div
              className="rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: 0.15 }}
            >
              {/* Table head */}
              <div className="grid grid-cols-3 text-white text-sm font-bold uppercase tracking-wider"
                style={{ background: 'linear-gradient(90deg, #ea580c 0%, #f97316 50%, #fb923c 100%)' }}>
                <div className="px-6 py-4">Where</div>
                <div className="px-6 py-4">When</div>
                <div className="px-6 py-4">Notes</div>
              </div>

              {mobilityRows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                  whileHover={{ backgroundColor: 'rgba(255,237,213,0.5)', x: 4 }}
                  className={`grid grid-cols-3 text-sm border-t border-gray-100 transition-colors duration-150 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'
                  }`}
                >
                  <div className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                    {row.flag}{row.place}
                  </div>
                  <div className="px-6 py-4 text-gray-600">{row.when}</div>
                  <div className="px-6 py-4 text-gray-500">{row.notes}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      {/* ── OUR PARTNERS ─────────────────────────────────────────────── */}
      <section className="relative pt-10 pb-20 px-6 overflow-hidden bg-white">

        {/* Orb top-right */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)' }} />

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Badge */}
          <motion.div className="inline-flex items-center gap-2 mb-8"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }} viewport={{ once: true }}>
            <span className="h-px w-8 bg-orange-500" />
            <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">Collaboration</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }} viewport={{ once: true }}
          >
            Our <span className="text-orange-500">Partners</span>
          </motion.h2>

          {/* Underline accent */}
          <motion.div className="flex gap-1.5 mb-4"
            initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease }} viewport={{ once: true }}
            style={{ originX: 0 }}>
            <span className="h-1 w-10 rounded-full bg-orange-500" />
            <span className="h-1 w-4 rounded-full bg-orange-300" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-gray-400 text-sm mb-12 max-w-lg"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease }} viewport={{ once: true }}
          >
            Hover over each card to discover the institutions behind MedSoils.
          </motion.p>

          {/* Partner grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {PARTNERS.map((p, i) => (
              <PartnerCard key={p.id} {...p} delay={i * 0.1} />
            ))}
          </div>

        </div>
      </section>

      {/* ── Footer accent line ── */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #f97316 30%, #fb923c 60%, transparent 100%)',
        }}
      />

      <Footer />
    </>
  )
}

export default About
