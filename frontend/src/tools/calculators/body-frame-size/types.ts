export type Sex = 'female' | 'male';

export type HeightUnit = 'm' | 'cm' | 'in' | 'ft';

export type LengthUnit = 'cm' | 'in' | 'mm' | 'm';

export type FrameCategory = 'small' | 'medium' | 'large';

export interface BodyFrameSizeInput {
  sex: Sex;
  heightText: string;
  heightUnit: HeightUnit;
  wristText: string;
  wristUnit: LengthUnit;
}

export interface BodyFrameSizeResult {
  heightCm: number | null;
  wristCm: number | null;
  index: number | null;
  category: FrameCategory | null;
  formattedIndex: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type BodyFrameSizeFieldErrors = {
  heightText?: string;
  wristText?: string;
};

export function createDefaultInput(): BodyFrameSizeInput {
  return {
    sex: 'female',
    heightText: '',
    heightUnit: 'm',
    wristText: '',
    wristUnit: 'cm',
  };
}

export function createEmptyInput(): BodyFrameSizeInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: BodyFrameSizeInput,
  b: BodyFrameSizeInput,
): boolean {
  return (
    a.sex === b.sex &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.wristText === b.wristText &&
    a.wristUnit === b.wristUnit
  );
}
