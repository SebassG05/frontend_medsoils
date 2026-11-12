/**
 * MEDSOILS Challenge interviews — the single source for /dissemination.
 *
 * To add an interview:
 *   1. Copy an object from __fixtures__/interviews-12.js into the list below
 *      and fill it in (paste the YouTube link into `mediaUrl`). Field reference:
 *      the Interview typedef in ./schema.js.
 *   2. Run `npm run dev` and open /dissemination: if anything is missing or
 *      wrong, the page shows an error and the console names the interview
 *      and the field.
 *   3. Commit and deploy. The build also writes a static page per interview
 *      so links shared on WhatsApp/LinkedIn show the title and image.
 *
 * Order does not matter (newest first is automatic). Mark one with
 * `featured: true` to choose the big block at the top; otherwise the newest
 * interview is featured.
 *
 * @type {import('./schema').Interview[]}
 */
export const INTERVIEWS = [
  {
    slug: 'manuel-pulido-mediterranean-basin',
    title: 'Manuel Pulido on soils in the Mediterranean basin',
    type: 'video',
    interviewee: {
      name: 'Manuel Pulido',
      role: 'Geographer and soil erosion researcher',
      institution: 'University of Extremadura',
      country: 'Spain',
    },
    date: '2026-11-12',
    duration: 117,
    language: 'es',
    cover: {
      alt: 'Manuel Pulido sitting in a dry grass field during a MEDSOILS Challenge field session, with the University of Extremadura logo',
      color: '#6f6961',
    },
    summary: 'Manuel Pulido Fernández, geographer and professor, explains why the MEDSOILS Challenge focuses on the soils of the Mediterranean basin. Recorded during the project trip to Adıyaman. In Spanish, with English subtitles.',
    description: [
      'Manuel Pulido Fernández is a lecturer in the Department of Art and Territorial Sciences at the University of Extremadura, where he has taught physical geography since 2011. His research looks at soil erosion and land degradation: soil quality in Iberian dehesa rangelands, soil organic matter, and erosion rates in Mediterranean vineyards. He has also worked on European soil initiatives.',
      'In this interview, recorded during the MEDSOILS Challenge trip to Adıyaman, he explains why the project looks so closely at the Mediterranean basin. Dry summers, scarce water and intensive land use make its soils especially vulnerable, which is why the region needs a new generation of soil experts. In Spanish, with English subtitles.',
    ],
    mediaUrl: 'https://youtu.be/AsZJ_W1gvEs',
    tags: ['soil erosion', 'Mediterranean', 'Spain'],
    featured: true,
  },
  {
    slug: 'erhan-akca-students-views-on-soil',
    title: 'Erhan Akça on students sharing their views on soil',
    type: 'video',
    interviewee: {
      name: 'Erhan Akça',
      role: 'Professor of soil science',
      institution: 'Adıyaman University',
      country: 'Türkiye',
    },
    date: '2026-11-12',
    duration: 72,
    language: 'tr',
    cover: {
      alt: 'A lecturer and students reviewing field notes in a meadow on the Adıyaman University campus',
      color: '#72695d',
    },
    summary: 'Erhan Akça, professor at Adıyaman University whose work covers soil chemistry and soil carbon in semi-arid Türkiye, talks about the field work hosted in Adıyaman and how students from different countries exchange knowledge and their different views on soil. In Turkish, with English subtitles.',
    mediaUrl: 'https://youtu.be/gFpVRmcROFo',
    tags: ['field work', 'soil carbon', 'Türkiye'],
  },
]
