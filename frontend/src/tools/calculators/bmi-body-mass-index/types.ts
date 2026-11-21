export type Sex = 'female' | 'male';

export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

export type WhoBmiCategoryId =
  | 'severe_thinness'
  | 'moderate_thinness'
  | 'mild_thinness'
  | 'normal'
  | 'overweight'
  | 'obese_i'
  | 'obese_ii'
  | 'obese_iii';

export interface BmiBodyMassIndexInput {
  sex: Sex;
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
  /** Collapsible “BMI percentile and athletes” — collapsed by default. */
  advancedOpen: boolean;
  /** Optional age (years) for childhood vs adult classification path. */
  age: string;
  athlete: boolean;
}

export interface WhoBmiCategory {
  id: WhoBmiCategoryId;
  label: string;
  rangeLabel: string;
  primeRangeLabel: string;
}

export type PercentileStatus =
  | 'not_requested'
  | 'needs_age'
  | 'below_chart_age'
  | 'child_lms_unavailable'
  | 'adult_who_path';

export interface BmiBodyMassIndexResult {
  sex: Sex;
  heightMeters: number;
  weightKg: number;
  bmi: number;
  bmiPrime: number;
  formattedBmi: string;
  formattedBmiPrime: string;
  category: WhoBmiCategory;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  formattedHealthyWeightRange: string;
  ageYears: number | null;
  athlete: boolean;
  percentileStatus: PercentileStatus;
  percentileNote: string;
  athleteNote: string | null;
  classificationSource: string;
  disclaimer: string;
}

export type BmiBodyMassIndexFieldErrors = {
  form?: string;
  height?: string;
  weight?: string;
  age?: string;
};

/** Screenshot defaults: Female selected; blank height/weight; panel collapsed. */
export function createDefaultInput(): BmiBodyMassIndexInput {
  return {
    sex: 'female',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    advancedOpen: false,
    age: '',
    athlete: false,
  };
}

export function createEmptyInput(): BmiBodyMassIndexInput {
  return createDefaultInput();
}

/** Fixture from prompt: 80 kg / 2 m → BMI 20, Prime 0.80. */
export function createExampleInput(): BmiBodyMassIndexInput {
  return {
    sex: 'female',
    height: '2',
    heightUnit: 'm',
    weight: '80',
    weightUnit: 'kg',
    advancedOpen: false,
    age: '',
    athlete: false,
  };
}

export function inputsEqual(
  a: BmiBodyMassIndexInput,
  b: BmiBodyMassIndexInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.advancedOpen === b.advancedOpen &&
    a.age === b.age &&
    a.athlete === b.athlete
  );
}
