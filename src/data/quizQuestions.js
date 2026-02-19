/**
 * Soil Science Quiz — Question Bank
 * 15 questions, each with 1 correct answer and 3 plausible distractors.
 * On each session, 10 random questions are selected and answers are shuffled.
 */

export const ALL_QUESTIONS = [
  {
    id: 1,
    question: 'What does pH measure in soil?',
    correct: 'Acidity or alkalinity',
    distractors: ['Mineral content', 'Organic matter percentage', 'Soil temperature'],
  },
  {
    id: 2,
    question: 'Which organism plays a key role in decomposing organic matter in soil?',
    correct: 'Earthworms',
    distractors: ['Aphids', 'Weevils', 'Gnats'],
  },
  {
    id: 3,
    question: 'What is the main function of topsoil?',
    correct: 'Supports plant growth',
    distractors: ['Stores deep water reserves', 'Contains mostly bedrock minerals', 'Reflects solar radiation'],
  },
  {
    id: 4,
    question: 'Soil erosion is primarily caused by which agents?',
    correct: 'Wind and water',
    distractors: ['Frost and gravity', 'Temperature change and sunlight', 'Plant roots and fungi'],
  },
  {
    id: 5,
    question: 'Which soil horizon is mainly composed of weathered parent material?',
    correct: 'C horizon',
    distractors: ['A horizon', 'B horizon', 'O horizon'],
  },
  {
    id: 6,
    question: 'The B horizon in a soil profile is known for:',
    correct: 'Clay accumulation',
    distractors: ['High organic matter content', 'Abundant root development', 'Presence of unweathered bedrock'],
  },
  {
    id: 7,
    question: 'What does soil texture most directly influence?',
    correct: 'Water holding capacity',
    distractors: ['Soil colour', 'Surface temperature', 'pH balance'],
  },
  {
    id: 8,
    question: 'Loam soil is best described as a mixture of:',
    correct: 'Clay, sand, and silt',
    distractors: ['Gravel, clay, and humus', 'Sand, humus, and compost', 'Chalk, peat, and clay'],
  },
  {
    id: 9,
    question: 'The mineral fraction of soil is mainly composed of:',
    correct: 'Sand, silt, and clay',
    distractors: ['Humus, water, and air', 'Nitrogen, carbon, and iron', 'Calcium, potassium, and sulfur'],
  },
  {
    id: 10,
    question: 'What is the ideal pH range for most agricultural crops?',
    correct: '6.5',
    distractors: ['4.5', '8.0', '5.0'],
  },
  {
    id: 11,
    question: 'Which soil texture has the highest water retention?',
    correct: 'Clay',
    distractors: ['Coarse sand', 'Fine gravel', 'Silt loam'],
  },
  {
    id: 12,
    question: 'The scientific process of soil formation is called:',
    correct: 'Pedogenesis',
    distractors: ['Mineralization', 'Humification', 'Oxidation'],
  },
  {
    id: 13,
    question: 'What is leaching in the context of soil science?',
    correct: 'Loss of nutrients carried down by water',
    distractors: ['Accumulation of surface salts', 'Evaporation of soil water', 'Decomposition of organic material'],
  },
  {
    id: 14,
    question: 'Which gas makes up the largest proportion of soil air?',
    correct: 'Nitrogen',
    distractors: ['Oxygen', 'Carbon dioxide', 'Methane'],
  },
  {
    id: 15,
    question: 'Which mineral element is essential for the formation of chlorophyll?',
    correct: 'Magnesium',
    distractors: ['Potassium', 'Calcium', 'Phosphorus'],
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
