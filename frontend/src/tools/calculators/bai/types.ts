export type HeightUnit = 'm' | 'cm' | 'in' | 'ft';
export type HipUnit = 'cm' | 'm' | 'in';

export interface BaiInput {
  heightText: string;
  heightUnit: HeightUnit;
  hipText: string;
  hipUnit: HipUnit;
}

export interface BaiResult {
  heightMeters: number | null;
  hipCm: number | null;
  baiPercent: number | null;
  formattedBai: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BaiFieldErrors = {
  heightText?: string;
  hipText?: string;
};

/** Screenshot defaults: height in m, hip in cm, blanks. */
export function createDefaultInput(): BaiInput {
  return {
    heightText: '',
    heightUnit: 'm',
    hipText: '',
    hipUnit: 'cm',
  };
}

export function createEmptyInput(): BaiInput {
  return createDefaultInput();
}

export function inputsEqual(a: BaiInput, b: BaiInput): boolean {
  return (
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.hipText === b.hipText &&
    a.hipUnit === b.hipUnit
  );
}
