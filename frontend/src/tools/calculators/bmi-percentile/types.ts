export type Sex = 'boy' | 'girl';

export type AgeUnit = 'mos' | 'yrs';

export type HeightUnit = 'cm' | 'in';

export type WeightUnit = 'kg' | 'lb';

export interface BmiPercentileInput {
  age: string;
  ageUnit: AgeUnit;
  sex: Sex;
  /** When true, BMI is entered directly; when false, height + weight compute BMI. */
  knowBmi: boolean;
  bmi: string;
  height: string;
  heightUnit: HeightUnit;
  weight: string;
  weightUnit: WeightUnit;
}

export interface BmiPercentileResult {
  ageMonths: number;
  sex: Sex;
  bmi: number;
  zScore: number;
  percentile: number;
  formattedBmi: string;
  formattedZScore: string;
  formattedPercentile: string;
  medianBmi: number;
  sourceLabel: string;
  disclaimer: string;
}

export type BmiPercentileFieldErrors = {
  form?: string;
  age?: string;
  bmi?: string;
  height?: string;
  weight?: string;
};

/** Screenshot defaults: blank age (mos), Boy, know BMI checked, blank BMI. */
export function createDefaultInput(): BmiPercentileInput {
  return {
    age: '',
    ageUnit: 'mos',
    sex: 'boy',
    knowBmi: true,
    bmi: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): BmiPercentileInput {
  return createDefaultInput();
}

/** Fixture: 24-month boy at median BMI → ~50th percentile. */
export function createExampleInput(): BmiPercentileInput {
  return {
    age: '24',
    ageUnit: 'mos',
    sex: 'boy',
    knowBmi: true,
    bmi: '15.7356',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
  };
}

export function inputsEqual(
  a: BmiPercentileInput,
  b: BmiPercentileInput
): boolean {
  return (
    a.age === b.age &&
    a.ageUnit === b.ageUnit &&
    a.sex === b.sex &&
    a.knowBmi === b.knowBmi &&
    a.bmi === b.bmi &&
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit
  );
}
