/**
 * Absolute lymphocyte count (ALC) from WBC and lymphocyte %.
 * Screenshot: WBC (×10³/µL), lymphocytes (%), derived ALC (×10³/µL).
 */

export interface AbsoluteLymphocyteCountInput {
  wbcText: string;
  lymphocytePercentText: string;
}

export interface AbsoluteLymphocyteCountResult {
  /** ALC in ×10³/µL; null when incomplete or invalid. */
  absoluteCount: number | null;
  /** Same numeric value expressed as ×10⁹/L (lab-equivalent labeling). */
  absoluteCountPerLiter: number | null;
  /** ALC in cells/µL (×10³/µL × 1000); null when count unavailable. */
  absoluteCountCellsPerMicroliter: number | null;
  statusHeadline: string;
  statusDetail: string;
  unitEquivalenceNote: string;
  cellsPerMicroliterNote: string;
  sourceNote: string;
  disclaimer: string;
}

export type AbsoluteLymphocyteCountFieldErrors = {
  wbcText?: string;
  lymphocytePercentText?: string;
};

export function createDefaultInput(): AbsoluteLymphocyteCountInput {
  return {
    wbcText: '',
    lymphocytePercentText: '',
  };
}

export function createEmptyInput(): AbsoluteLymphocyteCountInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: AbsoluteLymphocyteCountInput,
  b: AbsoluteLymphocyteCountInput,
): boolean {
  return (
    a.wbcText === b.wbcText &&
    a.lymphocytePercentText === b.lymphocytePercentText
  );
}