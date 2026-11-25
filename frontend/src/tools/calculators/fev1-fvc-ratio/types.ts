/** Educational FEV1/FVC (Tiffeneau) ratio and predicted-ratio worksheet. */

export type CalculationMode = 'real' | 'prediction';
export type VolumeUnit = 'L' | 'mL';
export type Sex = 'female' | 'male';
export type PredictionStudy = 'american1999' | 'european2004';
export type Ethnicity =
  | 'caucasian'
  | 'africanAmerican'
  | 'mexicanAmerican';

export interface Fev1FvcInput {
  mode: CalculationMode;
  fev1: number | null;
  fvc: number | null;
  volumeUnit: VolumeUnit;
  study: PredictionStudy;
  sex: Sex;
  ageYears: number | null;
  ethnicity: Ethnicity;
  heightCm: number | null;
}

export interface Fev1FvcResult {
  ratioPercent: number;
  formattedRatio: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type Fev1FvcFieldErrors = {
  form?: string;
  fev1?: string;
  fvc?: string;
  ageYears?: string;
  heightCm?: string;
};

export function createDefaultInput(): Fev1FvcInput {
  return {
    mode: 'real',
    fev1: null,
    fvc: null,
    volumeUnit: 'L',
    study: 'american1999',
    sex: 'female',
    ageYears: null,
    ethnicity: 'caucasian',
    heightCm: null,
  };
}

export function createEmptyInput(): Fev1FvcInput {
  return createDefaultInput();
}

/** Real ratio fixture: 3 L / 4 L → 75%. */
export function createExampleRealInput(): Fev1FvcInput {
  return {
    ...createDefaultInput(),
    mode: 'real',
    fev1: 3,
    fvc: 4,
    volumeUnit: 'L',
  };
}

/** Hankinson Caucasian male age 40 → 88.066 − 0.2066×40 = 79.802%. */
export function createExampleAmericanPredictionInput(): Fev1FvcInput {
  return {
    ...createDefaultInput(),
    mode: 'prediction',
    study: 'american1999',
    sex: 'male',
    ageYears: 40,
    ethnicity: 'caucasian',
  };
}

export function inputsEqual(a: Fev1FvcInput, b: Fev1FvcInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
