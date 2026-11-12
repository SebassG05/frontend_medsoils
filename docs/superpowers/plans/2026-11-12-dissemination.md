# Dissemination (interviews) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `/dissemination` section (listing + `/dissemination/:slug` detail) for MEDSOILS interviews, ready to receive real interviews by adding objects to one data file.

**Architecture:** Local data module (`src/data/dissemination/`) with a DEV-only validator and DEV-only fixtures; a lazily loaded `DisseminationSection` that mirrors `ResourcesSection` (LayoutGroup + AnimatePresence + shared-element cover morph); hero/search/chips extracted from Resources into shared components; build-time static HTML per interview for Open Graph.

**Tech Stack:** React 18, React Router 7, framer-motion 12, Tailwind 4, Vite 6, lucide-react; new devDependency `vitest`.

**Spec:** `docs/superpowers/specs/2026-11-12-dissemination-design.md`

## Global Constraints

- JavaScript only (no TypeScript); types as JSDoc `@typedef` in `schema.js`.
- No new runtime dependencies. Only `vitest` as devDependency.
- Every user-facing string lives in `src/data/dissemination/copy.js` (`COPY` English, `COPY_ES` prepared and unused).
- Motion values only from `src/utils/motion.js` (`DURATION`, `EASE`, `SPRING`, `ENTER_OFFSET`, `STAGGER`, `fadeRise`, `staggerChildren`, `revealOnce`, `AFTER_MORPH`, `layoutTransition`) or `--motion-*` CSS vars; animate only `transform` and `opacity`.
- Orange: eyebrow `text-orange-700`, highlighted title word `text-orange-600`, buttons `bg-orange-700 hover:bg-orange-800`, focus `focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2`.
- Card surface: `rounded-[var(--radius-card)] shadow-[var(--shadow-card)]`, hover `shadow-[var(--shadow-card-hover)]`.
- Headings: one `h1` per page, `h2` per block, `h3` per card.
- Fixtures are reachable only when `import.meta.env.DEV` **and** `?demo=interviews`.
- YouTube iframe host: `https://www.youtube-nocookie.com/embed/{id}?autoplay=1&rel=0`; nothing from YouTube loads before the click except `i.ytimg.com` thumbnails.
- Do not change behaviour of Resources, Blog or Reviews beyond: shared hero/search/chips, the orange contrast fix, and `useSectionScroll` extraction.

## Review Focus

1. **Accents and case in search** — "martin" must find "Dr. Elena Martín"; "SUELO" finds "suelo". → test in Task 2 (`filterInterviews`).
2. **Garbage query params** — `?type=podcast&lang=zz` must show everything, not an empty grid. → test in Task 2 (`parseFilters`).
3. **Date shifted by timezone** — `'2026-10-14'` must print "14 Oct 2026" for a visitor in UTC−5. → test in Task 2 (`formatDate` uses `timeZone: 'UTC'`).
4. **YouTube links as people paste them** — `youtu.be/ID?si=…`, `watch?v=ID&t=30s`, `/shorts/ID`, `/embed/ID`, and a non-YouTube audio URL → test in Task 2 (`parseYouTubeId`).
5. **Very long name/institution, no photo, no duration** at 360 px → fixture entry in Task 2 + overflow check in Task 9.

---

### Task 1: Menu entry, lazy route and section shell

**Files:**
- Create: `src/utils/disseminationRoutes.js`, `src/utils/disseminationRoutes.test.js`, `src/hooks/useSectionScroll.js`, `src/pages/DisseminationSection.jsx`, `src/pages/Dissemination.jsx` (placeholder), `src/pages/InterviewPage.jsx` (placeholder), `src/components/ui/ChunkErrorBoundary.jsx`
- Modify: `src/pages/ResourcesSection.jsx` (move `readPositions`, `writePosition`, `useSectionScroll` out), `src/App.jsx`, `src/components/layout/Header.jsx`, `package.json`

**Interfaces:**
- Produces: `DISSEMINATION_PATH = '/dissemination'`, `interviewPath(slug): string`, `isDisseminationSectionPath(pathname): boolean`; `useSectionScroll(location, reduce, storageKey): void`; `<ChunkErrorBoundary fallback={(retry) => node}>`.

- [ ] **Step 1: Add vitest.** `npm i -D vitest`, add `"test": "vitest run"` to `package.json` scripts.
- [ ] **Step 2: Write failing test `disseminationRoutes.test.js`**

```js
import { describe, it, expect } from 'vitest'
import { isDisseminationSectionPath, interviewPath } from './disseminationRoutes'
describe('isDisseminationSectionPath', () => {
  it.each(['/dissemination', '/dissemination/', '/dissemination/some-slug', '/dissemination/some-slug/'])('%s → true', p => expect(isDisseminationSectionPath(p)).toBe(true))
  it.each(['/', '/resources', '/dissemination/a/b', '/disseminationx'])('%s → false', p => expect(isDisseminationSectionPath(p)).toBe(false))
})
it('interviewPath', () => expect(interviewPath('abc')).toBe('/dissemination/abc'))
```
- [ ] **Step 3: Run `npm test`** — expect FAIL (module not found).
- [ ] **Step 4: Implement `disseminationRoutes.js`** (same shape as `utils/collectionRoutes.js`).
- [ ] **Step 5: Run `npm test`** — expect PASS.
- [ ] **Step 6: Extract `useSectionScroll(location, reduce, storageKey)`** into `src/hooks/useSectionScroll.js` with the code currently in `ResourcesSection.jsx:9-63`, replacing the `SCROLL_KEY` constant by the `storageKey` argument. `ResourcesSection` calls `useSectionScroll(location, reduce, 'medsoils:resources-scroll')`.
- [ ] **Step 7: Create `DisseminationSection.jsx`** as a copy of the `ResourcesSection` render tree with `LayoutGroup id="dissemination"`, storage key `'medsoils:dissemination-scroll'`, routes `index → <Dissemination />`, `':slug' → <InterviewPage />`. Placeholders render an `h1` with the slug or "Dissemination".
- [ ] **Step 8: Wire `App.jsx`.** `const DisseminationSection = lazy(() => import('./pages/DisseminationSection'))`; route `path="/dissemination/*"` wrapped in `ForceResetGuard`, `ChunkErrorBoundary` and `<Suspense fallback={<div className="min-h-screen" />}>` (Task 4 swaps the fallback for the skeleton). `ScrollToTop` early-returns when both paths satisfy `isDisseminationSectionPath`. `ChunkErrorBoundary` is a class component; `retry` = `window.location.reload()`; fallback copy: "We couldn’t load this page." / "Try again".
- [ ] **Step 9: Header.** Insert `{ name: 'Dissemination', path: '/dissemination', matchPrefix: true }` between Resources and Reviews. `isActive(item)` returns `pathname === item.path || (item.matchPrefix && pathname.startsWith(item.path + '/'))` (only this item gets prefix matching). Replace `space-x-12` on the desktop nav with `gap-x-6 xl:gap-x-8 2xl:gap-x-12`.
- [ ] **Step 10: Verify.** `npm run build` succeeds and `dist/assets` contains a separate `DisseminationSection-*.js` chunk. With `npm run dev`, use webapp-testing at widths 1024, 1280, 1440, 1920: the nav's right edge must be left of the LOGIN button's left edge, and no element overflows `document.documentElement.clientWidth`. If 1024 fails, change the desktop nav/button breakpoint from `lg` to `xl` (hamburger up to 1279) and re-check. Check that the mobile menu (390) lists Dissemination and that `/dissemination/x` highlights it.
- [ ] **Step 11: Commit** `feat(dissemination): add menu entry and lazy /dissemination route`.

### Task 2: Data model, validator, fixtures and copy

**Files:**
- Create: `src/utils/youtube.js`, `src/utils/youtube.test.js`, `src/data/dissemination/{interviews.js,schema.js,schema.test.js,index.js,index.test.js,copy.js}`, `src/data/dissemination/__fixtures__/{interviews-1.js,interviews-4.js,interviews-12.js}`

**Interfaces:**
- Produces (`youtube.js`): `parseYouTubeId(url): string|null`; `youtubeThumb(id, size: 'hq'|'maxres'): { webp: string, jpg: string }` (`https://i.ytimg.com/vi_webp/{id}/{size}default.webp`, `https://i.ytimg.com/vi/{id}/{size}default.jpg`); `youtubeEmbedUrl(id): string`.
- Produces (`schema.js`): JSDoc `Interview` typedef (fields exactly as the spec table); `validateInterviews(list): void`, throws `Error('interview "<slug or #index>": <problem>')`.
- Produces (`index.js`): `loadInterviews(searchParams: URLSearchParams): Promise<Interview[]>` (validated in DEV, sorted newest first); `parseFilters(searchParams): { q: string, type: 'video'|'audio'|'text'|null, lang: string|null }`; `filterInterviews(list, filters): Interview[]`; `pickFeatured(list): Interview|null`; `countByType(list): { all, video, audio, text }`; `availableLanguages(list): string[]`; `getBySlug(list, slug): Interview|null`; `related(list, slug, n = 3): Interview[]`; `formatDate(iso): string`; `formatDuration(seconds): string`; `readingMinutes(transcript): number`; `layoutIds.cover(slug): string` → `` `interview-cover-${slug}` ``.
- Produces (`copy.js`): `COPY`, `COPY_ES` (keys below).

- [ ] **Step 1: Write failing `youtube.test.js`.** `parseYouTubeId` returns `'dQw4w9WgXcQ'` for `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s`, `https://youtu.be/dQw4w9WgXcQ?si=abc`, `https://www.youtube.com/shorts/dQw4w9WgXcQ`, `https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ`, `https://m.youtube.com/watch?v=dQw4w9WgXcQ`; returns `null` for `https://cdn.example.org/a.mp3`, `''`, `undefined`, `https://youtube.com/watch?v=short`. `youtubeThumb('x','hq').jpg === 'https://i.ytimg.com/vi/x/hqdefault.jpg'`.
- [ ] **Step 2: Write failing `schema.test.js`.** A valid video, audio (direct `.mp3` URL) and text entry pass. Each of these throws and the message contains the quoted text: missing `cover.alt` → `cover.alt is required`; duplicate slug → `duplicate slug`; `date: '14/10/2026'` → `date must be YYYY-MM-DD`; `type: 'podcast'` → `type must be video, audio or text`; video with `mediaUrl: 'https://vimeo.com/1'` → `mediaUrl must be a YouTube link`; text without `transcript` → `transcript is required for text`; slug `'Hello World'` → `slug must be kebab-case`.
- [ ] **Step 3: Write failing `index.test.js`.**
  - `filterInterviews(list, { q: 'martin' })` finds "Dr. Elena Martín"; `{ q: 'SEVILLA' }` matches institution; `{ q: 'carbon', type: 'audio' }` combines; empty filters return all.
  - `parseFilters(new URLSearchParams('type=podcast&lang=zz&q=%20soil%20'))` → `{ q: 'soil', type: null, lang: 'zz' }` and `filterInterviews` with an unknown `lang` returns all (unknown languages are ignored: `lang` only applies when it is in `availableLanguages(list)`).
  - `pickFeatured`: two `featured: true` → the newer one; none featured → newest; `[]` → `null`.
  - `formatDate('2026-10-14')` → `'14 Oct 2026'` (run with `process.env.TZ = 'America/Bogota'` set at top of the file).
  - `formatDuration(760)` → `'12:40'`; `formatDuration(3725)` → `'1:02:05'`.
  - `readingMinutes([{ speaker: 'interviewee', text: 'word '.repeat(440) }])` → `2` (220 wpm, minimum 1).
  - `related(list, slug)` excludes `slug`, prefers same type/shared tag, length ≤ 3.
  - `loadInterviews(new URLSearchParams('demo=interviews&n=4'))` resolves to 4 items; without `demo` resolves to `INTERVIEWS` (empty).
- [ ] **Step 4: Run `npm test`** — expect FAIL.
- [ ] **Step 5: Implement `youtube.js`, `schema.js`, `index.js`.** Search normalises with `str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()` over title, interviewee name/role/institution, tags, summary. `formatDate` uses `Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })`. Fixtures load with `if (import.meta.env.DEV && params.get('demo') === 'interviews') { const n = ['1','4','12'].includes(params.get('n')) ? params.get('n') : '12'; return (await import(`./__fixtures__/interviews-${n}.js`)).default }` — keep the `import.meta.env.DEV` check as the outer condition so Vite drops the branch in production.
- [ ] **Step 6: Create `interviews.js`** (`export const INTERVIEWS = []` + a comment pointing to the spec's "add an interview" steps) and the three fixtures with fictional data from the Figma sketch. `interviews-12.js` must include: one `featured: true`; 6 video / 3 audio / 3 text; languages `en`, `es`, `tr`; one interviewee "Prof. Dr. Maria Konstantinou-Papadopoulou", institution "Hellenic Agricultural Organization – Institute of Soil and Water Resources, Thessaloniki", no `photo`, no `duration`; one audio with a direct `.mp3` URL; videos use `https://www.youtube.com/watch?v=<11-char placeholder id>`.
- [ ] **Step 7: Create `copy.js`** with keys and English values from the spec: `nav.label` ('Dissemination'), `hero.{eyebrow,highlight,title,intro,searchPlaceholder,searchLabel}` ('OUTREACH & MEDIA', 'Dissemination', '& Interviews', 'Conversations with the researchers and partners behind MEDSOILS Challenge — on video, audio and in writing.', 'Search interviews, people or institutions…', 'Search interviews'), `filters.{label,all,video,audio,text,language,allLanguages,results(n),clear}`, `featured.{eyebrow,cta: { video:'Watch interview', audio:'Listen to interview', text:'Read interview' }}`, `list.heading` ('All interviews'), `empty.{title,body,resources,blog}` ('The first interviews are on their way', 'We’re recording conversations with the people behind MEDSOILS Challenge. Meanwhile, explore our field trips and articles.', 'Explore resources', 'Read the blog'), `noResults.{title(q),clear}` ('No interviews match “{q}”.'), `error.{title,retry}` ('We couldn’t load the interviews.', 'Try again'), `detail.{breadcrumb,transcript,showTranscript,hideTranscript,related,share,copyLink,copied,notFoundTitle,notFoundBody,notFoundCta,interviewer}`, `player.{play(title),notice,audioFallback}` (notice: 'Plays from YouTube (youtube-nocookie.com).'), `meta.{title,description}`. `COPY_ES` mirrors keys with the Spanish values from the spec ("Difusión", "Divulgación y medios", …).
- [ ] **Step 8: Run `npm test`** — expect PASS.
- [ ] **Step 9: Commit** `feat(dissemination): add interview data model, dev validator and fixtures`.

### Task 3: Shared hero, search and chips (extracted from Resources)

**Files:**
- Create: `src/components/shared/{PageHero.jsx,SearchField.jsx,FilterChips.jsx,Wave.jsx}`
- Modify: `src/pages/Resources.jsx:531-644`, `src/components/collections/Breadcrumbs.jsx`, `src/components/collections/SkyBand.jsx` (use `Wave`)

**Interfaces:**
- Produces: `<PageHero eyebrow highlight title intro>{children}</PageHero>` (renders `h1` as `<span class="text-orange-600">{highlight}</span> {title}`, sky gradient, `Wave`, staggered `fadeRise`); `<SearchField value onChange={(v) => …} placeholder label />` (`onChange` receives the string); `<FilterChips label options={[{ value, label, count? }]} value onChange={(v) => …} />` (`role="group"`, `aria-pressed`, `overflow-x-auto snap-x` on mobile); `<Breadcrumbs label items />`.

- [ ] **Step 1: Capture Resources before.** webapp-testing screenshots of `/resources` at 1440 and 390 into the scratchpad.
- [ ] **Step 2: Implement the four shared components** by moving the existing markup from `Resources.jsx` (hero section, search input, chip buttons, wave SVG) unchanged except: eyebrow `text-orange-700`, highlight `text-orange-600`, motion via `fadeRise(reduce, delay)` with delays `0, 0.06, 0.12, 0.18`, search `aria-label={label}` and the clear button `aria-label="Clear search"`.
- [ ] **Step 3: Use them in `Resources.jsx`** (eyebrow 'Knowledge Hub', highlight 'Resources', title '& Materials', existing intro and placeholder; chips map `CATEGORIES` to options with `count` only when `showCounts`). `Breadcrumbs` takes `label` with default `COPY.breadcrumbs.label` so collection pages keep working untouched.
- [ ] **Step 4: Verify.** `npm run build` passes; screenshots of `/resources` at 1440 and 390 match Step 1 except the two orange shades; search and chips still filter.
- [ ] **Step 5: Commit** `refactor(resources): extract PageHero, SearchField and FilterChips`.

### Task 4: Listing page — hero, loading, error and empty states

**Files:**
- Create: `src/components/dissemination/{EmptyState.jsx,InterviewSkeleton.jsx}`, `src/hooks/useInterviews.js`
- Modify: `src/pages/Dissemination.jsx`, `src/App.jsx` (Suspense fallback)

**Interfaces:**
- Consumes: `loadInterviews` (Task 2), `PageHero`, `SearchField` (Task 3).
- Produces: `useInterviews(): { status: 'loading'|'ready'|'error', interviews: Interview[], retry(): void }`; `<EmptyState variant="empty" />` / `<EmptyState variant="noResults" query onClear />`; `<InterviewSkeleton count={6} featured />`.

- [ ] **Step 1: Implement `useInterviews`** (reads `useSearchParams`, re-runs only when `demo`/`n` change; error status on rejection, including a validator error in DEV, which is also `console.error`ed with the message).
- [ ] **Step 2: Implement `EmptyState`.** `empty`: `role="status"`, decorative ghost-card composition from the Figma frame "Estado vacío" (three dashed cards with Play / Headphones / FileText icons in `orange-50` covers, outer two rotated ±6°, `aria-hidden`), `h2` + body + links to `/resources` (primary) and `/blog` (secondary). `noResults`: smaller, no illustration, `COPY.noResults.title(q)` + "Clear filters" button.
- [ ] **Step 3: Implement `InterviewSkeleton`** with the same box sizes as the card (16:9 cover, 2 title lines, avatar row, footer) and the featured split; `animate-pulse motion-reduce:animate-none`; `aria-busy="true"` on the wrapper with `aria-label="Loading interviews"`.
- [ ] **Step 4: Compose `Dissemination.jsx`:** `PageHero` + `SearchField` (wired in Task 5), then by status: skeleton / error (`COPY.error` + retry button) / `EmptyState variant="empty"` when the list is empty. Swap the App Suspense fallback for `<InterviewSkeleton count={6} featured />`.
- [ ] **Step 5: Verify** with webapp-testing: `/dissemination` shows the hero and empty state with no console errors; links go to `/resources` and `/blog`; a fixture with a deliberately broken entry (temporary local edit, not committed) shows the error state and the validator message in the console.
- [ ] **Step 6: Commit** `feat(dissemination): add listing hero and empty, loading and error states`.

### Task 5: Featured interview, grid and URL-driven filters

**Files:**
- Create: `src/components/dissemination/{InterviewCover.jsx,Avatar.jsx,InterviewCard.jsx,FeaturedInterview.jsx,InterviewGrid.jsx,InterviewFilters.jsx}`, `src/hooks/useInterviewFilters.js`
- Modify: `src/pages/Dissemination.jsx`

**Interfaces:**
- Consumes: Task 2 selectors, `FilterChips`, `SearchField`, `MediaImage`, `imageSources`.
- Produces: `<InterviewCover interview sizes priority layoutId className />` (own `cover.src` → `MediaImage`; otherwise YouTube `<picture>` webp→jpg, `aspect-ratio: 16/9`, background `cover.color`, `object-cover`); `<Avatar person size />` (photo or initials); `<InterviewCard interview />`; `<FeaturedInterview interview />`; `<InterviewGrid interviews />`; `<InterviewFilters filters counts languages resultCount onTypeChange onLangChange />`; `useInterviewFilters(): { filters, setQuery(q), setType(t|null), setLang(l|null), clear() }`.

- [ ] **Step 1: Implement `useInterviewFilters`.** Reads with `parseFilters`; `setQuery` debounced 250 ms with `setSearchParams(…, { replace: true })`; `setType`/`setLang` push history; removing a value deletes the param; `demo`/`n` are preserved.
- [ ] **Step 2: Implement `InterviewCover` and `Avatar`.**
- [ ] **Step 3: Implement `InterviewCard`** per Figma component "MEDSOILS / Interview card": the whole card is one `<Link to={interviewPath(slug)}>` with `aria-label` = title; cover with type pill (icon + label) top-left and duration pill bottom-right (text: `formatDuration` or `readingMinutes` + ' min read'; hidden when unknown); `h3` title (max 3 lines, `line-clamp-3`); avatar + name + `role · institution` (wraps, never truncates); footer with date and type-specific CTA text + arrow.
- [ ] **Step 4: Implement `FeaturedInterview`** per Figma frame A: one `<Link>`, cover 7/12 with centred play disc (video/audio) and `priority`, text 5/12 with eyebrow, `h2` title, quote with orange bar (omitted if no `quote`), avatar row, `date · duration · language name` (`Intl.DisplayNames(['en'], { type: 'language' })`), CTA pill. Stacks below `lg`.
- [ ] **Step 5: Implement `InterviewFilters`:** `FilterChips` with All/Video/Audio/Text and counts from `countByType(all interviews)`; language `<select>` styled as the pill, rendered only when `availableLanguages` has ≥ 2; result count in a `<p aria-live="polite">` using `COPY.filters.results(n)`.
- [ ] **Step 6: Compose the page.** When no filter/search is active: featured (`pickFeatured`) + grid of the rest. When any is active: no featured, grid of all matches, `noResults` state when empty. The grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`, `max-w-screen-2xl px-4 sm:px-6 lg:px-12`. The `h2` "All interviews" is shown only when the grid has items.
- [ ] **Step 7: Verify** with webapp-testing on `?demo=interviews&n=12`: clicking Video sets `?type=video` and shows 6 cards; typing "martin" sets `q=martin` after 250 ms and shows one card; Back undoes the type filter; reload keeps the state; `?type=podcast` shows all 12; `n=1` shows only the featured block, `n=4` featured + 3 cards.
- [ ] **Step 8: Commit** `feat(dissemination): add featured interview, card grid and URL filters`.

### Task 6: Interview detail page

**Files:**
- Create: `src/components/dissemination/{InterviewHeader.jsx,YouTubeFacade.jsx,AudioPlayer.jsx,TranscriptQA.jsx,ShareActions.jsx,RelatedInterviews.jsx}`
- Modify: `src/pages/InterviewPage.jsx`

**Interfaces:**
- Consumes: `useInterviews`, `getBySlug`, `related`, `layoutIds`, `parseYouTubeId`, `youtubeEmbedUrl`, `InterviewCover`, `Avatar`, `InterviewCard`, `Breadcrumbs`, `NotFoundPanel`.
- Produces: `<YouTubeFacade videoId title interview />`, `<AudioPlayer src title captions />`, `<TranscriptQA transcript interviewee collapsible />`, `<ShareActions url title />`, `<RelatedInterviews interviews />`.

- [ ] **Step 1: `InterviewPage`.** Loading → skeleton; unknown slug → `NotFoundPanel` (`COPY.detail.notFound*`, `to="/dissemination"`); otherwise `Breadcrumbs label="Breadcrumb" items={[{ label: 'Dissemination', to: '/dissemination' }, { label: title }]}`, `InterviewHeader`, media block by type, transcript, share, related.
- [ ] **Step 2: `InterviewHeader`:** the media/cover box carries `layoutId={layoutIds.cover(slug)}` (same id as the card cover) so the card cover grows into it; `h1` title; interviewee row (avatar 56, name, role, institution); meta line `date · duration · language`; tags as non-interactive pills.
- [ ] **Step 3: `YouTubeFacade`:** a `<button>` over `InterviewCover` (maxres thumb, falls back to hq on `error`) with `aria-label={COPY.player.play(title)}`; on `pointerenter`/`focus` append `<link rel="preconnect" href="https://www.youtube-nocookie.com">` once; on click render `<iframe src={youtubeEmbedUrl(id)} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy">` in the same 16:9 box and move focus to it; `COPY.player.notice` under the player. Audio with a YouTube `mediaUrl` uses this facade too, with a Headphones badge.
- [ ] **Step 4: `AudioPlayer`:** native `<audio controls preload="none">` with `<track kind="captions">` per `captions` entry and `COPY.player.audioFallback` inside.
- [ ] **Step 5: `TranscriptQA`:** `interviewer` turns as bold questions, `interviewee` turns as body text with a left orange rule; visually-hidden speaker labels ("Interviewer:" / interviewee name). `collapsible` wraps it in `<details>` with `summary` = `COPY.detail.showTranscript`. Text interviews render it not collapsible as the main body.
- [ ] **Step 6: `ShareActions`:** "Copy link" button using `navigator.clipboard.writeText(location.href)`, then a `role="status"` "Link copied" for 2 s; a "Share" button only when `navigator.share` exists.
- [ ] **Step 7: `RelatedInterviews`:** `h2` + up to 3 `InterviewCard`; hidden when empty.
- [ ] **Step 8: Verify** with webapp-testing (`demo=interviews&n=12` appended to links in dev): card → detail → Back returns to the same scroll; reload on the detail URL works; no `youtube` network requests before clicking play; after the click the iframe is present and focused; Tab order reaches play, transcript summary, copy link, related cards; `/dissemination/nope` shows the not-found panel.
- [ ] **Step 9: Commit** `feat(dissemination): add interview detail with player, transcript and sharing`.

### Task 7: Motion and reduced motion

**Files:**
- Modify: `src/components/shared/PageHero.jsx`, `src/components/dissemination/{InterviewCard.jsx,FeaturedInterview.jsx,InterviewGrid.jsx,InterviewHeader.jsx}`, `src/pages/InterviewPage.jsx`

- [ ] **Step 1: Card entrance:** grid uses `staggerChildren(reduce)` + `whileInView` (`viewport={{ once: true, amount: 0.15 }}`); each card `fadeRise(reduce)`; `initial={revealOnce('dissemination-grid')}`.
- [ ] **Step 2: Hover/press (CSS):** on the card link `group`; cover image `transition-transform duration-[var(--motion-cover)] ease-out-expo group-hover:scale-[1.03] motion-reduce:transform-none`; card `transition-[transform,box-shadow] duration-[var(--motion-base)] group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98]`; arrow `group-hover:translate-x-0.5`. Tailwind 4 `hover:` already applies only under `(hover: hover)`.
- [ ] **Step 3: Filter reorder:** each grid item is a `motion.div layout` with `transition={layoutTransition(reduce)}` inside `AnimatePresence mode="popLayout"`; exits fade with `DURATION.fast`.
- [ ] **Step 4: Shared element:** card cover `motion.div layoutId={layoutIds.cover(slug)}` with `transition={layoutTransition(reduce)}`; detail content below the header uses `fadeRise(reduce, AFTER_MORPH)`.
- [ ] **Step 5: Verify:** webapp-testing with `reducedMotion: 'reduce'`: no transform transitions, only fades. Run `emil-kowalski-skills:review-animations` on the changed files and fix what it reports.
- [ ] **Step 6: Commit** `feat(dissemination): add entrance, hover, reorder and shared-element motion`.

### Task 8: Mobile polish and SEO

**Files:**
- Create: `src/utils/usePageMeta.js`, `scripts/vite-dissemination-pages.js`
- Modify: `src/pages/{Dissemination.jsx,InterviewPage.jsx}`, `vite.config.js`

**Interfaces:**
- Produces: `usePageMeta({ title, description, image, url, type: 'website'|'article'|'video.other', jsonLd })` (sets/restores `document.title` as `` `${title} · MEDSOILS Challenge` ``, `meta[name=description]`, `link[rel=canonical]`, `og:title|description|image|url|type`, `twitter:card=summary_large_image`, one `script#page-jsonld`); `buildInterviewMeta(interview, origin): { title, description, image, url, type, jsonLd }` exported from `src/data/dissemination/index.js` and used by both the hook caller and the Vite plugin.

- [ ] **Step 1: Write failing test** in `index.test.js`: `buildInterviewMeta(video, 'https://medsoil-challenge.eu')` → `type: 'video.other'`, `jsonLd['@type'] === 'VideoObject'`, `jsonLd.embedUrl === 'https://www.youtube-nocookie.com/embed/<id>'`, `jsonLd.duration === 'PT12M40S'`, `url === 'https://medsoil-challenge.eu/dissemination/<slug>'`; a text interview → `jsonLd['@type'] === 'Article'`, `type: 'article'`.
- [ ] **Step 2: Run `npm test`** — FAIL; **Step 3: implement**; **Step 4: run** — PASS.
- [ ] **Step 5: Use `usePageMeta`** in both pages (listing: `COPY.meta.title`/`description`, image = the logo URL already used in `Header.jsx`).
- [ ] **Step 6: Vite plugin** (`apply: 'build'`, `closeBundle`): import `INTERVIEWS` and `buildInterviewMeta` via `pathToFileURL`, read `dist/index.html`, replace `<title>` and inject the meta/JSON-LD before `</head>`, write `dist/dissemination/index.html` and `dist/dissemination/<slug>/index.html`. Register in `vite.config.js`.
- [ ] **Step 7: Mobile pass** at 360 and 390 with `?demo=interviews&n=12`: one column, chips scroll horizontally without page overflow, the long-name fixture wraps, `document.documentElement.scrollWidth === clientWidth`. Fix any overflow found.
- [ ] **Step 8: Verify build:** `npm run build`; `grep -rl "__fixtures__\|Konstantinou" dist/` returns nothing; `dist/dissemination/index.html` exists with `og:title`. Temporarily add one real-looking entry to `INTERVIEWS`, rebuild, confirm `dist/dissemination/<slug>/index.html` has the JSON-LD, then revert.
- [ ] **Step 9: Commit** `feat(dissemination): add page metadata, static share pages and mobile fixes`.

### Task 9: Review and deliverables

- [ ] **Step 1:** Run `design:accessibility-review`, `emil-kowalski-skills:break-ui` (long names, no photo, no duration, 0 and 50 interviews — generate 50 by repeating the 12 fixture in a scratch copy), `/impeccable critique` and `/impeccable polish` on the listing and detail; fix findings in place with one commit per fix group.
- [ ] **Step 2:** webapp-testing deliverables into the scratchpad: screenshots at 1440 and 390 for 0, 1 and 12 interviews and the detail page; a GIF of menu → listing → filter → detail → Back; keyboard-only pass.
- [ ] **Step 3:** Lighthouse on `npm run preview` `/dissemination` (mobile): record LCP, CLS, accessibility.
- [ ] **Step 4:** `superpowers:verification-before-completion`: `npm test`, `npm run lint`, `npm run build` all green; report files touched, "how to add an interview in three steps" (spec section) and open items (Nginx `try_files`, `matchPrefix` only on Dissemination, slight timing change of the Resources hero entrance now driven by motion tokens).
