/** Which field the user last edited. */
export type CentAreaSource = 'cent' | 'm2' | 'ft2';

export interface CentToSquareMeterInput {
  source: CentAreaSource;
  cent: number | null;
  m2: number | null;
  ft2: number | null;
}

export interface CentToSquareMeterResult {
  source: CentAreaSource;
  cent: number;
  m2: number;
  ft2: number;
  explanation: string;
}

export type CentToSquareMeterFieldErrors = {
  cent?: string;
  m2?: string;
  ft2?: string;
};

/** Exact international acre in square meters. */
export const SQUARE_METERS_PER_ACRE = 4046.8564224;
/** Exact square meters per cent (1/100 international acre). */
export const SQUARE_METERS_PER_CENT = 40.468564224;
/** Exact square feet per acre. */
export const SQUARE_FEET_PER_ACRE = 43560;
/** Exact square feet per cent (1/100 acre). */
export const SQUARE_FEET_PER_CENT = 435.6;
/** Exact square meters per square foot. */
export const SQUARE_METERS_PER_SQUARE_FOOT = 0.09290304;

export const AREA_TO_SQUARE_METERS = {
  cent: SQUARE_METERS_PER_CENT,
  m2: 1,
  ft2: SQUARE_METERS_PER_SQUARE_FOOT,
} as const;

export type AreaUnit = keyof typeof AREA_TO_SQUARE_METERS;

export const MAX_ABS_VALUE = 1e15;

export const DEFAULT_INPUT: CentToSquareMeterInput = {
  source: 'cent',
  cent: null,
  m2: null,
  ft2: null,
};
