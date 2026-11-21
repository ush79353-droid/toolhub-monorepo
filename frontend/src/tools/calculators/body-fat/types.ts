export type Sex = 'female' | 'male';

export type BodyFatMethod = 'ada' | 'navy' | 'bmi';

export type LengthUnit = 'cm' | 'in';
export type MassUnit = 'kg' | 'lb';

export interface BodyFatInput {
  sex: Sex;
  method: BodyFatMethod;
  age: string;
  height: string;
  heightUnit: LengthUnit;
  weight: string;
  weightUnit: MassUnit;
  /** U.S. Navy only */
  neck: string;
  waist: string;
  /** U.S. Navy female only */
  hip: string;
  circumferenceUnit: LengthUnit;
}

export interface BodyFatResult {
  method: BodyFatMethod;
  sex: Sex;
  ageYears: number;
  bodyFatPercent: number;
  formattedBodyFatPercent: string;
  fatMassKg: number;
  formattedFatMassKg: string;
  leanMassKg: number;
  formattedLeanMassKg: string;
  bmi: number;
  formattedBmi: string;
  weightKg: number;
  heightCm: number;
  methodLabel: string;
  sourceNote: string;
  disclaimer: string;
}

export type BodyFatFieldErrors = {
  form?: string;
  age?: string;
  height?: string;
  weight?: string;
  neck?: string;
  waist?: string;
  hip?: string;
};

/** Screenshot defaults: Female + ADA; blank numeric fields (no medical seed). */
export function createDefaultInput(): BodyFatInput {
  return {
    sex: 'female',
    method: 'ada',
    age: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    neck: '',
    waist: '',
    hip: '',
    circumferenceUnit: 'cm',
  };
}

export function createEmptyInput(): BodyFatInput {
  return createDefaultInput();
}

export function inputsEqual(a: BodyFatInput, b: BodyFatInput): boolean {
  return (
    a.sex === b.sex &&
    a.method === b.method &&
    a.age === b.age &&
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.weight === b.weight &&
    a.weightUnit === b.weightUnit &&
    a.neck === b.neck &&
    a.waist === b.waist &&
    a.hip === b.hip &&
    a.circumferenceUnit === b.circumferenceUnit
  );
}
