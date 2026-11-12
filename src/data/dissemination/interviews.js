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
export const INTERVIEWS = []
