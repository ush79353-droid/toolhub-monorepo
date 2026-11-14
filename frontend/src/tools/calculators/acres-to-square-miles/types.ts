/** Which field the user last edited. The other field is derived. */
export type AcresMi2Source = 'acres' | 'squareMiles';

export interface AcresToSquareMilesInput {
  source: AcresMi2Source;
  /** null while the active source field is blank or incomplete. */
  acres: number | null;
  squareMiles: number | null;
}

export interface AcresToSquareMilesResult {
  source: AcresMi2Source;
  acres: number;
  squareMiles: number;
  /** Short equation for the results card. */
  explanation: string;
}

export type AcresToSquareMilesFieldErrors = {
  acres?: string;
  squareMiles?: string;
};

/** Exact survey definition used by this converter. */
export const ACRES_PER_SQUARE_MILE = 640;

export const MAX_ABS_VALUE = 1e15;

/** Demo default from the brief: 2,000 acres = 3.125 mi². */
export const DEFAULT_ACRES_TO_SQUARE_MILES_INPUT: AcresToSquareMilesInput = {
  source: 'acres',
  acres: 2000,
  squareMiles: 3.125,
};
