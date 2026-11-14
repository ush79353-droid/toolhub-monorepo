/** Which field the user last edited. The other field is derived. */
export type AcreAreSource = 'acres' | 'ares';

export interface AcreToAreInput {
  source: AcreAreSource;
  /** null while the active source field is blank or incomplete. */
  acres: number | null;
  ares: number | null;
}

export interface AcreToAreResult {
  source: AcreAreSource;
  acres: number;
  ares: number;
  explanation: string;
}

export type AcreToAreFieldErrors = {
  acres?: string;
  ares?: string;
};

/** Exact international acre in square meters. */
export const SQUARE_METERS_PER_ACRE = 4046.8564224;
/** Exact are in square meters. */
export const SQUARE_METERS_PER_ARE = 100;
/**
 * Exact ares per acre (4046.8564224 ÷ 100).
 * Stored as a literal so conversion does not inherit IEEE division noise.
 */
export const ARES_PER_ACRE = 40.468564224;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 5 acres = 202.34282112 ares. */
export const DEFAULT_ACRE_TO_ARE_INPUT: AcreToAreInput = {
  source: 'acres',
  acres: 5,
  ares: null,
};
