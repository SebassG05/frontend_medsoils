/**
 * Field trip: Visit to Adıyaman.
 *
 * Counts on the cards ("1 day · 14 photos · 6 videos") are derived from the
 * media lists, never typed. Media are hosted on Cloudinary; see ./media.js for
 * the cloudPhoto / cloudVideo helpers and what each argument means.
 *
 * Adding a day: append an object to `days` (template at the bottom).
 */
import { cloudPhoto as photo, cloudVideo as video } from './media.js'

const IMG = 'https://res.cloudinary.com/dktr2wcto/image/upload'
const VID = 'https://res.cloudinary.com/dktr2wcto/video/upload'

const adiyaman = {
  slug: 'adiyaman',
  title: 'Visit to Adıyaman',
  place: 'Adıyaman, Türkiye',
  // Extend `end` when more days are added.
  dates: { start: '2026-11-02', end: '2026-11-03' },
  // PENDING: confirm wording with the team.
  description:
    'Photos and videos from the MEDSOILS Challenge visit to Adıyaman, in south-eastern Türkiye.',
  partner: { name: 'Adiyaman University', slug: 'adiyaman' },
  // Cover for the Field trips card and the collection header. Either a full
  // media object (as here) or a reference to a day's media: { day: 'dia-1', media: '<id>' }.
  cover: {
    ...photo(`${IMG}/v1794231106/adiyaman-see-desktop-kapak_gp7ntw.jpg`, 1920, 1080, '#624a37',
      'Ancient stone heads on the summit terrace of Mount Nemrut, Adıyaman, in late-afternoon light'),
    id: 'cover',
    focus: { x: 0.72, y: 0.55 }, // the large stone head, so narrow crops keep it
  },

  // Highlights shown under "Recommended" on /resources (first 3 across collections).
  featured: [
    { day: 'dia-1', media: 'httifl' }, // video: the backhoe opens the soil pit
    { day: 'dia-1', media: 'f0idkn' }, // photo: labelled soil profile wall
    { day: 'dia-1', media: 'qk2mhh' }, // video: describing the horizons
  ],

  days: [
    {
      slug: 'dia-1',
      number: 1,
      title: 'Photos & videos',
      date: '2026-11-02',
      // First id = cover of the day (day card mosaic lead + day header).
      mosaic: ['akyoz3', 'gku3ar', 'os5esb', 'ufd7gd'],
      // Chronological, as shot.
      media: [
        photo(`${IMG}/v1794232546/PXL_20261102_072217436_fdfifm.jpg`, 8160, 4590, '#79777c',
          'Participants gathered in a field for the morning briefing, a backhoe waiting behind them'),
        photo(`${IMG}/v1794232528/PXL_20261102_072220267_rgtsvb.jpg`, 8160, 4590, '#827f84',
          'An instructor in a red jacket explains the plan for the day to the group'),
        photo(`${IMG}/v1794232530/PXL_20261102_073842703_akyoz3.jpg`, 8160, 4590, '#7a6d63',
          'A backhoe digs a soil pit while students and researchers watch'),
        video(`${VID}/v1794232549/PXL_20261102_073844611_httifl.mp4`, 1280, 720, '#9d8273', 15.5,
          'The backhoe opens the soil pit as the group looks on'),
        photo(`${IMG}/v1794232530/PXL_20261102_073919265_mbmreg.jpg`, 8160, 4590, '#746c68',
          'Freshly dug soil piled beside the new pit, with the group standing behind the backhoe'),
        photo(`${IMG}/v1794298170/PXL_20261102_080308680_uv3cha.jpg`, 2250, 4000, '#6f5e58',
          'Students gather around the edge of the pit while others work inside it'),
        video(`${VID}/v1794232539/PXL_20261102_080726239_peodwb.mp4`, 1280, 720, '#86645d', 7.8,
          'Participants in and around the pit start examining the soil profile'),
        video(`${VID}/v1794232548/PXL_20261102_080738909_qqrnbb.mp4`, 720, 1280, '#8b6661', 14.1,
          'Looking down into the pit as students study the exposed soil layers'),
        video(`${VID}/v1794232549/PXL_20261102_080800381_os5esb.mp4`, 1280, 720, '#896c63', 19.1,
          'Students climb into the pit to look at the soil horizons up close'),
        photo(`${IMG}/v1794232531/PXL_20261102_083127076_rttaga.jpg`, 4590, 8160, '#755f5b',
          'Top-down view of students in the pit next to a measuring tape and horizon markers'),
        video(`${VID}/v1794232541/PXL_20261102_083853245_qk2mhh.mp4`, 1280, 720, '#8f6b5b', 8.6,
          'Students inside the pit describe the reddish-brown soil horizons'),
        photo(`${IMG}/v1794298169/PXL_20261102_084127907_j2sskk.jpg`, 4000, 2250, '#6b5449',
          'Looking down into the pit: horizon markers, sample labels and a measuring tape laid out on the floor'),
        photo(`${IMG}/v1794232532/PXL_20261102_084130427_h8unvt.jpg`, 8160, 4590, '#65534a',
          'Students work inside the pit, with horizon markers and a measuring tape on the pit wall'),
        photo(`${IMG}/v1794298170/PXL_20261102_090316137_f0idkn.jpg`, 4000, 2250, '#6e5c5b',
          'Soil profile wall with a measuring tape, horizon labels and orange markers at each boundary'),
        photo(`${IMG}/v1794232527/PXL_20261102_104859392_iurrb0.jpg`, 8160, 4590, '#706b6b',
          'Indoor session: participants seated around a meeting room listening to a speaker'),
        photo(`${IMG}/v1794298170/PXL_20261102_121806990_tcyyge.jpg`, 4000, 2250, '#827252',
          'Several soil pits dug along a grassy slope, with groups working in and around them'),
        photo(`${IMG}/v1794298169/PXL_20261102_121821743_f2nyv1.jpg`, 4000, 2250, '#847353',
          'Groups of students working in neighbouring soil pits on a grassy hillside'),
        photo(`${IMG}/v1794298170/PXL_20261102_121823574_gbanuk.jpg`, 4000, 2250, '#857353',
          'Wider view of the hillside pits, with participants climbing in and out'),
        photo(`${IMG}/v1794232528/PXL_20261102_122034591_gku3ar.jpg`, 4590, 8160, '#726d68',
          'Close-up of a soil profile with a measuring tape marking depth'),
        video(`${VID}/v1794232544/PXL_20261102_124234663_htrrcb.mp4`, 1280, 720, '#938577', 9.9,
          'Participants sit around a second soil pit dug in an orchard'),
        photo(`${IMG}/v1794298169/PXL_20261102_130729552_gv10fh.jpg`, 2250, 4000, '#7b776c',
          'A student stands in a deep pit beside a measuring tape while another kneels at the edge'),
        photo(`${IMG}/v1794232531/PXL_20261102_135605913_qbwkqn.jpg`, 4590, 8160, '#52493f',
          'Participants fill in field description sheets at a table under a shelter'),
        photo(`${IMG}/v1794232527/PXL_20261102_135610833_hnaq0r.jpg`, 8160, 4590, '#564a3f',
          'Two participants work through their field sheets at an outdoor table'),
        photo(`${IMG}/v1794232528/PXL_20261102_135620724_z5qare.jpg`, 8160, 4590, '#75665a',
          'A group discusses results at picnic tables under a shelter, greenhouses in the background'),
        photo(`${IMG}/v1794232528/PXL_20261102_135622016_ixj2jt.jpg`, 8160, 4590, '#726459',
          'The group talks over the day’s results in the late-afternoon light'),
        photo(`${IMG}/v1794232528/PXL_20261102_135631899_ufd7gd.jpg`, 8160, 4590, '#7c6d60',
          'Participants compare notes around a table at sunset'),
        photo(`${IMG}/v1794232527/PXL_20261102_135636765_rl9ctd.jpg`, 8160, 4590, '#725e50',
          'A team gathered over field notes at an outdoor table'),
      ],
    },
    {
      slug: 'dia-2',
      number: 2,
      title: 'Photos',
      date: '2026-11-03',
      // First id = cover of the day (day card mosaic lead + day header).
      mosaic: ['ogrr2z', 'ribdco', 'jqstn0', 'tbj1kk'],
      // Chronological, as shot.
      media: [
        photo(`${IMG}/v1794302908/PXL_20261103_073352561_sr4flh.jpg`, 8160, 4590, '#878b91',
          'Rolling hills under a blue sky on the morning drive'),
        photo(`${IMG}/v1794302904/PXL_20261103_073751020_v1mtfh.jpg`, 4590, 8160, '#85888b',
          'A valley with autumn-coloured trees between bare hills'),
        photo(`${IMG}/v1794302905/PXL_20261103_073758006_tw4sls.jpg`, 4590, 8160, '#83827d',
          'Autumn trees along the slope of a dry valley'),
        photo(`${IMG}/v1794302905/PXL_20261103_073803734_bmcbir.jpg`, 8160, 4590, '#7f7767',
          'Wide view of a valley dotted with yellow autumn trees'),
        photo(`${IMG}/v1794302904/PXL_20261103_073808130_c8ge6e.jpg`, 8160, 4590, '#7d7c77',
          'Shrubs and autumn trees on eroded hillsides'),
        photo(`${IMG}/v1794303591/PXL_20261103_073812426_tbj1kk.jpg`, 4080, 2295, '#8d8a82',
          'Eroded hills with a small green field on the valley floor'),
        photo(`${IMG}/v1794303590/PXL_20261103_081036778_xpgbd4.jpg`, 4080, 2295, '#8f8b86',
          'Pale, eroded mountain slopes under passing clouds'),
        photo(`${IMG}/v1794302908/PXL_20261103_081044607_scflhd.jpg`, 8160, 4590, '#95908b',
          'A mountain range with bare, light-coloured slopes and a lone autumn tree'),
        photo(`${IMG}/v1794302903/PXL_20261103_081048076_gokrlr.jpg`, 8160, 4590, '#868688',
          'Panorama of the mountains with autumn vegetation in the foreground'),
        photo(`${IMG}/v1794302909/PXL_20261103_092019629_qyqqjo.jpg`, 4590, 8160, '#85847e',
          'A stone path running down a hillside towards a lake'),
        photo(`${IMG}/v1794302903/PXL_20261103_092025739_vymrq1.jpg`, 4590, 8160, '#888988',
          'A reservoir between steep slopes, seen past a pine tree'),
        photo(`${IMG}/v1794302908/PXL_20261103_092027908_sipyau.jpg`, 4590, 8160, '#898a8a',
          'The reservoir and its shoreline framed by a young pine'),
        photo(`${IMG}/v1794302905/PXL_20261103_092401877_s5d3sg.jpg`, 4590, 8160, '#888e95',
          'The reservoir stretching between mountains, with trees in the foreground'),
        photo(`${IMG}/v1794302909/PXL_20261103_092407874_ogrr2z.jpg`, 8160, 4590, '#8a8a87',
          'Panoramic view of a reservoir among mountains, with fish-farm cages on the water'),
        photo(`${IMG}/v1794302903/PXL_20261103_092410231_avtvx8.jpg`, 8160, 4590, '#8d8f93',
          'Mountains reflected in the calm water of the reservoir'),
        photo(`${IMG}/v1794302906/PXL_20261103_092416579_a70whv.jpg`, 4590, 8160, '#898e92',
          'The reservoir winding away between the mountains'),
        photo(`${IMG}/v1794302908/PXL_20261103_092551927_ywkbat.jpg`, 8160, 4590, '#878784',
          'A viewpoint with a Turkish flag overlooking the reservoir'),
        photo(`${IMG}/v1794302906/PXL_20261103_092553782_a4gfg1.jpg`, 8160, 4590, '#8f9090',
          'The Turkish flag at the viewpoint above the lake'),
        photo(`${IMG}/v1794302906/PXL_20261103_101925546_mdggiw.jpg`, 8160, 4590, '#7f7f7a',
          'The lake and surrounding hills under a cloudy sky'),
        photo(`${IMG}/v1794302903/PXL_20261103_103216894_jqstn0.jpg`, 4590, 8160, '#67655c',
          'Close-up of a purple autumn crocus flowering in dry grass'),
        photo(`${IMG}/v1794303590/PXL_20261103_110337314_rrsxq9.jpg`, 2295, 4080, '#6b6862',
          'Dark, eroded soil on a hillside, with pines on the slope behind'),
        photo(`${IMG}/v1794303590/PXL_20261103_130416029_ribdco.jpg`, 4080, 2295, '#878381',
          'The group studies an exposed soil and rock profile in a road cut'),
        photo(`${IMG}/v1794302908/PXL_20261103_130421821_nmmnos.jpg`, 8160, 4590, '#7f7b7a',
          'Wide view of the road cut, with the group standing at its base'),
        photo(`${IMG}/v1794303590/PXL_20261103_130454981_ed3qxj.jpg`, 2295, 4080, '#787573',
          'Participants gathered below the road-cut profile'),
        photo(`${IMG}/v1794303589/PXL_20261103_130459067_mzk1zk.jpg`, 4080, 2295, '#79736e',
          'The group in front of the layered road-cut exposure'),
        photo(`${IMG}/v1794303590/PXL_20261103_130501384_owraay.jpg`, 4080, 2295, '#807a75',
          'Participants listen at the foot of the road cut'),
      ],
    },
    /*
     * Adding Day 3:
     * {
     *   slug: 'dia-3', number: 3, title: 'Photos & videos', date: '2026-11-04',
     *   mosaic: ['<id>', '<id>', '<id>', '<id>'],   // optional; first = cover of the day
     *   media: [
     *     photo(`${IMG}/v…/PXL_…_abc123.jpg`, 8160, 4590, '#7a6d63', 'What the photo shows'),
     *     video(`${VID}/v…/PXL_…_def456.mp4`, 1280, 720, '#896c63', 12.3, 'What the clip shows'),
     *   ],
     * },
     */
  ],
}

export default adiyaman
