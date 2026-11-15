/** Which field the user last edited. The other field is derived. */
export type AresCentSource = 'ares' | 'cents';

export interface AresToCentInput {
  source: AresCentSource;
  /** null while the active source field is blank or incomplete. */
  ares: number | null;
  cents: number | null;
}

export interface AresToCentResult {
  source: AresCentSource;
  ares: number;
  cents: number;
  explanation: string;
}

export type AresToCentFieldErrors = {
  ares?: string;
  cents?: string;
};

/** Exact international acre in square meters. */
export const SQUARE_METERS_PER_ACRE = 4046.8564224;
/** Exact are in square meters. */
export const SQUARE_METERS_PER_ARE = 100;
/**
 * Exact square meters per cent (1/100 international acre).
 * Literal so conversion does not inherit IEEE division noise.
 */
export const SQUARE_METERS_PER_CENT = 40.468564224;
/**
 * Exact ares per cent (40.468564224 ÷ 100).
 * cents = ares / ARES_PER_CENT; ares = cents × ARES_PER_CENT.
 */
export const ARES_PER_CENT = 0.40468564224;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 5 ares ≈ 12.3552690734 cents. */
export const DEFAULT_ARES_TO_CENT_INPUT: AresToCentInput = {
  source: 'ares',
  ares: 5,
  cents: null,
};
