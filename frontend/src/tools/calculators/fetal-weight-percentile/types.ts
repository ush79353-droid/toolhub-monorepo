import type { BandPercentile, ChartPercentile } from './datasets';

export type FetalSex = 'girl' | 'boy' | 'unknown';
export type LengthUnit = 'mm' | 'cm';
export type AgeUnit = 'wks';
export type WeightUnit = 'g' | 'kg' | 'lb';

export interface FetalWeightPercentileInput {
  sex: FetalSex;
  weeks: string;
  ageUnit: AgeUnit;
  ac: string;
  hc: string;
  bpd: string;
  fl: string;
  lengthUnit: LengthUnit;
  resultWeightUnit: WeightUnit;
}

export type FetalWeightPercentileFieldErrors = {
  form?: string;
  weeks?: string;
  ac?: string;
  hc?: string;
  bpd?: string;
  fl?: string;
};

export type PercentileBandKind =
  | 'below'
  | 'between'
  | 'at'
  | 'above'
  | 'unavailable';

export interface FetalWeightPercentileResult {
  sex: FetalSex;
  weeks: number;
  gestationalDay: number;
  efwGrams: number;
  efwDisplay: number;
  resultWeightUnit: WeightUnit;
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
  normalRange: boolean;
  normalRangeText: string;
  accessibleChartSummary: string;
  sourceNote: string;
  disclaimer: string;
  /** True when sex is selected but FMF EFW curves are unisex. */
  sexNote: string | null;
}

/** Blank clinical biometry — screenshot fixture is engine-test only. */
export function createDefaultInput(): FetalWeightPercentileInput {
  return {
    sex: 'unknown',
    weeks: '',
    ageUnit: 'wks',
    ac: '',
    hc: '',
    bpd: '',
    fl: '',
    lengthUnit: 'mm',
    resultWeightUnit: 'g',
  };
}

export function createEmptyInput(): FetalWeightPercentileInput {
  return createDefaultInput();
}

/** Screenshot/Omni fixture: Unknown · 20 wks · AC 154 · HC 180 · BPD 56.2 · FL 30 mm → EFW 334.37 g. */
export function createExampleInput(): FetalWeightPercentileInput {
  return {
    sex: 'unknown',
    weeks: '20',
    ageUnit: 'wks',
    ac: '154',
    hc: '180',
    bpd: '56.2',
    fl: '30',
    lengthUnit: 'mm',
    resultWeightUnit: 'g',
  };
}

export function inputsEqual(
  a: FetalWeightPercentileInput,
  b: FetalWeightPercentileInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.weeks === b.weeks &&
    a.ageUnit === b.ageUnit &&
    a.ac === b.ac &&
    a.hc === b.hc &&
    a.bpd === b.bpd &&
    a.fl === b.fl &&
    a.lengthUnit === b.lengthUnit &&
    a.resultWeightUnit === b.resultWeightUnit
  );
}

export function hasFetalWeightPercentileChanges(
  input: FetalWeightPercentileInput,
): boolean {
  return !inputsEqual(input, createDefaultInput());
}
