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

export interface BmiForWomenInput {
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
  /** Optional age (years). Adult WHO interpretation only for ages ≥ 20. */
  age: string;
}

export interface WhoBmiCategory {
  id: WhoBmiCategoryId;
  label: string;
  rangeLabel: string;
  primeRangeLabel: string;
}

export type AgeInterpretation =
  | 'not_provided'
  | 'under_adult'
  | 'adult'
  | 'out_of_range';

export interface BmiForWomenResult {
  heightMeters: number;
  weightKg: number;
  bmi: number;
  bmiPrime: number;
  formattedBmi: string;
  formattedBmiPrime: string;
  category: WhoBmiCategory | null;
  healthyWeightMinKg: number | null;
  healthyWeightMaxKg: number | null;
  formattedHealthyWeightRange: string | null;
  ageYears: number | null;
  ageInterpretation: AgeInterpretation;
  ageNote: string | null;
  pregnancyNote: string;
  classificationSource: string;
  disclaimer: string;
}

export type BmiForWomenFieldErrors = {
  form?: string;
  height?: string;
  weight?: string;
  age?: string;
};

/** Screenshot defaults: blank height/weight/age; cm + kg. */
export function createDefaultInput(): BmiForWomenInput {
  return {
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    age: '',
  };
}

export function createEmptyInput(): BmiForWomenInput {
  return createDefaultInput();
}

/** Prompt fixture: 80 kg / 2 m → BMI 20, Prime 0.80. */
export function createExampleInput(): BmiForWomenInput {
  return {
    height: '2',
    heightUnit: 'm',
    weight: '80',
    weightUnit: 'kg',
    age: '30',
  };
}

export function inputsEqual(
  a: BmiForWomenInput,
  b: BmiForWomenInput,
): boolean {
  return (
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.age === b.age
  );
}
