export type LengthUnit = 'cm' | 'm' | 'in' | 'ft';

export interface WhrInput {
  waistText: string;
  waistUnit: LengthUnit;
  hipText: string;
  hipUnit: LengthUnit;
}

export interface WhrResult {
  waistCm: number | null;
  hipCm: number | null;
  ratio: number | null;
  formattedRatio: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type WhrFieldErrors = {
  waistText?: string;
  hipText?: string;
};

/** Screenshot defaults: blank waist/hip, cm units. */
export function createDefaultInput(): WhrInput {
  return {
    waistText: '',
    waistUnit: 'cm',
    hipText: '',
    hipUnit: 'cm',
  };
}

export function createEmptyInput(): WhrInput {
  return createDefaultInput();
}

export function inputsEqual(a: WhrInput, b: WhrInput): boolean {
  return (
    a.waistText === b.waistText &&
    a.waistUnit === b.waistUnit &&
    a.hipText === b.hipText &&
    a.hipUnit === b.hipUnit
  );
}
