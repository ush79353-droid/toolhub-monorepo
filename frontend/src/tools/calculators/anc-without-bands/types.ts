/**
 * ANC without bands — lab-report modes (NEUT, POLY, POLY+Bands, SEGS+Bands).
 * Screenshot: WBC ×10³/µL → ANC cells/µL.
 */

export type LabReportMode =
  | 'neut'
  | 'poly'
  | 'poly_plus_bands'
  | 'segs_plus_bands';

export interface AncWithoutBandsInput {
  wbcText: string;
  labReportMode: LabReportMode;
  primaryPercentText: string;
  bandsPercentText: string;
}

export interface AncWithoutBandsResult {
  /** ANC in cells/µL; null when incomplete or invalid. */
  ancCellsPerMicroliter: number | null;
  /** Combined neutrophil % used in the formula. */
  combinedNeutrophilPercent: number | null;
  statusHeadline: string;
  statusDetail: string;
  sourceNote: string;
  disclaimer: string;
}

export type AncWithoutBandsFieldErrors = {
  wbcText?: string;
  primaryPercentText?: string;
  bandsPercentText?: string;
};

export function createDefaultInput(): AncWithoutBandsInput {
  return {
    wbcText: '',
    labReportMode: 'neut',
    primaryPercentText: '',
    bandsPercentText: '',
  };
}

export function createEmptyInput(): AncWithoutBandsInput {
  return createDefaultInput();
}

export function inputsEqual(
  a: AncWithoutBandsInput,
  b: AncWithoutBandsInput,
): boolean {
  return (
    a.wbcText === b.wbcText &&
    a.labReportMode === b.labReportMode &&
    a.primaryPercentText === b.primaryPercentText &&
    a.bandsPercentText === b.bandsPercentText
  );
}

export function modeUsesBands(mode: LabReportMode): boolean {
  return mode === 'poly_plus_bands' || mode === 'segs_plus_bands';
}

export function primaryFieldLabel(mode: LabReportMode): string {
  switch (mode) {
    case 'neut':
      return 'NEUT';
    case 'poly':
      return 'POLY';
    case 'poly_plus_bands':
      return 'POLY';
    case 'segs_plus_bands':
      return 'SEGS';
    default:
      return 'NEUT';
  }
}