/**
 * Soil Science Quiz — Question Bank
 * 22 questions, each with 1 correct answer and 3 plausible distractors.
 * On each session, 10 random questions are selected and answers are shuffled.
 */

export const ALL_QUESTIONS = [
  // ── Basic soil science ──────────────────────────────────────────────────────
  {
    id: 1,
    question: 'Which of the following is a component of soil?',
    correct: 'All of the above (minerals, organic matter, water, and air)',
    distractors: ['Minerals only', 'Water and air only', 'Organic matter and water only'],
  },
  {
    id: 2,
    question: 'Which soil horizon is usually richest in organic matter?',
    correct: 'O/A horizon',
    distractors: ['C horizon', 'R horizon', 'B horizon'],
  },
  {
    id: 3,
    question: 'Which soil property is most directly related to acidity or alkalinity?',
    correct: 'pH',
    distractors: ['Electrical conductivity', 'Texture', 'Bulk density'],
  },
  {
    id: 4,
    question: 'Which soil texture usually allows water to drain the fastest?',
    correct: 'Sandy',
    distractors: ['Clayey', 'Loamy', 'Silty'],
  },
  {
    id: 5,
    question: 'Which of the following organisms are part of soil biota?',
    correct: 'All of the above (bacteria, fungi, earthworms, and nematodes)',
    distractors: ['Bacteria only', 'Fungi only', 'Earthworms and bacteria only'],
  },
  {
    id: 6,
    question: 'What is the process called in which soil particles are removed by water or wind?',
    correct: 'Erosion',
    distractors: ['Salinisation', 'Compaction', 'Humification'],
  },
  {
    id: 7,
    question: 'Which property most strongly influences water retention in soil?',
    correct: 'Texture and structure',
    distractors: ['Colour', 'Latitude', 'Surface stones only'],
  },
  {
    id: 8,
    question: 'What does SOC stand for?',
    correct: 'Soil Organic Carbon',
    distractors: ['Soil Oxidation Capacity', 'Soil Organic Composition', 'Standard Organic Carbon'],
  },
  {
    id: 9,
    question: 'Why is soil organic matter important?',
    correct: 'All of the above (structure, water retention, nutrients, and carbon)',
    distractors: ['It improves drainage only', 'It replaces lost minerals', 'It reduces microbial activity'],
  },
  {
    id: 10,
    question: 'What may high electrical conductivity in soil indicate?',
    correct: 'Possible high salinity',
    distractors: ['Low salt content', 'Low organic carbon', 'Excess clay only'],
  },
  {
    id: 11,
    question: 'Which of the following soil threats is common in Mediterranean Europe?',
    correct: 'All of the above (erosion, loss of organic matter, desertification, and soil sealing)',
    distractors: ['Erosion only', 'Loss of organic matter only', 'Soil sealing only'],
  },
  // ── True or false (presented as 4-option MCQ) ───────────────────────────────
  {
    id: 12,
    question: 'True or false: soil is a practically non-renewable resource on a human timescale.',
    correct: 'True',
    distractors: ['False', 'Only in arid regions', 'Only in tropical soils'],
  },
  {
    id: 13,
    question: 'True or false: healthy soil is only important for agriculture.',
    correct: 'False',
    distractors: ['True', 'Only in intensive farming systems', 'Only for small-scale farms'],
  },
  {
    id: 14,
    question: 'True or false: soil biodiversity plays a role in nutrient cycling.',
    correct: 'True',
    distractors: ['False', 'Only in wet soils', 'Only in tropical soils'],
  },
  {
    id: 15,
    question: 'True or false: compacted soil usually allows better water infiltration.',
    correct: 'False',
    distractors: ['True', 'Only in sandy soils', 'Only in clay-rich soils'],
  },
  {
    id: 16,
    question: 'True or false: soil colour can provide clues about organic matter, drainage, or mineral content.',
    correct: 'True',
    distractors: ['False', 'Only in subsoil horizons', 'Only in topsoil horizons'],
  },
  // ── EU soil policy and legislation ──────────────────────────────────────────
  {
    id: 17,
    question: 'What does the European Soil Monitoring Law mainly focus on?',
    correct: 'Monitoring, assessment, and resilience of soils',
    distractors: ['Fertiliser prices', 'Inland fisheries', 'Organic certification only'],
  },
  {
    id: 18,
    question: 'According to EU policy, by what year should healthy soils be achieved?',
    correct: '2050',
    distractors: ['2030', '2040', '2060'],
  },
  {
    id: 19,
    question: 'Which of the following is one of the aims of the EU Soil Mission "A Soil Deal for Europe"?',
    correct: 'Create 100 living labs and lighthouses by 2030',
    distractors: ['Eliminate all chemical fertilisers before 2030', 'Ban tillage across Europe', 'Centralise all soil mapping in one EU laboratory'],
  },
  // ── Final mini quiz ──────────────────────────────────────────────────────────
  {
    id: 20,
    question: 'How long does it usually take to form a few centimetres of fertile soil?',
    correct: 'Decades to centuries',
    distractors: ['Days', 'Years', 'Weeks'],
  },
  {
    id: 21,
    question: 'Which land use is most commonly associated with soil sealing?',
    correct: 'Urbanisation and infrastructure',
    distractors: ['Grasslands', 'Forests', 'Organic farming'],
  },
  {
    id: 22,
    question: 'Which discipline studies soil distribution across landscapes and soil classification?',
    correct: 'Pedology / Soil science',
    distractors: ['Hydrology', 'Limnology', 'Palynology'],
  },
]

/** Number of questions to show per quiz session */
export const QUESTIONS_PER_SESSION = 10

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * Returns a new array — does not mutate the original.
 */
export function shuffle(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Builds a ready-to-use quiz session:
 * - Randomly selects QUESTIONS_PER_SESSION questions
 * - Shuffles the answer options for each question
 */
export function buildSession() {
  const selected = shuffle(ALL_QUESTIONS).slice(0, QUESTIONS_PER_SESSION)
  return selected.map((q) => ({
    ...q,
    options: shuffle([q.correct, ...q.distractors]),
  }))
}
