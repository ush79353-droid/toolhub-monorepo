export type RmrSex = 'male' | 'female';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

export interface RmrInput {
  sex: RmrSex;
  ageYearsText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
}

export interface RmrResult {
  rmrKcalPerDay: number | null;
  rmrDisplay: string;
  statusHeadline: string;
  statusDetail: string;
  equationLabel: string;
  sourceNote: string;
  disclaimer: string;
}

export type RmrFieldErrors = {
  ageYearsText?: string;
  heightText?: string;
  weightText?: string;
};

/** Blank anthropometrics; Male + cm/kg per screenshot defaults. */
export function createDefaultInput(): RmrInput {
  return {
    sex: 'male',
    ageYearsText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): RmrInput {
  return createDefaultInput();
}

export function inputsEqual(a: RmrInput, b: RmrInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageYearsText === b.ageYearsText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit
  );
}
