/** Pediatric ETT size estimates — screenshot-first (ADR-023). */

export type AgeUnit = 'yrs' | 'mos';

export interface EndotrachealTubeSizeInput {
  ageText: string;
  ageUnit: AgeUnit;
}

export interface EndotrachealTubeSizeResult {
  uncuffedMm: number | null;
  cuffedMm: number | null;
  insertionDepthCm: number | null;
  formattedUncuffed: string;
  formattedCuffed: string;
  formattedDepth: string;
  ageYears: number | null;
  populationLabel: string | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type EndotrachealTubeSizeFieldErrors = {
  ageText?: string;
};

export function createDefaultInput(): EndotrachealTubeSizeInput {
  return { ageText: '', ageUnit: 'yrs' };
}

export function createEmptyInput(): EndotrachealTubeSizeInput {
  return createDefaultInput();
}

/** Example: age 4 yrs → uncuffed 5.0, cuffed 4.0, depth 14. */
export function createExampleInput(): EndotrachealTubeSizeInput {
  return { ageText: '4', ageUnit: 'yrs' };
}

export function inputsEqual(
  a: EndotrachealTubeSizeInput,
  b: EndotrachealTubeSizeInput,
): boolean {
  return a.ageText === b.ageText && a.ageUnit === b.ageUnit;
}
