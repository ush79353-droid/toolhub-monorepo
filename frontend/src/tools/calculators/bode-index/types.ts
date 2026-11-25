/** BODE Index (Celli et al., NEJM 2004) — screenshot-first (ADR-023). */

export type Fev1Band = 'ge65' | '50to64' | '36to49' | 'le35' | '';
export type WalkBand = 'ge350' | '250to349' | '150to249' | 'le149' | '';
export type MmrcBand = '0or1' | '2' | '3' | '4' | '';

export interface BodeIndexInput {
  /** Checked = BMI > 21 (0 pts). Unchecked after touch = BMI ≤ 21 (1 pt). null = unanswered. */
  bmiOver21: boolean | null;
  fev1: Fev1Band;
  walk: WalkBand;
  mmrc: MmrcBand;
}

export interface BodeIndexPoints {
  bmi: number;
  fev1: number;
  walk: number;
  mmrc: number;
}

export interface BodeIndexResult {
  score: number | null;
  points: BodeIndexPoints | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BodeIndexFieldErrors = {
  form?: string;
};

export function createDefaultInput(): BodeIndexInput {
  return {
    bmiOver21: null,
    fev1: '',
    walk: '',
    mmrc: '',
  };
}

export function createEmptyInput(): BodeIndexInput {
  return createDefaultInput();
}

/** Max score fixture: BMI ≤21, FEV1 ≤35, walk ≤149, mMRC 4 → 10. */
export function createExampleInput(): BodeIndexInput {
  return {
    bmiOver21: false,
    fev1: 'le35',
    walk: 'le149',
    mmrc: '4',
  };
}

export function inputsEqual(a: BodeIndexInput, b: BodeIndexInput): boolean {
  return (
    a.bmiOver21 === b.bmiOver21 &&
    a.fev1 === b.fev1 &&
    a.walk === b.walk &&
    a.mmrc === b.mmrc
  );
}

export const FEV1_OPTIONS: readonly { value: Exclude<Fev1Band, ''>; label: string }[] = [
  { value: 'ge65', label: '65% or more' },
  { value: '50to64', label: '50-64%' },
  { value: '36to49', label: '36-49%' },
  { value: 'le35', label: '35% or less' },
];

export const WALK_OPTIONS: readonly { value: Exclude<WalkBand, ''>; label: string }[] = [
  { value: 'ge350', label: '350 m (383 yds) or more' },
  { value: '250to349', label: '250-349 m (273-382 yds)' },
  { value: '150to249', label: '150-249 m (164-272 yds)' },
  { value: 'le149', label: '149 m (163 yds) or less' },
];

export const MMRC_OPTIONS: readonly { value: Exclude<MmrcBand, ''>; label: string }[] = [
  { value: '0or1', label: '0 or 1 point' },
  { value: '2', label: '2 points' },
  { value: '3', label: '3 points' },
  { value: '4', label: '4 points' },
];
