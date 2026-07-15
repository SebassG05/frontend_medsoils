import uexLogo from '../assets/partners/uex-logo.webp'

// ── Shared logos ──────────────────────────────────────────────────────────────
export const MEDSOILS_LOGO = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1771245130/Medsoil_Challenge_lrkqnt.webp'
export const TIMESIS_LOGO  = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1780475839/logo_timesis-HD-blu-nuovo_trasp_yxe3rj.png'
export const UNITUS_LOGO   = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1780476461/UNITUS_02-removebg-preview_jhxsds.png'
export const UL_LOGO       = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1780476741/Univerza_V_Ljubljani_FF-logoENG-VER-RGB_color_tesm3i.png'
export const EVENOR_LOGO   = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1780477178/evenor_english_cpz2wv.png'
export const ADYU_LOGO     = 'https://res.cloudinary.com/dktr2wcto/image/upload/v1780478970/Adiyaman_Universitesi__ADYU__Logosu_EN_Mavi-removebg-preview_yxtyiu.png'
export const UEX_LOGO      = uexLogo

// ── Partners list (used in About.jsx cards + PartnerDetail routing) ───────────
export const PARTNERS = [
  {
    id: 1,
    name: 'Timesis Srl',
    country: 'San Giuliano Terme, Pisa',
    logo: TIMESIS_LOGO,
    coordinator: true,
    slug: 'timesis',
    flagCode: 'it',
    coords: [43.751, 10.440],
  },
  {
    id: 2,
    name: 'Università degli Studi della Tuscia',
    country: 'Viterbo, Italy',
    logo: UNITUS_LOGO,
    slug: 'unitus',
    flagCode: 'it',
    coords: [42.416, 12.107],
  },
  {
    id: 3,
    name: 'Univerza v Ljubljani',
    country: 'Ljubljana, Slovenia',
    logo: UL_LOGO,
    slug: 'univerza-v-ljubljani',
    flagCode: 'si',
    coords: [46.056, 14.506],
  },
  {
    id: 4,
    name: 'Evenor-Tech, SLU',
    country: 'Sevilla, Spain',
    logo: EVENOR_LOGO,
    logoGap: 'gap-1',
    slug: 'evenor-tech',
    flagCode: 'es',
    coords: [37.383, -5.973],
  },
  {
    id: 5,
    name: 'Adiyaman University',
    country: 'Adıyaman, Türkiye',
    logo: ADYU_LOGO,
    slug: 'adiyaman',
    flagCode: 'tr',
    coords: [37.764, 38.279],
  },
  {
    id: 6,
    name: 'Universidad de Extremadura',
    country: 'Badajoz, Spain',
    logo: UEX_LOGO,
    logoGap: 'gap-2',
    slug: 'universidad-extremadura',
    flagCode: 'es',
    coords: [38.883, -7.007],
  },
]
