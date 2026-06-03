import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/layout/Footer'
import { PARTNERS } from '../data/partnersData'

// ── Per-partner detail content ────────────────────────────────────────────────
// TODO: Replace placeholder text, team names and roles with real information.
const DETAIL = {
  timesis: {
    website: 'https://www.timesis.it',
    about:
      'Timesis Srl is an Italian SME based in San Giuliano Terme, near Pisa, specialising in environmental monitoring, consulting, and the design of innovative solutions for sustainable land and soil management. With over a decade of experience working at the intersection of environmental science and applied technology, Timesis bridges the gap between academic research and real-world field practice, serving public bodies, universities, and international organisations across Europe.',
    role:
      'As Project Coordinator, Timesis Srl leads the administrative and financial management of the MEDSOILS CHALLENGE consortium. The team oversees project planning, partner coordination, reporting to the European Education and Culture Executive Agency (EACEA), and the overall implementation of the programme\'s activities and deliverables. Timesis also leads dissemination and exploitation efforts to maximise the reach and impact of the project\'s results.',
    team: [
      // TODO: Replace with actual team members
      { name: 'Name Surname', role: 'Project Coordinator', initials: 'NS' },
      { name: 'Name Surname', role: 'Financial Manager', initials: 'NS' },
      { name: 'Name Surname', role: 'Dissemination & Communication', initials: 'NS' },
    ],
  },

  unitus: {
    website: 'https://www.unitus.it',
    about:
      'The Università degli Studi della Tuscia (UNITUS) is a public research university located in Viterbo, central Italy. Its Department of Agriculture and Forest Sciences (DAFNE) is internationally recognised for cutting-edge research in soil science, agri-environmental management, and sustainable land use. UNITUS combines rigorous scientific investigation with a strong commitment to applied and interdisciplinary training.',
    role:
      'UNITUS contributes academic leadership in soil science and sustainable agriculture to the MEDSOILS CHALLENGE programme. The institution is responsible for designing and delivering core curriculum modules on soil processes, degradation, and remediation strategies. It also hosts the final mobility week in Viterbo (September 2027), where students defend their dissertations and participate in the closing international conference.',
    team: [
      // TODO: Replace with actual team members
      { name: 'Name Surname', role: 'Principal Investigator', initials: 'NS' },
      { name: 'Name Surname', role: 'Academic Supervisor', initials: 'NS' },
      { name: 'Name Surname', role: 'Research Associate', initials: 'NS' },
    ],
  },

  'univerza-v-ljubljani': {
    website: 'https://www.uni-lj.si',
    about:
      'Univerza v Ljubljani (UL) is Slovenia\'s largest and oldest university, with a distinguished faculty across natural, social, and applied sciences. Its expertise in environmental governance, soil policy, and sustainable land management has made it a key voice in European discussions on soil protection. The university maintains active research partnerships with institutions across Europe and beyond.',
    role:
      'UL leads the soil governance and policy modules within the MEDSOILS CHALLENGE curriculum, drawing on its expertise in European environmental legislation and sustainable management frameworks. The Ljubljana team hosts the third mobility week (March 2027), where students engage with policymakers, conduct applied case studies, and explore land governance in the Slovenian context.',
    team: [
      // TODO: Replace with actual team members
      { name: 'Name Surname', role: 'Principal Investigator', initials: 'NS' },
      { name: 'Name Surname', role: 'Research Coordinator', initials: 'NS' },
      { name: 'Name Surname', role: 'Field Research Lead', initials: 'NS' },
    ],
  },

  'evenor-tech': {
    website: 'https://www.evenor-tech.com',
    about:
      'Evenor-Tech, SLU is a Spanish environmental technology company based in Sevilla, specialising in the development of innovative tools and methodologies for agro-environmental assessment, remote sensing, and precision land management. The company works closely with research centres, public administrations, and private clients to translate scientific knowledge into operational environmental solutions.',
    role:
      'Evenor-Tech leads the technology and field methodology component of the MEDSOILS CHALLENGE programme. The company contributes practical training in remote sensing, soil sampling techniques, agro-environmental indicators, and geospatial data analysis. It also hosts the second mobility week (January–February 2027) in the Cáceres/Sevilla region, where students conduct real-world farm visits and soil lab analyses.',
    team: [
      // TODO: Replace with actual team members
      { name: 'Name Surname', role: 'Technical Lead', initials: 'NS' },
      { name: 'Name Surname', role: 'Environmental Specialist', initials: 'NS' },
      { name: 'Name Surname', role: 'GIS & Data Analyst', initials: 'NS' },
    ],
  },

  adiyaman: {
    website: 'https://www.adiyaman.edu.tr',
    about:
      'Adıyaman University is a Turkish state university located in Adıyaman, a province in the south-east of Türkiye characterised by diverse Mediterranean and semi-arid soil landscapes. The university\'s faculty combines expertise in soil physics, land degradation, erosion dynamics, and sustainable agricultural practices, with strong ties to the local rural communities and farming sector.',
    role:
      'Adıyaman University hosts the first mobility week of the MEDSOILS CHALLENGE programme (October 2026), providing students with direct exposure to soil challenges typical of the eastern Mediterranean climate zone. The team leads hands-on fieldwork sessions covering erosion assessment, soil sampling methodologies, and data collection in rural and agricultural settings, offering a unique perspective on dryland soil management.',
    team: [
      // TODO: Replace with actual team members
      { name: 'Name Surname', role: 'Principal Investigator', initials: 'NS' },
      { name: 'Name Surname', role: 'Research Coordinator', initials: 'NS' },
      { name: 'Name Surname', role: 'Field Research Assistant', initials: 'NS' },
    ],
  },
}

// ── Animations ────────────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease, delay },
})

// ── Component ─────────────────────────────────────────────────────────────────
const PartnerDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const partner = PARTNERS.find(p => p.slug === slug)
  const detail  = DETAIL[slug]

  if (!partner || !detail) {
    navigate('/about', { replace: true })
    return null
  }

  return (
    <>
      <div className="min-h-screen bg-white overflow-hidden">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-20 px-6"
          style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 60%, #ffffff 100%)' }}
        >
          {/* Orbs */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)' }} />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 65%)' }} />

          <div className="relative z-10 max-w-6xl mx-auto">

            {/* Back button */}
            <motion.button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 text-sm text-orange-500 font-semibold mb-10 hover:gap-3 transition-all"
              {...fadeUp(0)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Our Partners
            </motion.button>

            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">

              {/* Logo card */}
              <motion.div
                {...fadeUp(0.1)}
                className="flex-shrink-0 w-48 h-48 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center p-6"
              >
                <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
              </motion.div>

              {/* Info */}
              <div>
                {/* Badge row */}
                <motion.div {...fadeUp(0.15)} className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-orange-500" />
                  <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">
                    MEDSOILS Partner
                  </span>
                  {partner.coordinator && (
                    <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      ★ Project Coordinator
                    </span>
                  )}
                </motion.div>

                {/* Name */}
                <motion.h1
                  {...fadeUp(0.2)}
                  className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3"
                >
                  {partner.name}
                </motion.h1>

                {/* Country + flag */}
                <motion.div {...fadeUp(0.25)} className="flex items-center gap-2 mb-5">
                  <img
                    src={`https://flagcdn.com/w40/${partner.flagCode}.png`}
                    srcSet={`https://flagcdn.com/w80/${partner.flagCode}.png 2x`}
                    width="22" height="15"
                    alt={partner.country}
                    className="rounded-sm shadow-sm object-cover"
                  />
                  <span className="text-gray-500 text-base font-medium">{partner.country}</span>
                </motion.div>

                {/* Underline + website */}
                <motion.div {...fadeUp(0.3)} className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <span className="h-1 w-10 rounded-full bg-orange-500" />
                    <span className="h-1 w-4 rounded-full bg-orange-300" />
                  </div>
                  <a
                    href={detail.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-500 font-semibold underline underline-offset-2 hover:text-orange-600 transition-colors"
                  >
                    {detail.website.replace('https://', '')} ↗
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT + ROLE ─────────────────────────────────────────────── */}
        <section className="relative py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* About the institution */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease }}
              className="rounded-2xl border border-gray-100 shadow-sm p-8 relative overflow-hidden"
            >
              <div className="absolute left-0 top-6 bottom-6 w-1 bg-orange-500 rounded-r-full" />
              <span className="text-[10px] font-bold tracking-[0.22em] text-orange-500 uppercase mb-3 block">
                About the Institution
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Who they are</h2>
              <p className="text-gray-600 leading-relaxed text-[16px] text-justify">{detail.about}</p>
            </motion.div>

            {/* Role in the project */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease, delay: 0.1 }}
              className="rounded-2xl border border-gray-100 shadow-sm p-8 relative overflow-hidden"
            >
              <div className="absolute left-0 top-6 bottom-6 w-1 bg-orange-300 rounded-r-full" />
              <span className="text-[10px] font-bold tracking-[0.22em] text-orange-500 uppercase mb-3 block">
                Role in MEDSOILS CHALLENGE
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Their contribution</h2>
              <p className="text-gray-600 leading-relaxed text-[16px] text-justify">{detail.role}</p>
            </motion.div>
          </div>
        </section>

        {/* ── TEAM ─────────────────────────────────────────────────────── */}
        <section className="relative pb-24 pt-4 px-6 bg-white">

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)' }} />

          <div className="max-w-6xl mx-auto relative z-10">

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">People</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease, delay: 0.05 }}
              className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10"
            >
              Team <span className="text-orange-500">Members</span>
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {detail.team.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {member.initials}
                  </div>
                  {/* Info */}
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{member.name}</p>
                    <p className="text-orange-500 text-xs font-medium mt-0.5">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>
      </div>

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

export default PartnerDetail
