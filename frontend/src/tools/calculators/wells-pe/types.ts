/**
 * Wells Criteria for Pulmonary Embolism — educational pretest score.
 * Published point weights (Wells et al.).
 */

export interface WellsPeInput {
  clinicalDvtSigns: boolean;
  heartRateOver100: boolean;
  immobilizationOrSurgery: boolean;
  priorDvtOrPe: boolean;
  hemoptysis: boolean;
  malignancy: boolean;
  /** PE as likely as or more likely than an alternative diagnosis (+3). */
  peAsLikelyOrMore: boolean;
}

export type TwoLevelBand = 'unlikely' | 'likely';
export type ThreeLevelBand = 'low' | 'intermediate' | 'high';

export interface WellsPeResult {
  score: number;
  formattedScore: string;
  twoLevel: TwoLevelBand;
  twoLevelTitle: string;
  twoLevelDetail: string;
  threeLevel: ThreeLevelBand;
  threeLevelTitle: string;
  threeLevelDetail: string;
  disclaimer: string;
  sourceLabel: string;
}

export type WellsPeFieldErrors = { form?: string };

/** Screenshot defaults — all unchecked → score 0. */
export function createDefaultInput(): WellsPeInput {
  return {
    clinicalDvtSigns: false,
    heartRateOver100: false,
    immobilizationOrSurgery: false,
    priorDvtOrPe: false,
    hemoptysis: false,
    malignancy: false,
    peAsLikelyOrMore: false,
  };
}

export function createEmptyInput(): WellsPeInput {
  return createDefaultInput();
}

/** Clinical DVT signs alone → 3 (unlikely / intermediate). */
export function createExampleInput(): WellsPeInput {
  return { ...createDefaultInput(), clinicalDvtSigns: true };
}

export function inputsEqual(a: WellsPeInput, b: WellsPeInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const FACTOR_OPTIONS: readonly {
  key: keyof WellsPeInput;
  label: string;
  detail?: string;
  points: number;
}[] = [
  {
    key: 'clinicalDvtSigns',
    label: 'Clinical symptoms of DVT',
    detail:
      'Objectively measured leg swelling and pain with palpation in the deep vein localization',
    points: 3,
  },
  {
    key: 'heartRateOver100',
    label: 'Heart rate > 100 bpm',
    points: 1.5,
  },
  {
    key: 'immobilizationOrSurgery',
    label:
      'Immobilization for 3 or more consecutive days or surgery in the last 4 weeks',
    points: 1.5,
  },
  {
    key: 'priorDvtOrPe',
    label:
      'History of objectively diagnosed episodes of deep vein thrombosis (DVT) or pulmonary embolism?',
    points: 1.5,
  },
  {
    key: 'hemoptysis',
    label: 'Hemoptysis',
    detail: 'Coughing up of blood',
    points: 1,
  },
  {
    key: 'malignancy',
    label: 'Malignancy',
    detail:
      'Treated cancer or cancer treatment stopped in the last 6 months or palliative care due to cancer',
    points: 1,
  },
  {
    key: 'peAsLikelyOrMore',
    label:
      'PE (pulmonary embolism) as likely as (or more likely than) an alternative diagnosis',
    points: 3,
  },
];
