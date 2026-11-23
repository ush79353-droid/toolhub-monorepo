/** Sex for Enright–Sherrill sex-specific reference equations. */
export type Sex = 'male' | 'female';

/** Height display unit (canonical math uses cm). */
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';

/** Weight display unit (canonical math uses kg). */
export type WeightUnit = 'kg' | 'lb';

/** Walk-distance display unit (canonical math uses metres). */
export type DistanceUnit = 'm' | 'ft' | 'yd' | 'km';

export interface SixMinuteWalkTestInput {
  sex: Sex;
  ageYears: string;
  heightValue: string;
  heightUnit: HeightUnit;
  weightValue: string;
  weightUnit: WeightUnit;
  /** Observed 6MWD for % predicted (optional until comparison opened). */
  observedDistance: string;
  observedUnit: DistanceUnit;
  /** Display unit for the predicted healthy-person distance. */
  predictedUnit: DistanceUnit;
  comparisonOpen: boolean;
}

export interface SixMinuteWalkTestResult {
  /** Predicted 6MWD in metres (Enright–Sherrill), or null when suppressed. */
  predictedMeters: number | null;
  predictedDisplay: string;
  predictedUnit: DistanceUnit;
  observedMeters: number | null;
  percentOfExpected: number | null;
  percentDisplay: string;
  domainOk: boolean;
  domainMessage: string | null;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type SixMinuteWalkTestFieldErrors = {
  form?: string;
  ageYears?: string;
  heightValue?: string;
  weightValue?: string;
  observedDistance?: string;
};

/**
 * Screenshot defaults: Male selected; blank age/height/weight/predicted;
 * comparison section expanded with blank observed distance and % field.
 */
export function createDefaultInput(): SixMinuteWalkTestInput {
  return {
    sex: 'male',
    ageYears: '',
    heightValue: '',
    heightUnit: 'cm',
    weightValue: '',
    weightUnit: 'kg',
    observedDistance: '',
    observedUnit: 'm',
    predictedUnit: 'm',
    comparisonOpen: true,
  };
}

export function createEmptyInput(): SixMinuteWalkTestInput {
  return createDefaultInput();
}

/** Educational fixture inside the Enright–Sherrill 40–80 y derivation band. */
export function createExampleInput(): SixMinuteWalkTestInput {
  return {
    sex: 'male',
    ageYears: '50',
    heightValue: '170',
    heightUnit: 'cm',
    weightValue: '70',
    weightUnit: 'kg',
    observedDistance: '603.7',
    observedUnit: 'm',
    predictedUnit: 'm',
    comparisonOpen: true,
  };
}

export function inputsEqual(
  a: SixMinuteWalkTestInput,
  b: SixMinuteWalkTestInput,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const HEIGHT_UNIT_LABELS: Record<HeightUnit, string> = {
  cm: 'cm',
  m: 'm',
  in: 'in',
  ft: 'ft',
};

export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  kg: 'kg',
  lb: 'lb',
};

export const DISTANCE_UNIT_LABELS: Record<DistanceUnit, string> = {
  m: 'm',
  ft: 'ft',
  yd: 'yd',
  km: 'km',
};
