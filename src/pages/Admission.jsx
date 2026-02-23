import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/layout/Footer'

const ease = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, ease, delay },
  }),
}

const fadeLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.8, ease, delay },
  }),
}

const fadeRight = {
  hidden: { opacity: 0, x: 48 },
  visible: (delay = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.8, ease, delay },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const listItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
}

const DotGrid = ({ className = '' }) => (
  <svg className={`absolute pointer-events-none select-none ${className}`} width="320" height="320" viewBox="0 0 320 320">
    {Array.from({ length: 10 }).map((_, row) =>
      Array.from({ length: 10 }).map((_, col) => (
        <circle key={`${row}-${col}`} cx={col * 32 + 16} cy={row * 32 + 16} r="1.5" fill="#f97316" fillOpacity="0.18" />
      ))
    )}
  </svg>
)

const Admission = () => {
  return (
    <>
      <div className="min-h-screen bg-white overflow-hidden">

        {/* ── HERO / ADMISSION REQUIREMENTS ───────────────────────────── */}
        <motion.section
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #dcf6f8 0%, #edfcfd 50%, #dcf6f8 100%)', overflow: 'clip' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease }}
        >
          {/* Geometric grid lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.07]" style={{ clipPath: 'inset(0)' }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f97316" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Large glowing orb — top right */}
          <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />
          {/* Small glowing orb — bottom left */}
          <div className="absolute -bottom-20 -left-20 w-[340px] h-[340px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)' }} />

          {/* Diagonal accent stripe */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute right-0 top-0 h-full w-[45%] opacity-[0.04]"
              style={{ background: 'linear-gradient(135deg, transparent 40%, #f97316 100%)', clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
            />
          </div>

          {/* Floating orange dots pattern — top left */}
          <svg className="absolute top-8 left-8 opacity-20 pointer-events-none" width="180" height="180" viewBox="0 0 180 180">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={col * 30 + 15} cy={row * 30 + 15} r="2" fill="#f97316" />
              ))
            )}
          </svg>
          {/* Floating orange dots pattern — bottom right */}
          <svg className="absolute bottom-8 right-8 opacity-20 pointer-events-none" width="180" height="180" viewBox="0 0 180 180">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={col * 30 + 15} cy={row * 30 + 15} r="2" fill="#f97316" />
              ))
            )}
          </svg>

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center gap-16">

            {/* Left column — text */}
            <div className="flex-1 min-w-0">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 mb-7"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                <span className="h-px w-8 bg-orange-500" />
                <span className="text-[13px] font-bold tracking-[0.22em] text-orange-500 uppercase">Admission Requirements</span>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl lg:text-[5.2rem] font-extrabold leading-[1.08] mb-6 text-gray-900"
                variants={fadeUp}
                custom={0.15}
                initial="hidden"
                animate="visible"
              >
                Ready to{' '}
                <span
                  className="relative inline-block"
                  style={{ WebkitTextStroke: '2px #f97316', color: 'transparent' }}
                >
                  enroll?
                </span>
                <br />
                <span className="text-orange-500">We hope to meet you soon</span>
              </motion.h2>

              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
                <div className="h-[3px] w-4 bg-orange-500/40 rounded-full" />
              </motion.div>

              <motion.p
                className="text-gray-700 leading-relaxed text-[15px] lg:text-[18px] max-w-xl"
                variants={fadeUp}
                custom={0.35}
                initial="hidden"
                animate="visible"
              >
                  The <strong className="text-gray-900">MEDSOILS CHALLENGE</strong> Joint Master Programme is open to
                motivated students from around the world who are passionate about{' '}
                <strong className="text-orange-500">soil science, sustainable land management and climate resilience in Mediterranean regions</strong>.
              </motion.p>

              <motion.p
                className="text-gray-500 leading-relaxed text-[15px] lg:text-[17px] max-w-xl mt-4"
                variants={fadeUp}
                custom={0.5}
                initial="hidden"
                animate="visible"
              >
                The programme attracts candidates with diverse academic backgrounds committed to addressing
                soil degradation and environmental protection through an interdisciplinary approach.
              </motion.p>
            </div>

            {/* Right column — stat cards */}
            <motion.div
              className="flex-shrink-0 flex flex-col gap-4 w-full md:w-72"
              variants={fadeRight}
              custom={0.3}
              initial="hidden"
              animate="visible"
            >
              {[
                { value: '4', label: 'Partner Universities', sub: 'across Europe & Mediterranean' },
                { value: 'B2+', label: 'English Level Required', sub: 'CEFR / IELTS / TOEFL accepted' },
                { value: '100%', label: 'International Programme', sub: 'Open to students worldwide' },
              ].map(({ value, label, sub }, i) => (
                <motion.div
                  key={label}
                  className="relative rounded-2xl border border-cyan-200 p-5 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)' }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.12, duration: 0.6, ease }}
                  whileHover={{ scale: 1.03, borderColor: 'rgba(249,115,22,0.6)' }}
                >
                  {/* card accent */}
                  <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-orange-500 via-orange-300 to-transparent" />
                  <p className="text-3xl lg:text-4xl font-black text-orange-500 mb-1">{value}</p>
                  <p className="text-gray-900 font-semibold text-sm lg:text-base">{label}</p>
                  <p className="text-gray-500 text-xs lg:text-sm mt-0.5">{sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom wave divider */}
          <div className="relative z-10 -mb-px">
            <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
            </svg>
          </div>
        </motion.section>

        {/* ── WHO CAN APPLY? ───────────────────────────────────────────── */}
        <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)' }}>
          {/* Subtle background geometry */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
          <DotGrid className="top-4 right-4 opacity-20" />

          <div className="max-w-6xl mx-auto relative z-10">

            {/* Top label */}
            <motion.div
              className="inline-flex items-center gap-2 mb-12"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease }}
              viewport={{ once: true }}
            >
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">Eligibility</span>
            </motion.div>

            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* LEFT — text */}
              <div className="flex-1 min-w-0">
                <motion.h3
                  className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] mb-5"
                  variants={fadeUp}
                  custom={0}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  Who Can <span className="text-orange-500">Apply?</span>
                </motion.h3>

                <motion.div
                  className="flex items-center gap-3 mb-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
                  <div className="h-[3px] w-4 bg-orange-200 rounded-full" />
                </motion.div>

                <motion.p
                  className="text-gray-500 mb-10 text-[17px] leading-relaxed max-w-lg"
                  variants={fadeUp}
                  custom={0.1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  Applicants must meet the following general requirements to be considered for admission:
                </motion.p>

                <motion.ul
                  className="space-y-6 mb-10"
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                >
                  {[
                    {
                      num: '01',
                      label: "Bachelor's Degree",
                      desc: "Or equivalent qualification in a relevant field such as Environmental Science, Agriculture, Forestry, Geography, Geology, Biology, or related disciplines.",
                    },
                    {
                      num: '02',
                      label: "English Language Proficiency",
                      desc: "Minimum B2 level according to CEFR, or equivalent certification such as TOEFL, IELTS, or similar.",
                    },
                    {
                      num: '03',
                      label: "Strong Motivation",
                      desc: "Genuine commitment to an international, interdisciplinary master focused on the Mediterranean region and climate change adaptation.",
                    },
                  ].map(({ num, label, desc }) => (
                    <motion.li
                      key={num}
                      variants={listItem}
                      className="group flex items-start gap-5"
                    >
                      {/* Number pill */}
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                        <span className="text-[11px] font-black text-orange-400 group-hover:text-white transition-colors duration-300 tracking-wider">{num}</span>
                      </div>
                      <div className="flex-1 pt-[3px]">
                        <p className="text-gray-900 font-bold text-[17px] mb-1">{label}</p>
                        <p className="text-gray-500 text-[15px] leading-relaxed">{desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  className="flex items-start gap-3 py-4 px-5 rounded-xl bg-orange-50 border border-orange-100"
                  variants={fadeUp}
                  custom={0.55}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-400 flex-shrink-0 mt-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <p className="text-orange-600 text-[13px] font-medium italic leading-relaxed">
                    Additional selection criteria will be detailed in the full application call.
                  </p>
                </motion.div>
              </div>

              {/* RIGHT — image (unchanged size) */}
              <motion.div
                className="flex-shrink-0 w-full md:w-[220px] lg:w-[260px] mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease, delay: 0.25 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* Decorative frame */}
                <div className="relative">
                  <motion.img
                    src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771576133/d4587261-fea6-4e58-8f59-0944bb727b67.png"
                    alt="Students applying to the programme"
                    className="relative w-full rounded-2xl shadow-lg object-cover"
                    whileHover={{ scale: 1.03, rotate: 0.5 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── APPLICATION TIMELINE ─────────────────────────────────────── */}
        <section
          className="relative py-32 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #dcf6f8 0%, #edfcfd 50%, #dcf6f8 100%)' }}
        >

          {/* Grid lines — full section */}
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.07 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
            viewport={{ once: true }}
          >
            <defs>
              <pattern id="grid-timeline" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f97316" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-timeline)" />
          </motion.svg>

          {/* White corner — top-left, matches the section above */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)', clipPath: 'polygon(0 0, 100% 0, 0 18%)' }}
          />

          {/* White corner — bottom-right, matches the section below */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: '#ffffff', clipPath: 'polygon(100% 82%, 100% 100%, 0 100%)' }}
          />

          {/* Orange accent line top — draws left → right */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ clipPath: 'polygon(0 18%, 100% 0%, 100% 1.8%, 0 19.8%)' }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: '#f97316', transformOrigin: 'left center' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              viewport={{ once: true }}
            />
          </div>

          {/* Orange accent line bottom — draws right → left */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ clipPath: 'polygon(0 98.2%, 100% 80.2%, 100% 82%, 0 100%)' }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: '#f97316', transformOrigin: 'right center' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              viewport={{ once: true }}
            />
          </div>

          {/* Orb */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-50"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)' }} />

          {/* Dots bottom-left — scales in */}
          <motion.svg
            className="absolute bottom-8 left-8 pointer-events-none"
            width="140" height="140" viewBox="0 0 140 140"
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
            viewport={{ once: true }}
          >
            {Array.from({ length: 5 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={col * 28 + 14} cy={row * 28 + 14} r="2" fill="#f97316" />
              ))
            )}
          </motion.svg>

          <div className="max-w-6xl mx-auto relative z-10">

            {/* Badge label — slides from left */}
            <motion.div
              className="inline-flex items-center gap-2 mb-10"
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">Dates</span>
            </motion.div>

            {/* Title — blur clears while rising */}
            <motion.h3
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] mb-5"
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.62 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              Application <span className="text-orange-500">Timeline</span>
            </motion.h3>

            {/* Underline bars — draw from left */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              style={{ transformOrigin: 'left center' }}
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.78 }}
              viewport={{ once: true }}
            >
              <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
              <div className="h-[3px] w-4 bg-orange-200 rounded-full" />
            </motion.div>

            {/* Paragraphs — individually staggered */}
            <div className="space-y-5 text-gray-600 leading-relaxed max-w-3xl text-[17px]">
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
                viewport={{ once: true }}
              >
                The application period for the first edition of the{' '}
                <strong className="text-gray-900">MEDSOILS CHALLENGE</strong> Master will open soon.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.96 }}
                viewport={{ once: true }}
              >
                Subscribe to our newsletter and be the first to receive important updates about the{' '}
                <strong className="text-gray-900">MEDSOILS CHALLENGE</strong> Master.
                <br />
                We'll send you all the key information, including application deadlines, scholarship
                opportunities, events, and more.
              </motion.p>
              <motion.p
                className="font-semibold text-orange-500"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.08 }}
                viewport={{ once: true }}
              >
                → Don't miss your chance to join the next generation of soil experts.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ── ERASMUS+ SCHOLARSHIPS ────────────────────────────────────── */}
        <section className="relative py-28 px-6 overflow-hidden" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)' }}>

          {/* Grid background */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
            style={{ clipPath: 'inset(0)' }}
          >
            <defs>
              <pattern id="grid-scholarships" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0f172a" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-scholarships)" />
          </svg>

          {/* Orb top-right */}
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)' }} />

          {/* Orb bottom-left */}
          <div className="absolute -bottom-16 -left-16 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)' }} />

          {/* Dot pattern top-right */}
          <DotGrid className="top-0 right-0 opacity-30" />

          <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">

            {/* ── LEFT: Text ── */}
            <div className="flex-1 min-w-0">

              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 mb-8"
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                <span className="h-px w-8 bg-orange-500" />
                <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">Funding</span>
              </motion.div>

              {/* Title */}
              <motion.h3
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] mb-5"
                initial={{ opacity: 0, y: 30, filter: 'blur(7px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                viewport={{ once: true }}
              >
                Erasmus+{' '}
                <span className="text-orange-500">Scholarships</span>
              </motion.h3>

              {/* Underline bars */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                style={{ transformOrigin: 'left center' }}
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                viewport={{ once: true }}
              >
                <div className="h-[3px] w-12 bg-orange-500 rounded-full" />
                <div className="h-[3px] w-4 bg-orange-200 rounded-full" />
              </motion.div>

              {/* Intro text */}
              <motion.p
                className="text-gray-600 leading-relaxed text-[17px] max-w-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                viewport={{ once: true }}
              >
                A limited number of{' '}
                <strong className="text-gray-900">Erasmus+ scholarships</strong> will be available to
                support the participation of the most outstanding candidates. These grants may cover:
              </motion.p>

              {/* Footnote */}
              <motion.p
                className="text-gray-400 italic text-[14px] border-l-2 border-orange-200 pl-4"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
                viewport={{ once: true }}
              >
                Further details about eligibility and conditions will be included in the official call
                for applications.
              </motion.p>
            </div>

            {/* ── RIGHT: Benefit cards ── */}
            <div className="flex-1 w-full flex flex-col gap-5">
              {[
                {
                  num: '01',
                  label: 'Tuition fees',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 3.314-4.03 6-9 6s-9-2.686-9-6c0-.538.076-1.06.214-1.56L12 14z"/>
                    </svg>
                  ),
                  delay: 0.45,
                },
                {
                  num: '02',
                  label: 'Travel and installation costs',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  ),
                  delay: 0.58,
                },
                {
                  num: '03',
                  label: 'Monthly living allowance',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                  ),
                  delay: 0.71,
                },
              ].map(({ num, label, icon, delay }) => (
                <motion.div
                  key={num}
                  className="group flex items-center gap-5 p-5 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                >
                  {/* Number pill */}
                  <span className="text-[11px] font-black tracking-widest text-orange-300 group-hover:text-orange-500 transition-colors w-8 shrink-0 select-none">
                    {num}
                  </span>

                  {/* Icon circle */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-orange-500 transition-colors duration-300"
                    style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' }}>
                    {icon}
                  </div>

                  {/* Label */}
                  <span className="text-gray-800 font-semibold text-[16px] leading-snug group-hover:text-gray-900 transition-colors">
                    {label}
                  </span>

                  {/* Arrow */}
                  <svg className="ml-auto w-4 h-4 text-gray-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ background: '#0b1221' }}>

          {/* Grid overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
            style={{ clipPath: 'inset(0)' }}
          >
            <defs>
              <pattern id="grid-cta" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-cta)" />
          </svg>

          {/* Orange diagonal accent line at top */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{ background: '#f97316', clipPath: 'polygon(0 0, 100% 0, 100% 1.8%, 0 4%)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              viewport={{ once: true }}
            />
          </div>

          {/* Large central glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-[0.12] blur-[100px]"
              style={{ background: 'radial-gradient(ellipse, #f97316 0%, transparent 70%)' }} />
          </div>

          {/* Corner glows */}
          <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
            style={{ background: '#f97316' }} />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full opacity-[0.06] blur-3xl pointer-events-none"
            style={{ background: '#38bdf8' }} />

          {/* Dot grid top-left */}
          <motion.svg
            className="absolute top-12 left-12 pointer-events-none"
            width="120" height="120" viewBox="0 0 120 120"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.12 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {Array.from({ length: 4 }).map((_, row) =>
              Array.from({ length: 4 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={col * 30 + 15} cy={row * 30 + 15} r="2" fill="#f97316" />
              ))
            )}
          </motion.svg>

          {/* Dot grid bottom-right */}
          <motion.svg
            className="absolute bottom-12 right-12 pointer-events-none"
            width="120" height="120" viewBox="0 0 120 120"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.12 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
          >
            {Array.from({ length: 4 }).map((_, row) =>
              Array.from({ length: 4 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={col * 30 + 15} cy={row * 30 + 15} r="2" fill="#f97316" />
              ))
            )}
          </motion.svg>

          {/* Decorative ring behind title */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-orange-500/10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            viewport={{ once: true }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-orange-500/[0.05] pointer-events-none"
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            viewport={{ once: true }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center flex flex-col items-center">

            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 mb-8"
              initial={{ opacity: 0, y: -16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              viewport={{ once: true }}
            >
              <span className="h-px w-6 bg-orange-500/60" />
              <span className="bg-orange-500/15 text-orange-400 text-[11px] font-bold tracking-[0.22em] uppercase px-4 py-1.5 rounded-full border border-orange-500/25">
                Open Applications
              </span>
              <span className="h-px w-6 bg-orange-500/60" />
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.08]"
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              viewport={{ once: true }}
            >
              Ready to join the{' '}
              <span className="text-orange-500">MEDSOILS CHALLENGE</span>{' '}
              Master?
            </motion.h2>

            {/* Divider line with diamond */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.52 }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'center' }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500/60" />
              <div className="w-1.5 h-1.5 bg-orange-500 rotate-45" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500/60" />
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-slate-400 text-base md:text-lg lg:text-xl mb-12 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              viewport={{ once: true }}
            >
              Get in touch to register your interest or request more information. Our team will guide you through every step of the process.
            </motion.p>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.72 }}
              viewport={{ once: true }}
            >
              <Link
                to="/contact"
                state={{ enquiryType: { value: 'Application / Admission', label: 'Application / Admission' } }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(249,115,22,0.5), 0 0 100px rgba(249,115,22,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  className="relative inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg lg:text-xl px-12 lg:px-16 py-5 lg:py-6 rounded-full shadow-2xl transition-colors duration-200 overflow-hidden group"
                >
                  <span className="cursor-pointer relative z-10">Apply Now — Contact Us</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                </motion.button>
              </Link>
            </motion.div>

          </div>

          {/* Bottom orange accent line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{ background: '#f97316', clipPath: 'polygon(0 96%, 100% 98.2%, 100% 100%, 0 100%)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              viewport={{ once: true }}
            />
          </div>

        </section>

      </div>
      <Footer />
    </>
  )
}

export default Admission
