export type DdimerAssayUnit = 'FEU' | 'DDU';

export interface AgeAdjustedDDimerInput {
  ageYearsText: string;
  assayUnit: DdimerAssayUnit;
}

export interface AgeAdjustedDDimerResult {
  cutoffMicrogPerLiter: number | null;
  cutoffMicrogPerMilliliter: number | null;
  literMultiplier: number;
  usesAgeAdjustment: boolean | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AgeAdjustedDDimerFieldErrors = {
  ageYearsText?: string;
};

export function createDefaultInput(): AgeAdjustedDDimerInput {
  return {
    ageYearsText: '',
    assayUnit: 'FEU',
  };
}

export function createEmptyInput(): AgeAdjustedDDimerInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: AgeAdjustedDDimerInput,
  b: AgeAdjustedDDimerInput,
): boolean {
  return a.ageYearsText === b.ageYearsText && a.assayUnit === b.assayUnit;
}