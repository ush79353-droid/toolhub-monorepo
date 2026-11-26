export type PersonMode = 'adult' | 'neonate';
export type HeightUnit = 'cm' | 'm' | 'in' | 'ft';
export type WeightUnit = 'kg' | 'g' | 'lb';

export interface PonderalInput {
  mode: PersonMode;
  heightText: string;
  heightUnit: HeightUnit;
  weightText: string;
  weightUnit: WeightUnit;
}

export interface PonderalResult {
  heightMeters: number | null;
  weightKg: number | null;
  index: number | null;
  formattedIndex: string;
  unitLabel: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type PonderalFieldErrors = {
  heightText?: string;
  weightText?: string;
};

/** Screenshot defaults: Adult selected; height cm; weight kg; blanks. */
export function createDefaultInput(): PonderalInput {
  return {
    mode: 'adult',
    heightText: '',
    heightUnit: 'cm',
    weightText: '',
    weightUnit: 'kg',
  };
}

export function createEmptyInput(): PonderalInput {
  return createDefaultInput();
}

export function inputsEqual(a: PonderalInput, b: PonderalInput): boolean {
  return (
    a.mode === b.mode &&
    a.heightText === b.heightText &&
    a.heightUnit === b.heightUnit &&
    a.weightText === b.weightText &&
    a.weightUnit === b.weightUnit
  );
}
