/**
 * Overweight Calculator — BMI + adult ponderal; optional pediatric CDC path.
 */

export type Sex = 'female' | 'male';
export type SexSelection = Sex | '';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

export interface OverweightInput {
  childMode: boolean;
  weightText: string;
  weightUnit: WeightUnit;
  heightText: string;
  heightUnit: HeightUnit;
  /** Shown only when childMode. */
  sex: SexSelection;
  ageText: string;
}

export interface OverweightCategory {
  id: string;
  label: string;
  rangeLabel: string;
}

export interface OverweightResult {
  heightMeters: number | null;
  weightKg: number | null;
  bmi: number | null;
  ponderalIndex: number | null;
  formattedBmi: string;
  formattedPonderal: string;
  category: OverweightCategory | null;
  percentile: number | null;
  formattedPercentile: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type OverweightFieldErrors = {
  weightText?: string;
  heightText?: string;
  sex?: string;
  ageText?: string;
};

/** Screenshot: child unchecked; weight kg; height m; blanks. */
export function createDefaultInput(): OverweightInput {
  return {
    childMode: false,
    weightText: '',
    weightUnit: 'kg',
    heightText: '',
    heightUnit: 'm',
    sex: '',
    ageText: '',
  };
}

export function createEmptyInput(): OverweightInput {
  return createDefaultInput();
}

export function inputsEqual(a: OverweightInput, b: OverweightInput): boolean {
  return (
    a.childMode === b.childMode &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.sex === b.sex &&
    a.ageText === b.ageText
  );
}
