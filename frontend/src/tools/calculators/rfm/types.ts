export type Sex = 'male' | 'female';
export type LengthUnit = 'cm' | 'm' | 'in' | 'ft';

export interface RfmInput {
  sex: Sex;
  heightText: string;
  heightUnit: LengthUnit;
  waistText: string;
  waistUnit: LengthUnit;
}

export interface RfmResult {
  heightCm: number | null;
  waistCm: number | null;
  rfmPercent: number | null;
  formattedRfm: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type RfmFieldErrors = {
  heightText?: string;
  waistText?: string;
};

/** Screenshot defaults: Male; height/waist cm blanks. */
export function createDefaultInput(): RfmInput {
  return {
    sex: 'male',
    heightText: '',
    heightUnit: 'cm',
    waistText: '',
    waistUnit: 'cm',
  };
}

export function createEmptyInput(): RfmInput {
  return createDefaultInput();
}

export function inputsEqual(a: RfmInput, b: RfmInput): boolean {
  return (
    a.sex === b.sex &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.waistText === b.waistText &&
    a.waistUnit === b.waistUnit
  );
}
