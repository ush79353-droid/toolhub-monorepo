/**
 * Absolute reticulocyte count from hematocrit and reticulocyte %.
 * Screenshot: patient Hct %, reference (normal) Hct %, reticulocytes %,
 * derived absolute count (cells/µL).
 */

export interface AbsoluteReticulocyteCountInput {
  hematocritPercentText: string;
  referenceHematocritPercentText: string;
  reticulocytePercentText: string;
}

export interface AbsoluteReticulocyteCountResult {
  /** Absolute count in cells/µL; null when incomplete or invalid. */
  absoluteCountCellsPerMicroliter: number | null;
  /** Reticulocyte % corrected for anemia: retic × (Hct / ref Hct). */
  correctedReticulocytePercent: number | null;
  statusHeadline: string;
  statusDetail: string;
  assumptionNote: string;
  sourceNote: string;
  disclaimer: string;
}

export type AbsoluteReticulocyteCountFieldErrors = {
  hematocritPercentText?: string;
  referenceHematocritPercentText?: string;
  reticulocytePercentText?: string;
};

export const DEFAULT_REFERENCE_HEMATOCRIT_PERCENT = '45';

export function createDefaultInput(): AbsoluteReticulocyteCountInput {
  return {
    hematocritPercentText: '',
    referenceHematocritPercentText: DEFAULT_REFERENCE_HEMATOCRIT_PERCENT,
    reticulocytePercentText: '',
  };
}

export function createEmptyInput(): AbsoluteReticulocyteCountInput {
  return {
    hematocritPercentText: '',
    referenceHematocritPercentText: '',
    reticulocytePercentText: '',
  };
}

export function inputsEqual(
  a: AbsoluteReticulocyteCountInput,
  b: AbsoluteReticulocyteCountInput,
): boolean {
  return (
    a.hematocritPercentText === b.hematocritPercentText &&
    a.referenceHematocritPercentText === b.referenceHematocritPercentText &&
    a.reticulocytePercentText === b.reticulocytePercentText
  );
}