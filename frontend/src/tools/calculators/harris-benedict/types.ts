export type HarrisSex = 'male' | 'female';
export type HeightUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

export interface HarrisBenedictInput {
  sex: HarrisSex;
  ageYearsText: string;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
}

export interface HarrisBenedictResult {
  bmrKcalPerDay: number | null;
  bmrDisplay: string;
  statusHeadline: string;
  statusDetail: string;
  equationLabel: string;
  sourceNote: string;
  disclaimer: string;
}

export type HarrisBenedictFieldErrors = {
  ageYearsText?: string;
  heightText?: string;
  weightText?: string;
};

/** Blank anthropometrics; male default; cm/kg (provisional scope, no screenshot). */
export function createDefaultInput(): HarrisBenedictInput {
  return {
    sex: 'male',
    ageYearsText: '',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): HarrisBenedictInput {
  return createDefaultInput();
}

export function inputsEqual(a: HarrisBenedictInput, b: HarrisBenedictInput): boolean {
  return (
    a.sex === b.sex &&
    a.ageYearsText === b.ageYearsText &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit
  );
}
