/** Primary land-area conversion: which field the user last edited. */
export type AreaSource = 'gaj' | 'squareYards';

/** Secondary linear conversion: which field the user last edited. */
export type LengthSource = 'linearGaj' | 'yards';

export interface AreaInput {
  source: AreaSource;
  gaj: number | null;
  squareYards: number | null;
}

export interface LengthInput {
  source: LengthSource;
  linearGaj: number | null;
  yards: number | null;
}

export interface AreaResult {
  source: AreaSource;
  gaj: number;
  squareYards: number;
  squareFeet: number;
  explanation: string;
}

export interface LengthResult {
  source: LengthSource;
  linearGaj: number;
  yards: number;
  explanation: string;
}

export type AreaFieldErrors = {
  gaj?: string;
  squareYards?: string;
};

export type LengthFieldErrors = {
  linearGaj?: string;
  yards?: string;
};

/** Land-area gaj equals one square yard in common South Asian property usage. */
export const SQUARE_YARDS_PER_LAND_GAJ = 1;
/** Linear gaj equals one yard. */
export const YARDS_PER_LINEAR_GAJ = 1;
/** Exact: 1 yd² = 9 ft². */
export const SQUARE_FEET_PER_SQUARE_YARD = 9;
/** Exact international: 1 yd² = 0.83612736 m². */
export const SQUARE_METERS_PER_SQUARE_YARD = 0.83612736;

export const MAX_ABS_VALUE = 1e15;
