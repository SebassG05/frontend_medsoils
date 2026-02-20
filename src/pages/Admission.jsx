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
          className="relative py-24 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #f9fafb 100%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease }}
        >
          {/* Decorative elements */}
          <DotGrid className="top-0 right-0 opacity-70" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-100 opacity-40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-orange-50 opacity-60 blur-2xl pointer-events-none" />
          {/* Thin top accent bar */}
          <motion.div
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-300"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease, delay: 0.3 }}
          />

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.p
              className="text-xs font-bold tracking-[0.2em] text-orange-500 uppercase mb-4"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
            >
              Admission Requirements
            </motion.p>
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 leading-tight"
              variants={fadeUp}
              custom={0.25}
              initial="hidden"
              animate="visible"
            >
              Ready to enroll?{' '}
              <span className="text-orange-500">We hope to meet you soon</span>
            </motion.h2>
            {/* Animated underline */}
            <motion.div
              className="h-[3px] w-20 bg-orange-500 rounded-full mb-8"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
            />
            <motion.p
              className="text-gray-600 leading-relaxed text-justify max-w-3xl text-[15px]"
              variants={fadeUp}
              custom={0.4}
              initial="hidden"
              animate="visible"
            >
              The <strong className="text-gray-900">MEDSOILS CHALLENGE</strong> Joint Master Programme is open to motivated
              students from around the world who are passionate about{' '}
              <strong className="text-gray-900">soil science, sustainable land management and climate resilience in Mediterranean regions</strong>.
              <br /><br />
              The programme aims to attract candidates with diverse academic backgrounds and professional
              experiences, who are committed to addressing the challenges of soil degradation, land
              sustainability and environmental protection through an interdisciplinary approach.
            </motion.p>
          </div>
        </motion.section>

        {/* ── WHO CAN APPLY? ───────────────────────────────────────────── */}
        <section className="relative py-20 px-6 bg-white overflow-hidden">
          <DotGrid className="bottom-0 left-0 opacity-50" />
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-14 relative z-10">

            {/* Text */}
            <motion.div
              className="flex-1"
              variants={fadeLeft}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <p className="text-xs font-bold tracking-[0.2em] text-orange-500 uppercase mb-3">Eligibility</p>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                Who Can Apply?
              </h3>
              <div className="h-[3px] w-14 bg-orange-500 rounded-full mb-6" />
              <p className="text-gray-600 mb-6 text-[15px]">
                Applicants must meet the following general requirements:
              </p>
              <motion.ul
                className="space-y-5 mb-7"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {[
                  { label: "Bachelor's degree", desc: "(or equivalent) in a relevant field such as Environmental Science, Agriculture, Forestry, Geography, Geology, Biology, or related disciplines." },
                  { label: "English language proficiency", desc: "(minimum B2 level according to CEFR or equivalent certification such as TOEFL, IELTS, etc.)." },
                  { label: "Strong motivation", desc: "to participate in an international, interdisciplinary master programme focused on the Mediterranean region and climate change adaptation." },
                ].map(({ label, desc }) => (
                  <motion.li key={label} variants={listItem} className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <span className="text-gray-700 text-[15px]">
                      <strong className="text-orange-500">{label}</strong>{' '}{desc}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
              <p className="text-gray-500 italic text-sm">
                Additional selection criteria will be detailed in the full application call.
              </p>
            </motion.div>

            {/* Image */}
            <motion.div
              className="flex-shrink-0 w-full md:w-[220px] lg:w-[260px] mx-auto md:mx-0"
              variants={fadeRight}
              custom={0.15}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              whileHover={{ scale: 1.03, rotate: 0.5 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div className="relative">
                {/* Shadow card behind image */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-orange-100" />
                <img
                  src="https://res.cloudinary.com/dktr2wcto/image/upload/v1771576133/d4587261-fea6-4e58-8f59-0944bb727b67.png"
                  alt="Students applying to the programme"
                  className="relative w-full rounded-2xl shadow-lg object-cover"
                />
              </div>
            </motion.div>

          </div>
        </section>

        {/* ── APPLICATION TIMELINE ─────────────────────────────────────── */}
        <section
          className="relative py-20 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 50%, #ffedd5 100%)' }}
        >
          {/* Top fade edge from previous white section */}
          <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #ffffff, transparent)' }} />
          {/* Bottom fade edge into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #ffffff, transparent)' }} />
          {/* Soft orange glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-orange-200 opacity-30 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-orange-100 opacity-40 blur-2xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.p
              className="text-xs font-bold tracking-[0.2em] text-orange-500 uppercase mb-3"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Dates
            </motion.p>
            <motion.h3
              className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2"
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Application Timeline
            </motion.h3>
            <motion.div
              className="h-[3px] w-14 bg-orange-500 rounded-full mb-8"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              viewport={{ once: true }}
            />
            <motion.div
              className="space-y-5 text-gray-600 leading-relaxed max-w-3xl text-[15px]"
              variants={fadeUp}
              custom={0.2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p>
                The application period for the first edition of the{' '}
                <strong className="text-gray-900">MEDSOILS CHALLENGE</strong> Master will open soon.
              </p>
              <p>
                Subscribe to our newsletter and be the first to receive important updates about the{' '}
                <strong className="text-gray-900">MEDSOILS CHALLENGE</strong> Master.
                <br />
                We'll send you all the key information, including application deadlines, scholarship
                opportunities, events, and more.
              </p>
              <p className="font-semibold text-orange-500">
                → Don't miss your chance to join the next generation of soil experts.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── ERASMUS+ SCHOLARSHIPS ────────────────────────────────────── */}
        <section className="relative py-20 px-6 bg-white overflow-hidden">
          <DotGrid className="top-0 right-0 opacity-40" />
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.p
              className="text-xs font-bold tracking-[0.2em] text-orange-500 uppercase mb-3"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Funding
            </motion.p>
            <motion.h3
              className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2"
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Erasmus+ Scholarships
            </motion.h3>
            <motion.div
              className="h-[3px] w-14 bg-orange-500 rounded-full mb-8"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              viewport={{ once: true }}
            />
            <motion.div
              className="space-y-6 max-w-3xl"
              variants={fadeUp}
              custom={0.2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-gray-600 leading-relaxed text-[15px]">
                A limited number of{' '}
                <strong className="text-gray-900">Erasmus+ scholarships</strong> will be available to
                support the participation of the most outstanding candidates. These grants may cover:
              </p>
              <motion.ul
                className="space-y-3"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {['Tuition fees', 'Travel and installation costs', 'Monthly living allowance'].map(item => (
                  <motion.li key={item} variants={listItem} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <span className="text-gray-700 text-[15px]">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <p className="text-gray-500 italic text-sm">
                Further details about eligibility and conditions will be included in the official call
                for applications.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── CTA BUTTON ───────────────────────────────────────────────── */}
        <motion.section
          className="relative bg-gray-900 py-24 px-6 text-center overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9, ease }}
          viewport={{ once: true }}
        >
          {/* Glow blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-orange-500 opacity-10 blur-3xl" />
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-orange-700 opacity-10 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-orange-700 opacity-10 blur-2xl" />
          </div>

          {/* Badge */}
          <motion.span
            className="inline-block bg-orange-500/20 text-orange-400 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-orange-500/30 mb-6"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Open Applications
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-5 max-w-3xl mx-auto leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            viewport={{ once: true }}
          >
            Ready to join the{' '}
            <span className="text-orange-500">MEDSOILS CHALLENGE</span>{' '}
            Master?
          </motion.h2>

          <motion.p
            className="text-gray-400 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            viewport={{ once: true }}
          >
            Get in touch to register your interest or request more information. Our team will guide you through every step of the process.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            viewport={{ once: true }}
          >
            <Link
              to="/contact"
              state={{ enquiryType: { value: 'Application / Admission', label: 'Application / Admission' } }}
            >
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(249,115,22,0.55)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-12 py-5 rounded-full shadow-2xl transition-colors duration-200 relative overflow-hidden group"
              >
                <span className="relative z-10">Apply Now — Contact Us</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.section>

      </div>
      <Footer />
    </>
  )
}

export default Admission
