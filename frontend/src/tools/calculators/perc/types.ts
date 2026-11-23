/** PERC rule — Kline et al. / ACEP educational checklist. */

export type PercCriterionId =
  | 'ageGe50'
  | 'heartRateGe100'
  | 'o2SatBelow95'
  | 'unilateralLegSwelling'
  | 'hemoptysis'
  | 'priorDvtPe'
  | 'recentSurgeryTrauma'
  | 'exogenousEstrogen';

export interface PercCriteriaFlags {
  ageGe50: boolean;
  heartRateGe100: boolean;
  o2SatBelow95: boolean;
  unilateralLegSwelling: boolean;
  hemoptysis: boolean;
  priorDvtPe: boolean;
  recentSurgeryTrauma: boolean;
  exogenousEstrogen: boolean;
}

export interface PercInput {
  /** Clinician confirms pretest PE probability is low (&lt;15%). */
  lowPretestProbabilityConfirmed: boolean;
  /** Unchecked boxes count as absent only after this attestation. */
  allCriteriaAssessed: boolean;
  criteria: PercCriteriaFlags;
}

export type PercInterpretationKind =
  | 'ineligible_pretest'
  | 'incomplete_assessment'
  | 'positive_criterion'
  | 'rule_out';

export interface PercResult {
  positiveCount: number;
  formattedPositiveCount: string;
  interpretationKind: PercInterpretationKind;
  interpretation: string;
  detailNote: string;
  disclaimer: string;
  sourceLabel: string;
}

export type PercFieldErrors = { form?: string };

export const CRITERION_OPTIONS: readonly {
  key: keyof PercCriteriaFlags;
  label: string;
  tip: string;
}[] = [
  {
    key: 'ageGe50',
    label: 'Patient is 50 years old or older',
    tip: 'PERC age criterion: age ≥50 years (50 counts).',
  },
  {
    key: 'heartRateGe100',
    label: 'Patient’s heart rate is 100 beats per minute or faster',
    tip: 'Heart rate ≥100 bpm (100 counts).',
  },
  {
    key: 'o2SatBelow95',
    label: 'Room air O₂ saturation is below 95%',
    tip: 'Room-air oxygen saturation &lt;95% (95% does not count).',
  },
  {
    key: 'unilateralLegSwelling',
    label: 'Unilateral leg swelling is present',
    tip: 'Clinical unilateral leg swelling.',
  },
  {
    key: 'hemoptysis',
    label: 'Hemoptysis occurs or the patient is coughing up blood',
    tip: 'Hemoptysis or hemoptysis-sized blood in sputum.',
  },
  {
    key: 'priorDvtPe',
    label: 'Patient has prior history of pulmonary embolism or deep venous thrombosis',
    tip: 'Personal history of PE or DVT.',
  },
  {
    key: 'recentSurgeryTrauma',
    label: 'Undergone surgery or trauma at most 4 weeks ago',
    tip: 'Qualifying surgery or significant trauma within four weeks.',
  },
  {
    key: 'exogenousEstrogen',
    label:
      'Patient is using hormones (oral contraception, hormone replacement therapy or other estrogenic hormone use)',
    tip: 'Exogenous estrogen — OCP, HRT, or other estrogenic therapy.',
  },
];

export function createEmptyCriteria(): PercCriteriaFlags {
  return {
    ageGe50: false,
    heartRateGe100: false,
    o2SatBelow95: false,
    unilateralLegSwelling: false,
    hemoptysis: false,
    priorDvtPe: false,
    recentSurgeryTrauma: false,
    exogenousEstrogen: false,
  };
}

export function createEmptyInput(): PercInput {
  return {
    lowPretestProbabilityConfirmed: false,
    allCriteriaAssessed: false,
    criteria: createEmptyCriteria(),
  };
}

/** Screenshot fixture: none ticked, eligible, assessed → count 0. */
export function createScreenshotExampleInput(): PercInput {
  return {
    lowPretestProbabilityConfirmed: true,
    allCriteriaAssessed: true,
    criteria: createEmptyCriteria(),
  };
}

export function createPositiveExampleInput(): PercInput {
  return {
    lowPretestProbabilityConfirmed: true,
    allCriteriaAssessed: true,
    criteria: {
      ...createEmptyCriteria(),
      heartRateGe100: true,
      hemoptysis: true,
    },
  };
}

export function inputsEqual(a: PercInput, b: PercInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}