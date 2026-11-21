export type Sex = 'female' | 'male';

export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

/** CDC BMI-for-age weight-status categories (ages 2–<20). */
export type CdcKidsCategoryId =
  | 'underweight'
  | 'healthy_weight'
  | 'overweight'
  | 'obesity';

export interface CdcKidsCategory {
  id: CdcKidsCategoryId;
  label: string;
  rangeLabel: string;
}

export type KidsHealthStatus =
  | 'collapsed'
  | 'needs_demographics'
  | 'below_chart_age'
  | 'above_chart_age'
  | 'classified'
  | 'lms_unavailable';

export interface BmiKidsInput {
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
  /** Collapsible “How healthy is this BMI?” — collapsed by default. */
  healthOpen: boolean;
  /** Exact age in years (decimals allowed); required for LMS path. */
  ageYears: string;
  sex: Sex;
}

export interface BmiKidsResult {
  heightMeters: number;
  weightKg: number;
  bmi: number;
  bmiPrime: number;
  formattedBmi: string;
  formattedBmiPrime: string;
  healthStatus: KidsHealthStatus;
  ageYears: number | null;
  sex: Sex | null;
  zScore: number | null;
  percentile: number | null;
  formattedPercentile: string | null;
  category: CdcKidsCategory | null;
  healthNote: string;
  classificationSource: string;
  disclaimer: string;
}

export type BmiKidsFieldErrors = {
  form?: string;
  height?: string;
  weight?: string;
  ageYears?: string;
};

/** Screenshot defaults: blank height/weight; cm/kg; health panel collapsed. */
export function createDefaultInput(): BmiKidsInput {
  return {
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    healthOpen: false,
    ageYears: '',
    sex: 'female',
  };
}

export function createEmptyInput(): BmiKidsInput {
  return createDefaultInput();
}

/** Independent fixture: 10y male · 140 cm · 32.7 kg → BMI ≈ 16.68 (≈ median). */
export function createExampleInput(): BmiKidsInput {
  return {
    height: '140',
    heightUnit: 'cm',
    weight: '32.7',
    weightUnit: 'kg',
    healthOpen: true,
    ageYears: '10',
    sex: 'male',
  };
}

export function inputsEqual(a: BmiKidsInput, b: BmiKidsInput): boolean {
  return (
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.healthOpen === b.healthOpen &&
    a.ageYears === b.ageYears &&
    a.sex === b.sex
  );
}
