/** Which field the user last edited. The other field is derived. */
export type AcresSqFtSource = 'acres' | 'squareFeet';

export interface AcresToSquareFeetInput {
  source: AcresSqFtSource;
  /** null while the active source field is blank or incomplete. */
  acres: number | null;
  squareFeet: number | null;
}

export interface AcresToSquareFeetResult {
  source: AcresSqFtSource;
  acres: number;
  squareFeet: number;
  explanation: string;
}

export type AcresToSquareFeetFieldErrors = {
  acres?: string;
  squareFeet?: string;
};

/** Exact international acre in square feet. */
export const SQUARE_FEET_PER_ACRE = 43_560;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 1 acre = 43,560 ft². */
export const DEFAULT_ACRES_TO_SQUARE_FEET_INPUT: AcresToSquareFeetInput = {
  source: 'acres',
  acres: 1,
  squareFeet: null,
};
