# Apartado "Dissemination" (entrevistas) — diseño

Fecha: 2026-11-12 · Rama: `feature/dissemination` · Boceto: Figma, sección "MEDSOILS — Diseminación (boceto)" (node 53:439), variante **A · Editorial**.

## Objetivo

Crear el apartado donde se publicarán las entrevistas del proyecto (vídeo, audio o texto). En esta fase solo existe la estructura: menú, rutas, modelo de datos, estados (vacío, carga, error, sin resultados), listado y detalle. Las entrevistas reales llegan después y añadir una debe consistir en añadir un objeto a un archivo.

Criterios de éxito:

- `/dissemination` muestra hoy el estado vacío; con `?demo=interviews&n=1|4|12` (solo en desarrollo) muestra 1, 4 o 12 entrevistas ficticias.
- `/dissemination/:slug` funciona con recarga, botón atrás y migas de pan.
- Ninguna fixture llega al build de producción (comprobado con grep sobre `dist/`).
- Header correcto a 1024, 1280, 1440 y 1920 px y en el menú móvil.
- Lighthouse en `/dissemination`: CLS 0, accesibilidad ≥ 95.

Fuera de alcance: backend, CMS, comentarios, i18n real (los textos en español se dejan preparados, no conectados).

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Variante visual | A · Editorial: destacada partida 7/12 + 5/12, rejilla de 3 columnas con el texto bajo la portada |
| Alojamiento | Vídeos en YouTube (ocultos). Fachada ligera; iframe `youtube-nocookie.com` solo tras pulsar |
| Consentimiento | El clic en "play" cuenta como consentimiento para ese vídeo, con el aviso visible "Plays from YouTube" bajo el reproductor. No se carga nada de YouTube antes del clic, salvo la miniatura de `i.ytimg.com` |
| Datos | Archivo local en `src/data/dissemination/` (misma convención que `src/data/collections/`), no backend |
| Validación | Validador propio en JS, solo en `import.meta.env.DEV`; sin dependencia nueva |
| Textos | Inglés en la web. Español preparado en el mismo `copy.js` (menú: "Difusión") |
| Header | Hueco escalonado `lg:gap-x-6 xl:gap-x-8 2xl:gap-x-12`. Si a 1024 no cabe, el menú de escritorio empieza en `xl` |
| Reutilización | Se extraen de Resources `PageHero`, `SearchField` y `FilterChips` (marcado idéntico, sin cambiar la lógica de Resources) |
| Transición listado → detalle | Motion `layoutId` + `LayoutGroup` + `AnimatePresence mode="popLayout"`, como en `ResourcesSection` |
| Contraste | Eyebrow en `orange-700` y palabra destacada del titular en `orange-600`, también en Resources (hoy `orange-500` no llega a AA sobre el celeste) |
| SEO / Open Graph | Meta en cliente (`usePageMeta`) + HTML estático por entrevista generado en el build para que WhatsApp/LinkedIn lean OG |
| Tests | Se añade `vitest` (devDependency) solo para la lógica pura: validador, selectores, parser de YouTube |

## Arquitectura

### Rutas

- `App.jsx`: `const DisseminationSection = lazy(() => import('./pages/DisseminationSection'))`, ruta `/dissemination/*` dentro de `Suspense` con el skeleton del listado como fallback y un `ErrorBoundary` con reintento (fallo al cargar el chunk).
- `ScrollToTop` también deja pasar las transiciones internas de la sección (`isDisseminationSectionPath`), igual que con Resources.
- `DisseminationSection.jsx`: `MotionConfig reducedMotion="user"` + `LayoutGroup id="dissemination"` + `AnimatePresence mode="popLayout"`, con rutas `index` → `Dissemination` y `:slug` → `InterviewPage`.
- El scroll animado y la restauración al volver, hoy privados en `ResourcesSection`, se extraen a `src/hooks/useSectionScroll.js` (parámetro: clave de `sessionStorage`) y lo usan ambas secciones. La lógica no cambia.

### Datos (`src/data/dissemination/`)

```
interviews.js        export const INTERVIEWS = []   ← único origen de datos
schema.js            JSDoc typedef + validateInterviews() (solo DEV)
copy.js              COPY (en) y COPY_ES (preparado, sin usar)
index.js             loadInterviews(), selectores y layoutIds
__fixtures__/        interviews-1.js, interviews-4.js, interviews-12.js
```

Campos de una entrevista:

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `slug` | string kebab-case | sí | único; URL `/dissemination/<slug>` |
| `title` | string | sí | |
| `type` | `'video' \| 'audio' \| 'text'` | sí | |
| `interviewee` | `{ name, role, institution, country?, photo?: { src, alt } }` | sí (`photo` opcional) | sin foto se muestran las iniciales |
| `date` | ISO `YYYY-MM-DD` | sí | |
| `duration` | número (segundos) | no | en texto se calcula el tiempo de lectura de la transcripción |
| `language` | ISO 639-1 (`en`, `es`, `tr`…) | sí | |
| `cover` | `{ src?, alt, color, width?, height? }` | sí (`alt`, `color`) | sin `src` en vídeo se usa la miniatura de YouTube |
| `summary` | string | sí | meta description y tarjeta |
| `quote` | string | no | destacada y cabecera del detalle |
| `mediaUrl` | string | sí en vídeo y audio | YouTube (cualquier formato de enlace) o URL directa de audio |
| `captions` | `[{ src, srclang, label }]` | no | solo para `<audio>`/`<video>` propios; YouTube trae los suyos |
| `transcript` | `[{ speaker: 'interviewer' \| 'interviewee', text }]` | sí en texto | en vídeo y audio es opcional y plegable |
| `tags` | string[] | no | |
| `featured` | boolean | no | si ninguna lo es, la destacada es la más reciente |

- `validateInterviews(list)` se ejecuta al cargar, dentro de `if (import.meta.env.DEV)`. Lanza un error claro, por ejemplo `interview "x": cover.alt is required`, si falta un campo, hay slugs duplicados, la fecha no es ISO, el tipo no existe, `mediaUrl` no es un enlace de YouTube válido en un vídeo o falta `transcript` en un texto. En producción el bloque desaparece del bundle.
- `loadInterviews(searchParams)` es asíncrono. En DEV, con `?demo=interviews`, hace `import()` de la fixture indicada por `n` (por defecto 12); si no, devuelve `INTERVIEWS`. La condición `import.meta.env.DEV` hace que Vite elimine el `import()` en producción y no emita esos chunks.
- Selectores puros: `sortByDate`, `pickFeatured`, `filterInterviews({ q, type, lang })` (busca en título, nombre, institución, etiquetas y resumen, sin distinguir mayúsculas ni acentos), `availableLanguages`, `getBySlug`, `related(slug, n = 3)` (mismo tipo o mismas etiquetas, luego las más recientes).
- `src/utils/youtube.js`: `parseYouTubeId(url)` (acepta `watch?v=`, `youtu.be/`, `embed/`, `shorts/`) y `youtubeThumb(id)` (WebP + JPEG de `i.ytimg.com`).

### Componentes

Compartidos (extraídos de Resources, en `src/components/shared/`):

- `PageHero` (eyebrow, titular con una palabra destacada, texto, hijo opcional para el buscador, ola inferior y entrada escalonada).
- `SearchField` (input controlado con icono, botón de borrar y `aria-label`).
- `FilterChips` (grupo de botones `aria-pressed` con conteos opcionales y scroll horizontal en móvil).
- `Breadcrumbs` (ya existente) recibe `label` por prop en lugar de leer el copy de collections.

Propios (`src/components/dissemination/`):

- `FeaturedInterview`: bloque editorial; un único `<a>` que envuelve todo y el CTA es solo visual.
- `InterviewCard`: un único `<a>`; portada 16:9 con `layoutId`, badge de tipo, duración, título (h3), entrevistado y fecha.
- `InterviewGrid`: rejilla con `layout` + `AnimatePresence mode="popLayout"` para reordenar al filtrar.
- `InterviewFilters`: chips de tipo, select de idioma (solo si hay ≥ 2 idiomas) y contador con `aria-live="polite"`.
- `EmptyState`: tarjetas fantasma (decorativas, `aria-hidden`), h2, texto y enlaces a Resources y Blog. Versión "sin resultados" con botón "Clear filters".
- `InterviewSkeleton`: misma forma que la tarjeta.
- Detalle: `InterviewHeader` (la caja del reproductor o portada lleva el mismo `layoutId` que la portada de la tarjeta, así la tarjeta crece hasta el reproductor; título y metadatos debajo, no encima de la imagen), `YouTubeFacade`, `AudioPlayer` (`<audio controls preload="none">` nativo con pistas `<track>`; si `mediaUrl` es de YouTube, la fachada con badge de audio), `TranscriptQA` (preguntas y respuestas diferenciadas; plegable con `<details>` salvo en texto), `ShareActions` (copiar enlace + `navigator.share` si existe) y `RelatedInterviews`.

Páginas: `Dissemination.jsx` (listado) e `InterviewPage.jsx` (detalle; slug inexistente → `NotFoundPanel` reutilizado).

### Estado en la URL

`useSearchParams`: `q`, `type` (`video|audio|text`), `lang`. La búsqueda se escribe con `replace: true` y un debounce de 250 ms; los chips con `replace: false`, para que "atrás" deshaga el filtro. Los valores desconocidos se ignoran.

## Movimiento

Siempre con los tokens de `src/utils/motion.js` / `--motion-*`, y animando solo `transform` y `opacity`.

- Hero: `fadeRise` escalonado (eyebrow, titular, texto, buscador).
- Tarjetas: entran escalonadas con `whileInView` (desplazamiento de 10 px, `STAGGER`), con `revealOnce` para que no se repita al volver.
- Hover solo con `@media (hover: hover) and (pointer: fine)`: elevación (`shadow-card-hover` + `translateY(-2px)`), portada `scale(1.03)` en `--motion-cover` y flecha `translateX(2px)`. En táctil, solo `active:scale-[0.98]`.
- Listado → detalle: `layoutId` de la portada con `SPRING.layout`; el resto entra después con `AFTER_MORPH`.
- Filtros: `layout` en las tarjetas, interrumpible.
- `prefers-reduced-motion`: fundidos de `DURATION.fast`, sin escala ni desplazamiento, morph con `duration: 0` (`layoutTransition`).

## SEO

- `src/utils/usePageMeta.js`, sucesor de `usePageTitle`: title, meta description, canonical, `og:*`, `twitter:card` y un `<script type="application/ld+json">`. Todo se restaura al salir.
- Detalle en vídeo → `VideoObject` (name, description, thumbnailUrl, uploadDate, duration ISO 8601, embedUrl). En audio o texto → `Article` (headline, author = entrevistado, datePublished, image).
- Build: un plugin de Vite (`scripts/vite-dissemination-pages.js`, hook `closeBundle`) lee `INTERVIEWS` y escribe `dist/dissemination/index.html` y `dist/dissemination/<slug>/index.html`: copias de `dist/index.html` con title, description, OG y JSON-LD inyectados. La SPA arranca igual encima.
- **Supuesto a verificar en el servidor:** Nginx usa `try_files $uri $uri/ /index.html`, de modo que sirve esos HTML. Si no es así, hay que añadir esa línea; sin ella el apartado funciona igual, pero sin previsualización al compartir.

## Accesibilidad

- h1 único por página; h2 por bloque (destacada, "All interviews" y vacío); h3 en las tarjetas.
- Cada tarjeta es un único enlace con nombre accesible = título; el resto del texto queda dentro sin enlaces anidados.
- Foco visible (`ring-2 ring-orange-400 ring-offset-2`) en menú, chips, tarjetas, fachada, reproductor y botones.
- Contraste AA: texto siempre fuera de la portada (variante A); las etiquetas sobre la portada (tipo y duración) van en pastillas opacas.
- `alt` desde los datos; las tarjetas fantasma y los iconos son decorativos (`alt=""` / `aria-hidden`).
- Fachada de YouTube: `<button>` con nombre "Play video: {title}"; el iframe lleva `title`.
- Móvil (360–390): una columna; chips con `overflow-x-auto` y `scroll-snap`; nada desborda (se comprueba con nombres e instituciones largos).

## Rendimiento

- Ruta cargada en diferido; la home no carga nada de este apartado.
- Portadas propias: `MediaImage` (AVIF/WebP, `srcset`, `sizes`, `loading="lazy"`, `decoding="async"`, color dominante). Miniaturas de YouTube: `<picture>` WebP → JPEG con `aspect-ratio: 16/9` reservado y el color de `cover.color`.
- La destacada usa `priority` (posible LCP).
- Iframe solo tras pulsar; `preconnect` a `youtube-nocookie.com` en `pointerenter`/`focus` de la fachada.

## Errores y estados

- Cargando (chunk o fixture): `InterviewSkeleton` × 6 y un bloque de destacada en esqueleto.
- Error al cargar el chunk: `ErrorBoundary` con "We couldn't load the interviews." y "Try again", que reintenta el `import()`.
- Vacío: `EmptyState`. Sin resultados: variante con "Clear filters".
- Slug inexistente: `NotFoundPanel` con enlace de vuelta al listado.

## Archivos

Nuevos: `src/data/dissemination/*`, `src/components/dissemination/*`, `src/components/shared/{PageHero,SearchField,FilterChips}.jsx`, `src/pages/{DisseminationSection,Dissemination,InterviewPage}.jsx`, `src/hooks/useSectionScroll.js`, `src/utils/{youtube,usePageMeta,disseminationRoutes}.js`, `scripts/vite-dissemination-pages.js` y los tests `*.test.js` junto a la lógica pura.

Modificados: `Header.jsx` (enlace + hueco), `App.jsx` (ruta lazy + ScrollToTop), `Resources.jsx` (usa los componentes compartidos + contraste), `ResourcesSection.jsx` (usa `useSectionScroll`), `Breadcrumbs.jsx` (prop `label`), `vite.config.js` (plugin), `package.json` (`vitest`, script `test`).

## Verificación

- `vitest`: validador (casos válidos y cada error), selectores (filtro, búsqueda con acentos, destacada, relacionadas) y `parseYouTubeId`.
- `npm run build` + `grep -r "interviews-12\|__fixtures__" dist/` sin resultados.
- Playwright (`webapp-testing`): menú a 1024/1280/1440/1920 y móvil; filtros reflejados en la URL; listado → detalle → atrás; recarga en cada URL; recorrido con teclado; capturas a 1440 y 390 con 0, 1 y 12 entrevistas y del detalle; GIF del recorrido.
- Lighthouse de `/dissemination` (LCP, CLS, accesibilidad).
- Resources antes y después de extraer los componentes: capturas comparadas a 1440 y 390.

## Commits

1. Menú y ruta (lazy, ScrollToTop, `useSectionScroll`).
2. Modelo de datos, validador, fixtures y tests.
3. Componentes compartidos extraídos de Resources + hero y estado vacío.
4. Rejilla, destacada y filtros en la URL.
5. Detalle (fachada, audio, transcripción, compartir, relacionadas).
6. Animaciones y reduced motion.
7. Móvil y SEO (usePageMeta + HTML estático por entrevista).

## Cómo añadir una entrevista (para el README del apartado)

1. Copiar un objeto de `__fixtures__/interviews-4.js` a `INTERVIEWS` en `src/data/dissemination/interviews.js` y rellenarlo (pegar el enlace de YouTube en `mediaUrl`).
2. `npm run dev`: si falta algo, el validador dice qué y en qué entrevista.
3. Commit y despliegue: el build genera también la página estática para compartir.
