/** Display units — canonical math uses L/min, bpm, mL, cm, kg, m². */

export type CoUnit = 'L/min' | 'mL/min';
export type SvUnit = 'mL' | 'L';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';
export type BsaUnit = 'm2' | 'ft2';

export interface StrokeVolumeInput {
  cardiacOutput: string;
  coUnit: CoUnit;
  heartRateBpm: string;
  svUnit: SvUnit;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  bsaUnit: BsaUnit;
  strokeVolumeOpen: boolean;
  bsaOpen: boolean;
  indicesOpen: boolean;
}

/**
 * Partial educational result — each metric fills when its own inputs exist.
 * SV needs CO+HR; BSA needs height+weight; CI needs CO+BSA; SVI needs SV+BSA.
 */
export interface StrokeVolumeResult {
  strokeVolumeMl: number | null;
  bsaM2: number | null;
  cardiacIndex: number | null;
  strokeVolumeIndex: number | null;
  formattedSv: string;
  formattedBsa: string;
  formattedCi: string;
  formattedSvi: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type StrokeVolumeFieldErrors = {
  form?: string;
  cardiacOutput?: string;
  heartRateBpm?: string;
  heightValue?: string;
  weightValue?: string;
};

/** Screenshot defaults: all numeric fields blank; three panels expanded. */
export function createDefaultInput(): StrokeVolumeInput {
  return {
    cardiacOutput: '',
    coUnit: 'L/min',
    heartRateBpm: '',
    svUnit: 'mL',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    bsaUnit: 'm2',
    strokeVolumeOpen: true,
    bsaOpen: true,
    indicesOpen: true,
  };
}

export function createEmptyInput(): StrokeVolumeInput {
  return createDefaultInput();
}

/**
 * Educational fixture from prompt:
 * CO 5 L/min · HR 100 bpm · BSA 2 m² → SV 50 mL · CI 2.5 · SVI 25.
 * Height/weight chosen so Mosteller ≈ 2 m² (√(180×80/3600) = 2).
 */
export function createExampleInput(): StrokeVolumeInput {
  return {
    ...createDefaultInput(),
    cardiacOutput: '5',
    heartRateBpm: '100',
    heightValue: '180',
    weightValue: '80',
  };
}

export function inputsEqual(
  a: StrokeVolumeInput,
  b: StrokeVolumeInput
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const CO_UNIT_LABELS: Record<CoUnit, string> = {
  'L/min': 'L/min',
  'mL/min': 'mL/min',
};

export const SV_UNIT_LABELS: Record<SvUnit, string> = {
  mL: 'mL',
  L: 'L',
};

export const HEIGHT_UNIT_LABELS: Record<HeightUnit, string> = {
  cm: 'cm',
  in: 'in',
};

export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  kg: 'kg',
  lb: 'lb',
};

export const BSA_UNIT_LABELS: Record<BsaUnit, string> = {
  m2: 'm²',
  ft2: 'ft²',
};
