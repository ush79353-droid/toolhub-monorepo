/**
 * Absolute eosinophil count (AEC) from WBC and eosinophil %.
 * Screenshot: WBC (×10³/µL), eosinophils (%), derived AEC (×10³/µL).
 */

export interface AbsoluteEosinophilCountInput {
  wbcText: string;
  eosinophilPercentText: string;
}

export interface AbsoluteEosinophilCountResult {
  /** AEC in ×10³/µL; null when incomplete or invalid. */
  absoluteCount: number | null;
  /** Same numeric value expressed as ×10⁹/L (lab-equivalent labeling). */
  absoluteCountPerLiter: number | null;
  statusHeadline: string;
  statusDetail: string;
  unitEquivalenceNote: string;
  sourceNote: string;
  disclaimer: string;
}

export type AbsoluteEosinophilCountFieldErrors = {
  wbcText?: string;
  eosinophilPercentText?: string;
};

export function createDefaultInput(): AbsoluteEosinophilCountInput {
  return {
    wbcText: '',
    eosinophilPercentText: '',
  };
}

export function createEmptyInput(): AbsoluteEosinophilCountInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: AbsoluteEosinophilCountInput,
  b: AbsoluteEosinophilCountInput,
): boolean {
  return (
    a.wbcText === b.wbcText &&
    a.eosinophilPercentText === b.eosinophilPercentText
  );
}