/**
 * Every user-facing string of the Dissemination section. The site is in
 * English (COPY). COPY_ES is prepared with the same keys so it can move into
 * an i18n catalogue later; it is not wired to anything yet.
 */

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

export const COPY = {
  nav: { label: 'Dissemination' },

  hero: {
    eyebrow: 'Outreach & Media',
    highlight: 'Dissemination',
    title: '& Interviews',
    intro: 'Conversations with the researchers and partners behind MEDSOILS Challenge — on video, audio and in writing.',
    searchPlaceholder: 'Search interviews or people…',
    searchLabel: 'Search interviews',
  },

  filters: {
    label: 'Filter by format',
    all: 'All',
    video: 'Video',
    audio: 'Audio',
    text: 'Text',
    language: 'Language',
    allLanguages: 'All languages',
    results: n => plural(n, 'interview', 'interviews'),
    clear: 'Clear filters',
  },

  types: { video: 'Video', audio: 'Audio', text: 'Text' },

  featured: {
    eyebrow: type => `Featured interview · ${COPY.types[type]}`,
    cta: { video: 'Watch interview', audio: 'Listen to interview', text: 'Read interview' },
  },

  card: {
    cta: { video: 'Watch', audio: 'Listen', text: 'Read' },
    readTime: min => `${min} min read`,
  },

  list: { heading: 'All interviews' },

  empty: {
    title: 'The first interviews are on their way',
    body: 'We’re recording conversations with the people behind MEDSOILS Challenge. Meanwhile, explore our field trips and articles.',
    resources: 'Explore resources',
    blog: 'Read the blog',
  },

  noResults: {
    title: q => (q ? `No interviews match “${q}”.` : 'No interviews match these filters.'),
    clear: 'Clear filters',
  },

  loading: 'Loading interviews',

  error: {
    title: 'We couldn’t load the interviews.',
    retry: 'Try again',
  },

  detail: {
    breadcrumbLabel: 'Breadcrumb',
    breadcrumb: 'Dissemination',
    transcript: 'Transcript',
    showTranscript: 'Show transcript',
    related: 'More interviews',
    share: 'Share',
    copyLink: 'Copy link',
    copied: 'Link copied',
    interviewer: 'Interviewer',
    notFoundTitle: 'Interview not found',
    notFoundBody: 'This interview doesn’t exist or has been moved.',
    notFoundCta: 'Back to Dissemination',
  },

  player: {
    play: title => `Play video: ${title}`,
    playAudio: title => `Play audio: ${title}`,
    notice: 'Plays from YouTube (youtube-nocookie.com).',
    audioFallback: 'Your browser can’t play this audio.',
  },

  meta: {
    title: 'Dissemination & Interviews',
    description: 'Interviews with the researchers and partners behind MEDSOILS Challenge — on video, audio and in writing.',
  },
}

export const COPY_ES = {
  nav: { label: 'Difusión' },
  hero: {
    eyebrow: 'Divulgación y medios',
    highlight: 'Difusión',
    title: 'y entrevistas',
    intro: 'Conversaciones con los investigadores y socios de MEDSOILS Challenge, en vídeo, audio y texto.',
    searchPlaceholder: 'Busca entrevistas o personas…',
    searchLabel: 'Buscar entrevistas',
  },
  filters: {
    label: 'Filtrar por formato',
    all: 'Todas',
    video: 'Vídeo',
    audio: 'Audio',
    text: 'Texto',
    language: 'Idioma',
    allLanguages: 'Todos los idiomas',
    results: n => plural(n, 'entrevista', 'entrevistas'),
    clear: 'Quitar filtros',
  },
  types: { video: 'Vídeo', audio: 'Audio', text: 'Texto' },
  featured: {
    eyebrow: type => `Entrevista destacada · ${COPY_ES.types[type]}`,
    cta: { video: 'Ver entrevista', audio: 'Escuchar entrevista', text: 'Leer entrevista' },
  },
  card: {
    cta: { video: 'Ver', audio: 'Escuchar', text: 'Leer' },
    readTime: min => `${min} min de lectura`,
  },
  list: { heading: 'Todas las entrevistas' },
  empty: {
    title: 'Pronto publicaremos las primeras entrevistas',
    body: 'Estamos grabando conversaciones con las personas que hacen MEDSOILS Challenge. Mientras tanto, descubre nuestras salidas de campo y artículos.',
    resources: 'Ver recursos',
    blog: 'Leer el blog',
  },
  noResults: {
    title: q => (q ? `Ninguna entrevista coincide con «${q}».` : 'Ninguna entrevista coincide con estos filtros.'),
    clear: 'Quitar filtros',
  },
  loading: 'Cargando entrevistas',
  error: {
    title: 'No hemos podido cargar las entrevistas.',
    retry: 'Reintentar',
  },
  detail: {
    breadcrumbLabel: 'Migas de pan',
    breadcrumb: 'Difusión',
    transcript: 'Transcripción',
    showTranscript: 'Ver transcripción',
    related: 'Más entrevistas',
    share: 'Compartir',
    copyLink: 'Copiar enlace',
    copied: 'Enlace copiado',
    interviewer: 'Entrevistador',
    notFoundTitle: 'Entrevista no encontrada',
    notFoundBody: 'Esta entrevista no existe o se ha movido.',
    notFoundCta: 'Volver a Difusión',
  },
  player: {
    play: title => `Reproducir vídeo: ${title}`,
    playAudio: title => `Reproducir audio: ${title}`,
    notice: 'Se reproduce desde YouTube (youtube-nocookie.com).',
    audioFallback: 'Tu navegador no puede reproducir este audio.',
  },
  meta: {
    title: 'Difusión y entrevistas',
    description: 'Entrevistas con los investigadores y socios de MEDSOILS Challenge, en vídeo, audio y texto.',
  },
}
