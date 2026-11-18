/** Which field the user last edited. The other field is derived. */
export type AcresHectaresSource = 'acres' | 'hectares';

export interface AcresToHectaresInput {
  source: AcresHectaresSource;
  /** null while the active source field is blank or incomplete. */
  acres: number | null;
  hectares: number | null;
}

export interface AcresToHectaresResult {
  source: AcresHectaresSource;
  acres: number;
  hectares: number;
  explanation: string;
}

export type AcresToHectaresFieldErrors = {
  acres?: string;
  hectares?: string;
};

/**
 * Exact international acre → hectare factor.
 * 1 acre = 4046.8564224 m²; 1 hectare = 10_000 m².
 */
export const HECTARES_PER_ACRE = 0.40468564224;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 10 acres. */
export const DEFAULT_ACRES_TO_HECTARES_INPUT: AcresToHectaresInput = {
  source: 'acres',
  acres: 10,
  hectares: null,
};
