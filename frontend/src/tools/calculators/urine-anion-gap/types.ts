/**
 * Urine anion gap (UAG) from urinary Na⁺, K⁺, Cl⁻.
 * Screenshot: blank mEq/L inputs; UAG result mEq/L.
 */

export interface UrineAnionGapInput {
  sodiumText: string;
  potassiumText: string;
  chlorideText: string;
}

export interface UrineAnionGapResult {
  urineAnionGap: number | null;
  formattedGap: string;
  statusHeadline: string;
  statusDetail: string;
  unitNote: string;
  sourceNote: string;
  disclaimer: string;
}

export type UrineAnionGapFieldErrors = {
  sodiumText?: string;
  potassiumText?: string;
  chlorideText?: string;
};

/** Screenshot defaults: all blank. */
export function createDefaultInput(): UrineAnionGapInput {
  return {
    sodiumText: '',
    potassiumText: '',
    chlorideText: '',
  };
}

export function createEmptyInput(): UrineAnionGapInput {
  return createDefaultInput();
}

export function inputsEqual(a: UrineAnionGapInput, b: UrineAnionGapInput): boolean {
  return (
    a.sodiumText === b.sodiumText &&
    a.potassiumText === b.potassiumText &&
    a.chlorideText === b.chlorideText
  );
}
