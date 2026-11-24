/**
 * Corrected reticulocyte count (CRC) and optional reticulocyte production index.
 */

export interface CorrectedReticulocyteCountInput {
  hematocritPercentText: string;
  reticulocytePercentText: string;
  /** When false, reference hematocrit defaults to 45%. */
  useCustomReferenceHematocrit: boolean;
  referenceHematocritPercentText: string;
  /** When true, show RPI = CRC ÷ maturation factor. */
  showMaturationIndex: boolean;
}

export interface CorrectedReticulocyteCountResult {
  correctedReticulocytePercent: number | null;
  reticulocyteProductionIndex: number | null;
  maturationFactor: number | null;
  referenceHematocritUsed: number | null;
  formattedCorrectedPercent: string;
  formattedRpi: string;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type CorrectedReticulocyteCountFieldErrors = {
  hematocritPercentText?: string;
  reticulocytePercentText?: string;
  referenceHematocritPercentText?: string;
};

export const DEFAULT_REFERENCE_HEMATOCRIT_PERCENT = '45';

export function createDefaultInput(): CorrectedReticulocyteCountInput {
  return {
    hematocritPercentText: '',
    reticulocytePercentText: '',
    useCustomReferenceHematocrit: false,
    referenceHematocritPercentText: DEFAULT_REFERENCE_HEMATOCRIT_PERCENT,
    showMaturationIndex: false,
  };
}

export function createEmptyInput(): CorrectedReticulocyteCountInput {
  return {
    hematocritPercentText: '',
    reticulocytePercentText: '',
    useCustomReferenceHematocrit: false,
    referenceHematocritPercentText: '',
    showMaturationIndex: false,
  };
}

export function inputsEqual(
  a: CorrectedReticulocyteCountInput,
  b: CorrectedReticulocyteCountInput,
): boolean {
  return (
    a.hematocritPercentText === b.hematocritPercentText &&
    a.reticulocytePercentText === b.reticulocytePercentText &&
    a.useCustomReferenceHematocrit === b.useCustomReferenceHematocrit &&
    a.referenceHematocritPercentText === b.referenceHematocritPercentText &&
    a.showMaturationIndex === b.showMaturationIndex
  );
}