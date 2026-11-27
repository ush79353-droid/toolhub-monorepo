export type LengthUnit = 'cm' | 'm' | 'in' | 'ft';

export interface BriInput {
  heightText: string;
  heightUnit: LengthUnit;
  waistText: string;
  waistUnit: LengthUnit;
}

export interface BriResult {
  bri: number | null;
  formattedBri: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BriFieldErrors = {
  heightText?: string;
  waistText?: string;
};

/** Screenshot defaults: blank height/waist cm; blank BRI. */
export function createDefaultInput(): BriInput {
  return {
    heightText: '',
    heightUnit: 'cm',
    waistText: '',
    waistUnit: 'cm',
  };
}

export function createEmptyInput(): BriInput {
  return createDefaultInput();
}

export function inputsEqual(a: BriInput, b: BriInput): boolean {
  return (
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.waistText === b.waistText &&
    a.waistUnit === b.waistUnit
  );
}
