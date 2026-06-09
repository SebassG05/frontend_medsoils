import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Footer from '../components/layout/Footer'
import { PARTNERS } from '../data/partnersData'

// ── Custom map pin: teardrop with flag inside ─────────────────────────────────
const createPin = (flagCode, isActive = false) => {
  const S    = isActive ? 50 : 36
  const imgS = Math.round(S * 0.58)
  const wH   = Math.round(S * 1.42)
  const ancY = Math.round(S * 1.21)
  const grad = isActive
    ? 'linear-gradient(135deg,#fb923c 0%,#c2410c 100%)'
    : 'linear-gradient(135deg,#fdba74 0%,#ea580c 100%)'
  const shadow = isActive
    ? 'drop-shadow(0 6px 14px rgba(234,88,12,0.65))'
    : 'drop-shadow(0 3px 7px rgba(234,88,12,0.38))'

  return L.divIcon({
    html: `
      <div style="position:relative;width:${S}px;height:${wH}px;filter:${shadow}">
        <div style="
          position:absolute;top:0;left:0;
          width:${S}px;height:${S}px;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          background:${grad};
          display:flex;align-items:center;justify-content:center;
        ">
          <div style="
            transform:rotate(45deg);
            width:${imgS}px;height:${imgS}px;
            border-radius:50%;
            overflow:hidden;
            border:${isActive ? 3 : 2}px solid white;
          ">
            <img src="https://flagcdn.com/w40/${flagCode}.png"
                 style="width:100%;height:100%;object-fit:cover;display:block;" />
          </div>
        </div>
      </div>
    `,
    className: '',
    iconSize:    [S, wH],
    iconAnchor:  [S / 2, ancY],
    popupAnchor: [0, -ancY],
  })
}

// ── Auto-fit bounds to all partner coords ─────────────────────────────────────
function FitBounds({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords.length) {
      map.fitBounds(L.latLngBounds(coords), { padding: [50, 50], maxZoom: 7 })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

// ── Per-partner detail content ────────────────────────────────────────────────
const DETAIL = {
  timesis: {
    website: 'https://www.timesis.it',
    about:
      'Timesis Srl is an Italian SME based in San Giuliano Terme, near Pisa, specialising in environmental monitoring, consulting, and the design of innovative solutions for sustainable land and soil management. With over a decade of experience working at the intersection of environmental science and applied technology, Timesis bridges the gap between academic research and real-world field practice, serving public bodies, universities, and international organisations across Europe.',
    role:
      'As Project Coordinator, Timesis Srl leads the administrative and financial management of the MEDSOILS CHALLENGE consortium. The team oversees project planning, partner coordination, reporting to the European Education and Culture Executive Agency (EACEA), and the overall implementation of the programme\'s activities and deliverables. Timesis also leads dissemination and exploitation efforts to maximise the reach and impact of the project\'s results.',
  },

  unitus: {
    website: 'https://www.unitus.it',
    about:
      'The Università degli Studi della Tuscia (UNITUS) is a public research university located in Viterbo, central Italy. Its Department of Agriculture and Forest Sciences (DAFNE) is internationally recognised for cutting-edge research in soil science, agri-environmental management, and sustainable land use. UNITUS combines rigorous scientific investigation with a strong commitment to applied and interdisciplinary training.',
    role:
      'UNITUS contributes academic leadership in soil science and sustainable agriculture to the MEDSOILS CHALLENGE programme. The institution is responsible for designing and delivering core curriculum modules on soil processes, degradation, and remediation strategies. It also hosts the final mobility week in Viterbo (September 2027), where students defend their dissertations and participate in the closing international conference.',
  },

  'univerza-v-ljubljani': {
    website: 'https://www.uni-lj.si',
    about:
      'Univerza v Ljubljani (UL) is Slovenia\'s largest and oldest university, with a distinguished faculty across natural, social, and applied sciences. Its expertise in environmental governance, soil policy, and sustainable land management has made it a key voice in European discussions on soil protection. The university maintains active research partnerships with institutions across Europe and beyond.',
    role:
      'UL leads the soil governance and policy modules within the MEDSOILS CHALLENGE curriculum, drawing on its expertise in European environmental legislation and sustainable management frameworks. The Ljubljana team hosts the third mobility week (March 2027), where students engage with policymakers, conduct applied case studies, and explore land governance in the Slovenian context.',
  },

  'evenor-tech': {
    website: 'https://www.evenor-tech.com',
    about:
      'Evenor-Tech, SLU is a Spanish environmental technology company based in Sevilla, specialising in the development of innovative tools and methodologies for agro-environmental assessment, remote sensing, and precision land management. The company works closely with research centres, public administrations, and private clients to translate scientific knowledge into operational environmental solutions.',
    role:
      'Evenor-Tech leads the technology and field methodology component of the MEDSOILS CHALLENGE programme. The company contributes practical training in remote sensing, soil sampling techniques, agro-environmental indicators, and geospatial data analysis. It also hosts the second mobility week (January–February 2027) in the Cáceres/Sevilla region, where students conduct real-world farm visits and soil lab analyses.',
  },

  adiyaman: {
    website: 'https://adiyaman.edu.tr/en',
    about:
      'Adıyaman University is a Turkish state university located in Adıyaman, a province in the south-east of Türkiye characterised by diverse Mediterranean and semi-arid soil landscapes. The university\'s faculty combines expertise in soil physics, land degradation, erosion dynamics, and sustainable agricultural practices, with strong ties to the local rural communities and farming sector.',
    role:
      'Adıyaman University hosts the first mobility week of the MEDSOILS CHALLENGE programme (October 2026), providing students with direct exposure to soil challenges typical of the eastern Mediterranean climate zone. The team leads hands-on fieldwork sessions covering erosion assessment, soil sampling methodologies, and data collection in rural and agricultural settings, offering a unique perspective on dryland soil management.',
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
        <section className="relative py-20 pb-28 px-6 bg-white">
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

        {/* ── MAP ─────────────────────────────────────────────────────── */}
        <section className="relative px-6 pb-24 bg-white">

          {/* Bottom orb */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)' }} />

          <div className="max-w-6xl mx-auto relative z-10">

            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            >
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-orange-500 uppercase">Location</span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.65, ease, delay: 0.05 }}
            >
              Where in the <span className="text-orange-500">Mediterranean</span>
            </motion.h2>

            <motion.p
              className="text-gray-400 text-sm mb-8 max-w-md"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, ease, delay: 0.15 }}
            >
              The highlighted pin marks this institution. All consortium partners are shown.
            </motion.p>

            <motion.div
              className="rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              style={{ height: 440 }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease, delay: 0.1 }}
            >
              <MapContainer
                center={[40, 18]}
                zoom={5}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={false}
                zoomControl={true}
                maxBounds={[[18, -22], [60, 58]]}
                maxBoundsViscosity={0.85}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  subdomains="abcd"
                  maxZoom={18}
                />
                <FitBounds coords={PARTNERS.map(p => p.coords)} />
                {PARTNERS.map(p => (
                  <Marker
                    key={p.slug}
                    position={p.coords}
                    icon={createPin(p.flagCode, p.slug === slug)}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'inherit', minWidth: 140 }}>
                        <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{p.name}</p>
                        <p style={{ color: '#f97316', fontSize: 12, margin: 0 }}>{p.country}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>

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
