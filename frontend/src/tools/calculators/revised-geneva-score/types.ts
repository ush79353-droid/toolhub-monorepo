/** Revised Geneva Score (Le Gal 2006) — educational PE pretest probability. */

export type YesNo = 'yes' | 'no';

/** Heart-rate bands: <75 → 0; 75–94 → 3; ≥95 → 5 (published revised Geneva). */
export type HeartRateBand = 'under75' | '75to94' | 'ge95';

export interface RevisedGenevaInput {
  ageOver65: boolean;
  surgeryOrFractureLastMonth: boolean;
  activeMalignancy: boolean;
  priorDvtOrPe: YesNo;
  heartRateBand: HeartRateBand;
  unilateralLowerLimbPain: YesNo;
  /** Published criterion: pain on deep venous palpation AND unilateral edema. */
  deepVenousPainAndUnilateralEdema: YesNo;
  hemoptysis: YesNo;
}

export type TwoLevelBand = 'unlikely' | 'likely';
export type ThreeLevelBand = 'low' | 'intermediate' | 'high';

export interface RevisedGenevaResult {
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

export type RevisedGenevaFieldErrors = { form?: string };

/** Screenshot defaults → score 0. */
export function createDefaultInput(): RevisedGenevaInput {
  return {
    ageOver65: false,
    surgeryOrFractureLastMonth: false,
    activeMalignancy: false,
    priorDvtOrPe: 'no',
    heartRateBand: 'under75',
    unilateralLowerLimbPain: 'no',
    deepVenousPainAndUnilateralEdema: 'no',
    hemoptysis: 'no',
  };
}

export function createEmptyInput(): RevisedGenevaInput {
  return createDefaultInput();
}

/** Age + surgery + HR ≥95 → 1+2+5 = 8 (likely / intermediate). */
export function createExampleInput(): RevisedGenevaInput {
  return {
    ...createDefaultInput(),
    ageOver65: true,
    surgeryOrFractureLastMonth: true,
    heartRateBand: 'ge95',
  };
}

export function inputsEqual(
  a: RevisedGenevaInput,
  b: RevisedGenevaInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const HEART_RATE_OPTIONS: readonly {
  value: HeartRateBand;
  label: string;
  points: number;
}[] = [
  { value: 'under75', label: '<75/min', points: 0 },
  { value: '75to94', label: '75–94/min', points: 3 },
  { value: 'ge95', label: '≥95/min', points: 5 },
];
