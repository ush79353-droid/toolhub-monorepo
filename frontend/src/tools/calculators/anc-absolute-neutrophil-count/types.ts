/**
 * Absolute neutrophil count (ANC) from WBC, segs %, and bands %.
 * Screenshot: WBC (×10³/µL), segs (%), bands (%), derived ANC (×10³/µL).
 */

export interface AncAbsoluteNeutrophilCountInput {
  wbcText: string;
  segsPercentText: string;
  bandsPercentText: string;
}

export interface AncAbsoluteNeutrophilCountResult {
  /** ANC in ×10³/µL; null when incomplete or invalid. */
  absoluteCount: number | null;
  /** Same numeric value expressed as ×10⁹/L (lab-equivalent labeling). */
  absoluteCountPerLiter: number | null;
  statusHeadline: string;
  statusDetail: string;
  unitEquivalenceNote: string;
  sourceNote: string;
  disclaimer: string;
}

export type AncAbsoluteNeutrophilCountFieldErrors = {
  wbcText?: string;
  segsPercentText?: string;
  bandsPercentText?: string;
};

export function createDefaultInput(): AncAbsoluteNeutrophilCountInput {
  return {
    wbcText: '',
    segsPercentText: '',
    bandsPercentText: '',
  };
}

export function createEmptyInput(): AncAbsoluteNeutrophilCountInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: AncAbsoluteNeutrophilCountInput,
  b: AncAbsoluteNeutrophilCountInput,
): boolean {
  return (
    a.wbcText === b.wbcText &&
    a.segsPercentText === b.segsPercentText &&
    a.bandsPercentText === b.bandsPercentText
  );
}