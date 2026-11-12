/**
 * FICTIONAL worst-case interviews (dev only): ?demo=interviews&n=worst.
 * Realistic values that break layouts built against kind data — long and
 * non-Latin names, missing optional fields, a 404 photo, many tags, an hour-long
 * duration. Keep it: it is the regression set for the cards and detail page.
 */

const YT = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'
const QA = [
  { speaker: 'interviewer', text: 'How did the project start?' },
  { speaker: 'interviewee', text: 'With a question nobody in our department could answer: why do two neighbouring olive groves, on the same parent rock and with the same rainfall, end up with soils that behave completely differently after a storm? '.repeat(3).trim() },
]

export default [
  {
    slug: 'vietnamese-name-hour-long-video',
    title: 'Từ đồng bằng sông Cửu Long đến Địa Trung Hải: what deltas teach us about salinisation',
    type: 'video',
    interviewee: { name: 'Đặng Thị Ngọc Hân', role: 'Senior Product Design Engineer, Platform Infrastructure', institution: 'Vietnam Academy of Agricultural Sciences — Soils and Fertilizers Research Institute' },
    date: '2026-12-31',
    duration: 3725,
    language: 'vi',
    cover: { src: 'adiyaman/dia-1/p14', alt: 'Tall portrait photo used as a cover', color: '#4e3419', width: 1600, height: 2400 },
    summary: 'An hour-long conversation whose title mixes Vietnamese and English and whose interviewee has stacked diacritics.',
    quote: 'Salt moves with water, and water moves with everything we do upstream — the delta remembers decisions made a thousand kilometres away, decades ago, by people who never saw it.',
    mediaUrl: YT,
    transcript: QA,
    tags: ['salinisation', 'deltas', 'climate', 'irrigation', 'water-policy', 'remote-sensing', 'customer-feedback-from-enterprise-onboarding', 'field-work', 'education', 'q3', 'needs-review', 'mediterranean'],
    featured: true,
  },
  {
    slug: 'two-letter-name-no-photo',
    title: 'Jo',
    type: 'audio',
    interviewee: { name: 'Jo', role: 'Intern', institution: 'IRD' },
    date: '2026-12-30',
    duration: 1,
    language: 'en',
    cover: { alt: 'Plain colour block', color: '#2a150a' },
    summary: 'Shortest realistic everything: two-letter title and name, a one-second clip.',
    mediaUrl: 'https://cdn.example.org/medsoils/jo.mp3',
  },
  {
    slug: 'photo-that-404s',
    title: 'María José de la Cruz y Fernández on terraces, tradition and the long memory of Andalusian hillsides',
    type: 'text',
    interviewee: { name: 'María José de la Cruz y Fernández', role: 'Investigadora', institution: 'CSIC', photo: { src: 'interviews/does-not-exist', alt: 'Portrait of María José de la Cruz y Fernández' } },
    date: '2026-12-29',
    language: 'es',
    cover: { src: 'interviews/also-missing', alt: 'Cover image that fails to load', color: '#805a35', width: 1600, height: 900 },
    summary: 'Avatar and cover URLs that 404; long Spanish name with lowercase particles.',
    transcript: QA,
  },
  {
    slug: 'cjk-name',
    title: '黄土高原的水土保持：三十年的经验',
    type: 'video',
    interviewee: { name: '王秀英', role: '研究员', institution: '中国科学院水利部水土保持研究所' },
    date: '2026-12-28',
    duration: 59,
    language: 'zh',
    cover: { alt: 'Loess terraces', color: '#7b613f' },
    summary: 'CJK title and name without spaces.',
    mediaUrl: YT,
    tags: ['水土保持'],
  },
  {
    slug: 'rtl-name',
    title: 'Soil, water and memory in the Nile Delta',
    type: 'audio',
    interviewee: { name: 'نور الهدى عبد الرحمن', role: 'Assistant Professor', institution: 'جامعة القاهرة — Cairo University' },
    date: '2026-12-27',
    duration: 2701,
    language: 'ar',
    cover: { src: 'adiyaman/dia-1/p05', alt: 'Irrigated fields', color: '#7b613f', width: 1600, height: 900 },
    summary: 'Arabic (RTL) name and institution inside an English page.',
    mediaUrl: YT,
  },
  {
    slug: 'apostrophe-and-markup-like-title',
    title: 'Seán O’Brien-Ó Súilleabháin: “<b>Peat</b> is not dirt” & other things I keep repeating',
    type: 'text',
    interviewee: { name: 'Seán O’Brien-Ó Súilleabháin', role: 'Peatland ecologist', institution: 'University College Dublin' },
    date: '2026-12-26',
    language: 'en',
    cover: { src: 'adiyaman/dia-1/p20', alt: 'Peat bog', color: '#805a35', width: 1600, height: 1068 },
    summary: 'Apostrophes, curly quotes, an ampersand and markup-looking text that must render literally.',
    transcript: [{ speaker: 'interviewer', text: 'Line one\nLine two (newline inside a single turn)' }, { speaker: 'interviewee', text: 'Short.' }],
  },
]
