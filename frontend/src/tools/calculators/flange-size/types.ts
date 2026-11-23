/** Nipple diameter display unit (canonical math uses mm). */
export type DiameterUnit = 'mm' | 'in';

export interface FlangeSizeInput {
  diameterValue: string;
  diameterUnit: DiameterUnit;
}

export type FlangeFitStatus =
  | 'suggested'
  | 'outOfRangeHigh'
  | 'outOfRangeLow'
  | 'ambiguous';

export interface FlangeSizeResult {
  diameterMm: number;
  /** Suggested Spectra flange tunnel size in mm, when in range. */
  flangeSizeMm: number | null;
  fitStatus: FlangeFitStatus;
  formattedSuggestion: string;
  explanation: string;
  disclaimer: string;
  sourceLabel: string;
}

export type FlangeSizeFieldErrors = {
  form?: string;
  diameterValue?: string;
};

export function createDefaultInput(): FlangeSizeInput {
  return {
    diameterValue: '',
    diameterUnit: 'mm',
  };
}

export function createEmptyInput(): FlangeSizeInput {
  return createDefaultInput();
}

/** Fixture: 18 mm nipple → Spectra 24 mm flange (up to 20 mm band). */
export function createExampleInput(): FlangeSizeInput {
  return {
    diameterValue: '18',
    diameterUnit: 'mm',
  };
}

export function inputsEqual(a: FlangeSizeInput, b: FlangeSizeInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const DIAMETER_UNIT_LABELS: Record<DiameterUnit, string> = {
  mm: 'mm',
  in: 'in',
};
