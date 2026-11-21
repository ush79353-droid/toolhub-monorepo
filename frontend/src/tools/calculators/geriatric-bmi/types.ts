export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'lb' | 'st';

export type GeriatricBmiCategory =
  | 'underweight'
  | 'normal'
  | 'overweight_obese';

export interface GeriatricBmiInput {
  ageYears: string;
  weightValue: string;
  weightUnit: WeightUnit;
  heightValue: string;
  heightUnit: HeightUnit;
}

export interface GeriatricBmiResult {
  ageYears: number;
  heightM: number;
  weightKg: number;
  bmi: number;
  formattedBmi: string;
  category: GeriatricBmiCategory;
  categoryLabel: string;
  explanation: string;
}

export type GeriatricBmiFieldErrors = {
  form?: string;
  ageYears?: string;
  weightValue?: string;
  heightValue?: string;
};

/** Older-adult BMI bands shown on the reference (ESPEN-style elevated cut-points). */
export const GERIATRIC_UNDERWEIGHT_MAX = 23; // BMI < 23
export const GERIATRIC_NORMAL_MAX = 30; // 23 ≤ BMI < 30 (labeled 23–29.9)

export function createDefaultInput(): GeriatricBmiInput {
  return {
    ageYears: '70',
    weightValue: '',
    weightUnit: 'kg',
    heightValue: '',
    heightUnit: 'cm',
  };
}

export function createEmptyInput(): GeriatricBmiInput {
  return {
    ageYears: '',
    weightValue: '',
    weightUnit: 'kg',
    heightValue: '',
    heightUnit: 'cm',
  };
}

export function inputsEqual(
  a: GeriatricBmiInput,
  b: GeriatricBmiInput
): boolean {
  return (
    a.ageYears === b.ageYears &&
    a.weightValue === b.weightValue &&
    a.weightUnit === b.weightUnit &&
    a.heightValue === b.heightValue &&
    a.heightUnit === b.heightUnit
  );
}
