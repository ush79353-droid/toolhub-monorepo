export type Sex = 'boy' | 'girl';
export type AgeUnit = 'mos' | 'yrs';
export type WeightUnit = 'kg' | 'lb';

export interface WeightPercentileInput {
  age: string;
  ageUnit: AgeUnit;
  sex: Sex;
  weight: string;
  weightUnit: WeightUnit;
}

export interface WeightPercentileResult {
  ageMonths: number;
  sex: Sex;
  weightKg: number;
  zScore: number;
  percentile: number;
  medianWeightKg: number;
  formattedWeightKg: string;
  formattedZScore: string;
  formattedPercentile: string;
  sourceLabel: string;
  disclaimer: string;
}

export type WeightPercentileFieldErrors = {
  form?: string;
  age?: string;
  weight?: string;
};

/** Screenshot defaults: blank age (mos), Girl, blank weight kg. */
export function createDefaultInput(): WeightPercentileInput {
  return {
    age: '',
    ageUnit: 'mos',
    sex: 'girl',
    weight: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): WeightPercentileInput {
  return createDefaultInput();
}

/** Fixture: 24-month girl at median weight → ~50th percentile. */
export function createExampleInput(): WeightPercentileInput {
  return {
    age: '24',
    ageUnit: 'mos',
    sex: 'girl',
    weight: '11.4775',
    weightUnit: 'kg',
  };
}

export function inputsEqual(
  a: WeightPercentileInput,
  b: WeightPercentileInput,
): boolean {
  return (
    a.age === b.age &&
    a.ageUnit === b.ageUnit &&
    a.sex === b.sex &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit
  );
}
