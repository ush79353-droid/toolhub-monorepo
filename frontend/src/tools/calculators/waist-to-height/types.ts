export type LengthUnit = 'cm' | 'm' | 'in' | 'ft';

export interface WhtrInput {
  waistText: string;
  waistUnit: LengthUnit;
  heightText: string;
  heightUnit: LengthUnit;
}

export interface WhtrResult {
  waistCm: number | null;
  heightCm: number | null;
  ratio: number | null;
  formattedRatio: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type WhtrFieldErrors = {
  waistText?: string;
  heightText?: string;
};

/** Screenshot defaults: waist cm, height cm, blanks. */
export function createDefaultInput(): WhtrInput {
  return {
    waistText: '',
    waistUnit: 'cm',
    heightText: '',
    heightUnit: 'cm',
  };
}

export function createEmptyInput(): WhtrInput {
  return createDefaultInput();
}

export function inputsEqual(a: WhtrInput, b: WhtrInput): boolean {
  return (
    a.waistText === b.waistText &&
    a.waistUnit === b.waistUnit &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit
  );
}
