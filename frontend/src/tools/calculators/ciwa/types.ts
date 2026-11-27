/**
 * CIWA-Ar educational worksheet (Sullivan et al., Br J Addict 1989).
 * Nine items 0–7; orientation/clouding of sensorium 0–4; max total 67.
 */

export type CiwaItemId =
  | 'nausea'
  | 'tremor'
  | 'sweats'
  | 'anxiety'
  | 'agitation'
  | 'tactile'
  | 'auditory'
  | 'visual'
  | 'headache'
  | 'orientation';

export type CiwaScoreValue = number | null;

export interface CiwaInput {
  nausea: CiwaScoreValue;
  tremor: CiwaScoreValue;
  sweats: CiwaScoreValue;
  anxiety: CiwaScoreValue;
  agitation: CiwaScoreValue;
  tactile: CiwaScoreValue;
  auditory: CiwaScoreValue;
  visual: CiwaScoreValue;
  headache: CiwaScoreValue;
  orientation: CiwaScoreValue;
}

export type CiwaSeverityBand = 'low' | 'moderate' | 'severe' | 'incomplete';

export interface CiwaResult {
  total: number;
  maxTotal: number;
  assessedCount: number;
  allAssessed: boolean;
  band: CiwaSeverityBand;
  bandLabel: string;
  formattedTotal: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type CiwaFieldErrors = {
  form?: string;
} & Partial<Record<CiwaItemId, string>>;

export interface CiwaOption {
  value: number;
  label: string;
}

export interface CiwaItemDef {
  id: CiwaItemId;
  label: string;
  max: 4 | 7;
  prompt: string;
  options: readonly CiwaOption[];
}

/** Official CIWA-Ar item descriptors (Sullivan et al. 1989). Intermediate blanks kept as Score N. */
export const CIWA_ITEMS: readonly CiwaItemDef[] = [
  {
    id: 'nausea',
    label: 'Nausea or vomiting',
    max: 7,
    prompt: 'Do you feel sick to your stomach? Have you vomited?',
    options: [
      { value: 0, label: 'No nausea and no vomiting (0)' },
      { value: 1, label: 'Mild nausea with no vomiting (1)' },
      { value: 2, label: 'Score 2 (intermediate) (2)' },
      { value: 3, label: 'Score 3 (intermediate) (3)' },
      { value: 4, label: 'Intermittent nausea with dry heaves (4)' },
      { value: 5, label: 'Score 5 (intermediate) (5)' },
      { value: 6, label: 'Score 6 (intermediate) (6)' },
      {
        value: 7,
        label: 'Constant nausea, frequent dry heaves and vomiting (7)',
      },
    ],
  },
  {
    id: 'tremor',
    label: 'Tremor',
    max: 7,
    prompt: 'Arms extended and fingers spread apart (observation).',
    options: [
      { value: 0, label: 'No tremor (0)' },
      {
        value: 1,
        label: 'Not visible, but can be felt fingertip to fingertip (1)',
      },
      { value: 2, label: 'Score 2 (intermediate) (2)' },
      { value: 3, label: 'Score 3 (intermediate) (3)' },
      { value: 4, label: 'Moderate, with patient’s arms extended (4)' },
      { value: 5, label: 'Score 5 (intermediate) (5)' },
      { value: 6, label: 'Score 6 (intermediate) (6)' },
      { value: 7, label: 'Severe, even with arms not extended (7)' },
    ],
  },
  {
    id: 'sweats',
    label: 'Paroxysmal sweats',
    max: 7,
    prompt: 'Observation of sweating.',
    options: [
      { value: 0, label: 'No sweat visible (0)' },
      { value: 1, label: 'Barely perceptible sweating, palms moist (1)' },
      { value: 2, label: 'Score 2 (intermediate) (2)' },
      { value: 3, label: 'Score 3 (intermediate) (3)' },
      { value: 4, label: 'Beads of sweat obvious on forehead (4)' },
      { value: 5, label: 'Score 5 (intermediate) (5)' },
      { value: 6, label: 'Score 6 (intermediate) (6)' },
      { value: 7, label: 'Drenching sweats (7)' },
    ],
  },
  {
    id: 'anxiety',
    label: 'Anxiety',
    max: 7,
    prompt: 'Do you feel nervous?',
    options: [
      { value: 0, label: 'No anxiety, at ease (0)' },
      { value: 1, label: 'Mildly anxious (1)' },
      { value: 2, label: 'Score 2 (intermediate) (2)' },
      { value: 3, label: 'Score 3 (intermediate) (3)' },
      {
        value: 4,
        label: 'Moderately anxious, or guarded, so anxiety is inferred (4)',
      },
      { value: 5, label: 'Score 5 (intermediate) (5)' },
      { value: 6, label: 'Score 6 (intermediate) (6)' },
      {
        value: 7,
        label:
          'Equivalent to acute panic states as seen in severe delirium or acute schizophrenic reactions (7)',
      },
    ],
  },
  {
    id: 'agitation',
    label: 'Agitation',
    max: 7,
    prompt: 'Observation of activity.',
    options: [
      { value: 0, label: 'Normal activity (0)' },
      { value: 1, label: 'Somewhat more than normal activity (1)' },
      { value: 2, label: 'Score 2 (intermediate) (2)' },
      { value: 3, label: 'Score 3 (intermediate) (3)' },
      { value: 4, label: 'Moderately fidgety and restless (4)' },
      { value: 5, label: 'Score 5 (intermediate) (5)' },
      { value: 6, label: 'Score 6 (intermediate) (6)' },
      {
        value: 7,
        label:
          'Paces back and forth during most of the interview, or constantly thrashes about (7)',
      },
    ],
  },
  {
    id: 'tactile',
    label: 'Tactile disturbances',
    max: 7,
    prompt:
      'Itching, pins and needles, burning, numbness, or bugs crawling on/under skin?',
    options: [
      { value: 0, label: 'None (0)' },
      {
        value: 1,
        label: 'Very mild itching, pins and needles, burning or numbness (1)',
      },
      {
        value: 2,
        label: 'Mild itching, pins and needles, burning or numbness (2)',
      },
      {
        value: 3,
        label: 'Moderate itching, pins and needles, burning or numbness (3)',
      },
      { value: 4, label: 'Moderately severe hallucinations (4)' },
      { value: 5, label: 'Severe hallucinations (5)' },
      { value: 6, label: 'Extremely severe hallucinations (6)' },
      { value: 7, label: 'Continuous hallucinations (7)' },
    ],
  },
  {
    id: 'auditory',
    label: 'Auditory disturbances',
    max: 7,
    prompt: 'Awareness of sounds; harshness; hearing things not there?',
    options: [
      { value: 0, label: 'Not present (0)' },
      { value: 1, label: 'Very mild harshness or ability to frighten (1)' },
      { value: 2, label: 'Mild harshness or ability to frighten (2)' },
      { value: 3, label: 'Moderate harshness or ability to frighten (3)' },
      { value: 4, label: 'Moderately severe hallucinations (4)' },
      { value: 5, label: 'Severe hallucinations (5)' },
      { value: 6, label: 'Extremely severe hallucinations (6)' },
      { value: 7, label: 'Continuous hallucinations (7)' },
    ],
  },
  {
    id: 'visual',
    label: 'Visual disturbances',
    max: 7,
    prompt: 'Light sensitivity; seeing things not there?',
    options: [
      { value: 0, label: 'Not present (0)' },
      { value: 1, label: 'Very mild sensitivity (1)' },
      { value: 2, label: 'Mild sensitivity (2)' },
      { value: 3, label: 'Moderate sensitivity (3)' },
      { value: 4, label: 'Moderately severe hallucinations (4)' },
      { value: 5, label: 'Severe hallucinations (5)' },
      { value: 6, label: 'Extremely severe hallucinations (6)' },
      { value: 7, label: 'Continuous hallucinations (7)' },
    ],
  },
  {
    id: 'headache',
    label: 'Headache',
    max: 7,
    prompt:
      'Does your head feel different? Band around the head? (Do not rate dizziness.)',
    options: [
      { value: 0, label: 'Not present (0)' },
      { value: 1, label: 'Very mild (1)' },
      { value: 2, label: 'Mild (2)' },
      { value: 3, label: 'Moderate (3)' },
      { value: 4, label: 'Moderately severe (4)' },
      { value: 5, label: 'Severe (5)' },
      { value: 6, label: 'Very severe (6)' },
      { value: 7, label: 'Extremely severe (7)' },
    ],
  },
  {
    id: 'orientation',
    label: 'Orientation',
    max: 4,
    prompt: 'What day is this? Where are you? Who am I?',
    options: [
      { value: 0, label: 'Oriented and can do serial additions (0)' },
      {
        value: 1,
        label: 'Cannot do serial additions or is uncertain about date (1)',
      },
      {
        value: 2,
        label: 'Disoriented for date by no more than 2 calendar days (2)',
      },
      {
        value: 3,
        label: 'Disoriented for date by more than 2 calendar days (3)',
      },
      { value: 4, label: 'Disoriented for place and/or person (4)' },
    ],
  },
];

export const CIWA_ITEM_IDS = CIWA_ITEMS.map((i) => i.id) as CiwaItemId[];

export const CIWA_MAX_TOTAL = 67;

/** Screenshot default: all items observed at 0 (not “unassessed”). */
export function createDefaultInput(): CiwaInput {
  return {
    nausea: 0,
    tremor: 0,
    sweats: 0,
    anxiety: 0,
    agitation: 0,
    tactile: 0,
    auditory: 0,
    visual: 0,
    headache: 0,
    orientation: 0,
  };
}

export function createEmptyInput(): CiwaInput {
  return createDefaultInput();
}

/** Example mid-range total for guide (nausea 4 + tremor 4 + orientation 0 → 8). */
export function createExampleInput(): CiwaInput {
  return {
    ...createDefaultInput(),
    nausea: 4,
    tremor: 4,
  };
}

export function inputsEqual(a: CiwaInput, b: CiwaInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
