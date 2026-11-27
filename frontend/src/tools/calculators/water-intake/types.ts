export type PersonMode = 'adult' | 'child';
export type Sex = 'male' | 'female';
export type AgeUnit = 'years' | 'months';

export interface WaterIntakeInput {
  mode: PersonMode;
  sex: Sex;
  /** Used in child mode only. */
  ageText: string;
  ageUnit: AgeUnit;
}

export interface WaterIntakeResult {
  totalLiters: number | null;
  beverageLiters: number | null;
  beverageCups: number | null;
  formattedTotal: string;
  formattedBeverages: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type WaterIntakeFieldErrors = {
  ageText?: string;
};

/** Screenshot defaults: Adult + Male selected. */
export function createDefaultInput(): WaterIntakeInput {
  return {
    mode: 'adult',
    sex: 'male',
    ageText: '',
    ageUnit: 'years',
  };
}

export function createEmptyInput(): WaterIntakeInput {
  return createDefaultInput();
}

export function inputsEqual(a: WaterIntakeInput, b: WaterIntakeInput): boolean {
  return (
    a.mode === b.mode &&
    a.sex === b.sex &&
    a.ageText === b.ageText &&
    a.ageUnit === b.ageUnit
  );
}
