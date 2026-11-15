/** Which field the user last edited. The other field is derived. */
export type AresHectaresSource = 'ares' | 'hectares';

export interface AresToHectaresInput {
  source: AresHectaresSource;
  /** null while the active source field is blank or incomplete. */
  ares: number | null;
  hectares: number | null;
}

export interface ExtraAreaRow {
  id: string;
  label: string;
  symbol: string;
  value: number;
}

export interface AresToHectaresResult {
  source: AresHectaresSource;
  ares: number;
  hectares: number;
  squareMeters: number;
  extras: readonly ExtraAreaRow[];
  explanation: string;
}

export type AresToHectaresFieldErrors = {
  ares?: string;
  hectares?: string;
};

/** Exact are in square meters. */
export const SQUARE_METERS_PER_ARE = 100;
/** Exact hectare in square meters. */
export const SQUARE_METERS_PER_HECTARE = 10_000;
/** Exact ares per hectare. */
export const ARES_PER_HECTARE = 100;

/** Exact international acre. */
export const SQUARE_METERS_PER_ACRE = 4046.8564224;
/** Exact land cent (1/100 acre). */
export const SQUARE_METERS_PER_CENT = 40.468564224;
export const SQUARE_METERS_PER_FT2 = 0.09290304;
export const SQUARE_METERS_PER_YD2 = 0.83612736;
export const SQUARE_METERS_PER_KM2 = 1_000_000;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 250 ares = 2.5 hectares. */
export const DEFAULT_ARES_TO_HECTARES_INPUT: AresToHectaresInput = {
  source: 'ares',
  ares: 250,
  hectares: null,
};
