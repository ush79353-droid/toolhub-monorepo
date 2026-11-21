export type NavySex = 'male' | 'female';
export type LengthUnit = 'cm' | 'in';

export interface NavyBodyFatInput {
  age: string;
  sex: NavySex;
  height: string;
  heightUnit: LengthUnit;
  neck: string;
  neckUnit: LengthUnit;
  waist: string;
  waistUnit: LengthUnit;
  /** Required when sex is female. */
  hip: string;
  hipUnit: LengthUnit;
}

export interface NavyBodyFatResult {
  sex: NavySex;
  ageYears: number | null;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm: number | null;
  bodyFatPercent: number;
  formattedBodyFatPercent: string;
  modelSource: string;
  disclaimer: string;
}

export type NavyBodyFatFieldErrors = {
  form?: string;
  age?: string;
  height?: string;
  neck?: string;
  waist?: string;
  hip?: string;
};

/** Screenshot defaults: blank age; Male; blank height/neck/waist cm. */
export function createDefaultInput(): NavyBodyFatInput {
  return {
    age: '',
    sex: 'male',
    height: '',
    heightUnit: 'cm',
    neck: '',
    neckUnit: 'cm',
    waist: '',
    waistUnit: 'cm',
    hip: '',
    hipUnit: 'cm',
  };
}

export function createEmptyInput(): NavyBodyFatInput {
  return createDefaultInput();
}

/** Fixture: male 180 cm, waist 85, neck 38. */
export function createExampleInput(): NavyBodyFatInput {
  return {
    age: '25',
    sex: 'male',
    height: '180',
    heightUnit: 'cm',
    neck: '38',
    neckUnit: 'cm',
    waist: '85',
    waistUnit: 'cm',
    hip: '',
    hipUnit: 'cm',
  };
}

export function inputsEqual(a: NavyBodyFatInput, b: NavyBodyFatInput): boolean {
  return (
    a.age === b.age &&
    a.sex === b.sex &&
    a.height === b.height &&
    a.heightUnit === b.heightUnit &&
    a.neck === b.neck &&
    a.neckUnit === b.neckUnit &&
    a.waist === b.waist &&
    a.waistUnit === b.waistUnit &&
    a.hip === b.hip &&
    a.hipUnit === b.hipUnit
  );
}
