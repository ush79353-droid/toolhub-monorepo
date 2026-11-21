import type { BandPercentile, ChartPercentile } from './datasets';

export type WeightUnit = 'g' | 'kg' | 'lb';

export type DayUnit = 'days';

export interface BirthWeightPercentileInput {
  weeks: string;
  days: string;
  dayUnit: DayUnit;
  weight: string;
  weightUnit: WeightUnit;
}

export type BirthWeightPercentileFieldErrors = {
  form?: string;
  weeks?: string;
  days?: string;
  weight?: string;
};

export type PercentileBandKind =
  | 'below'
  | 'between'
  | 'at'
  | 'above'
  | 'unavailable';

export interface BirthWeightPercentileResult {
  gestationalDay: number;
  weeks: number;
  days: number;
  weightGrams: number;
  weightUnit: WeightUnit;
  /** Interpolated reference weights (g) at the entered age. */
  thresholdsGrams: Readonly<Record<BandPercentile, number>>;
  chartCurves: readonly {
    percentile: ChartPercentile;
    points: readonly { week: number; grams: number }[];
  }[];
  bandKind: PercentileBandKind;
  lowerPercentile: BandPercentile | null;
  upperPercentile: BandPercentile | null;
  exactPercentile: BandPercentile | null;
  headline: string;
  accessibleChartSummary: string;
  sourceNote: string;
  disclaimer: string;
}

/** Blank clinical fields — screenshot fixture is an engine test only (not a medical default). */
export function createDefaultInput(): BirthWeightPercentileInput {
  return {
    weeks: '',
    days: '0',
    dayUnit: 'days',
    weight: '',
    weightUnit: 'g',
  };
}

export function createEmptyInput(): BirthWeightPercentileInput {
  return createDefaultInput();
}

/** Omni/screenshot fixture for tests: 35+4, 2360 g → between 10th and 25th on FMF BW. */
export function createExampleInput(): BirthWeightPercentileInput {
  return {
    weeks: '35',
    days: '4',
    dayUnit: 'days',
    weight: '2360',
    weightUnit: 'g',
  };
}

export function inputsEqual(
  a: BirthWeightPercentileInput,
  b: BirthWeightPercentileInput,
): boolean {
  return (
    a.weeks === b.weeks &&
    a.days === b.days &&
    a.dayUnit === b.dayUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit
  );
}

export function hasBirthWeightPercentileChanges(
  input: BirthWeightPercentileInput,
): boolean {
  return !inputsEqual(input, createDefaultInput());
}
