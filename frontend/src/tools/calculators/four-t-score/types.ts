/** 4Ts pretest probability score for HIT (Warkentin / Loikou / Cuker). */

export type PlateletFall = 'under30' | '30to50' | 'over50';

export type PlateletNadir = 'under10' | '10to19' | 'ge20';

/** Timing criterion — each maps to 0, 1, or 2 points in calculation.ts. */
export type FourTTiming =
  | 'onset_under4_no_heparin'
  | 'clear_onset_5_10'
  | 'fall_1day_heparin_within_30d'
  | 'consistent_5_10_unclear'
  | 'onset_after_day_10'
  | 'fall_1day_heparin_30_100d';

export type FourTThrombosis =
  | 'none'
  | 'new_thrombosis_necrosis_asr'
  | 'progressive_recurrent_suspected';

export type OtherCauses = 'none' | 'possible' | 'definite';

export type HitProbabilityBand = 'low' | 'intermediate' | 'high';

export interface FourTScoreInput {
  plateletFall: PlateletFall;
  timing: FourTTiming;
  plateletNadir: PlateletNadir;
  thrombosis: FourTThrombosis;
  otherCauses: OtherCauses;
}

export interface FourTScoreResult {
  score: number;
  formattedScore: string;
  thrombocytopeniaPoints: number;
  timingPoints: number;
  thrombosisPoints: number;
  otherCausesPoints: number;
  probabilityBand: HitProbabilityBand;
  interpretation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type FourTScoreFieldErrors = { form?: string };

/** Screenshot defaults → total 0, low (~5%). */
export function createDefaultInput(): FourTScoreInput {
  return {
    plateletFall: 'under30',
    timing: 'onset_under4_no_heparin',
    plateletNadir: 'under10',
    thrombosis: 'none',
    otherCauses: 'definite',
  };
}

export function createEmptyInput(): FourTScoreInput {
  return createDefaultInput();
}

/** Typical intermediate pretest example (~4–5 points). */
export function createExampleInput(): FourTScoreInput {
  return {
    plateletFall: '30to50',
    timing: 'consistent_5_10_unclear',
    plateletNadir: '10to19',
    thrombosis: 'progressive_recurrent_suspected',
    otherCauses: 'possible',
  };
}

export function inputsEqual(a: FourTScoreInput, b: FourTScoreInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const PLATELET_FALL_OPTIONS: readonly {
  value: PlateletFall;
  label: string;
}[] = [
  { value: 'under30', label: '<30%' },
  { value: '30to50', label: '30–50%' },
  { value: 'over50', label: '>50%' },
];

export const PLATELET_NADIR_OPTIONS: readonly {
  value: PlateletNadir;
  label: string;
}[] = [
  { value: 'under10', label: '<10 × 10⁹/L' },
  { value: '10to19', label: '10–19.9 × 10⁹/L' },
  { value: 'ge20', label: '≥20 × 10⁹/L' },
];

export const TIMING_OPTIONS: readonly {
  value: FourTTiming;
  label: string;
}[] = [
  {
    value: 'onset_under4_no_heparin',
    label: 'Onset <4 days, no heparin exposure within 100 days',
  },
  {
    value: 'clear_onset_5_10',
    label: 'Clear onset between days 5–10 after heparin start',
  },
  {
    value: 'fall_1day_heparin_within_30d',
    label: 'Platelet fall ≤1 day, prior heparin ≤30 days',
  },
  {
    value: 'consistent_5_10_unclear',
    label: 'Consistent with days 5–10 but timing unclear',
  },
  {
    value: 'onset_after_day_10',
    label: 'Onset after day 10 (or fall >10 days after heparin stop)',
  },
  {
    value: 'fall_1day_heparin_30_100d',
    label: 'Platelet fall ≤1 day, prior heparin 30–100 days',
  },
];

export const THROMBOSIS_OPTIONS: readonly {
  value: FourTThrombosis;
  label: string;
}[] = [
  { value: 'none', label: 'None' },
  {
    value: 'new_thrombosis_necrosis_asr',
    label:
      'New thrombosis, skin necrosis, or acute systemic reaction after IV UFH bolus',
  },
  {
    value: 'progressive_recurrent_suspected',
    label:
      'Progressive/recurrent thrombosis, non-necrotizing skin lesions, or suspected thrombosis',
  },
];

export const OTHER_CAUSES_OPTIONS: readonly {
  value: OtherCauses;
  label: string;
}[] = [
  { value: 'none', label: 'None' },
  { value: 'possible', label: 'Possible' },
  { value: 'definite', label: 'Definite' },
];