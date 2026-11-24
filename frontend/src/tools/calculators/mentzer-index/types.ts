/**
 * Mentzer index — educational CBC worksheet (MCV ÷ RBC).
 * Screenshot: blank MCV (fL), RBC (million/mm³), read-only Mentzer index.
 */

/** RBC count units that share the Mentzer denominator scale (10⁶/µL). */
export type RbcCountUnit = 'million_per_mm3' | 'million_per_ul' | 'x10e12_per_l';

export interface MentzerIndexInput {
  mcvFlText: string;
  rbcText: string;
  rbcUnit: RbcCountUnit;
}

export type MentzerBand =
  | 'thalassemia_trait_favored'
  | 'iron_deficiency_favored'
  | 'borderline';

export interface MentzerIndexResult {
  /** Mentzer index when both inputs valid; null when incomplete. */
  index: number | null;
  formattedIndex: string;
  band: MentzerBand | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type MentzerIndexFieldErrors = {
  mcvFlText?: string;
  rbcText?: string;
};

export const DEFAULT_RBC_UNIT: RbcCountUnit = 'million_per_mm3';

export function createDefaultInput(): MentzerIndexInput {
  return {
    mcvFlText: '',
    rbcText: '',
    rbcUnit: DEFAULT_RBC_UNIT,
  };
}

export function createEmptyInput(): MentzerIndexInput {
  return createDefaultInput();
}

export function inputsEqual(a: MentzerIndexInput, b: MentzerIndexInput): boolean {
  return (
    a.mcvFlText === b.mcvFlText &&
    a.rbcText === b.rbcText &&
    a.rbcUnit === b.rbcUnit
  );
}
