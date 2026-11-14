/** Which measurement the user last edited. All other values are derived from it. */
export type HeightSource = 'feetInches' | 'totalInches' | 'centimeters' | 'meters';

export interface HeightInInchesInput {
  source: HeightSource;
  /** Whole or decimal feet when source is feetInches. */
  feet: number | null;
  /** Remaining (or excess) inches when source is feetInches. */
  inches: number | null;
  totalInches: number | null;
  centimeters: number | null;
  meters: number | null;
}

export interface HeightInInchesResult {
  source: HeightSource;
  /** Normalized whole feet for display (floor of total inches / 12). */
  feet: number;
  /** Remaining inches after normalization (0 ≤ inches < 12 for finite totals ≥ 0). */
  inches: number;
  totalInches: number;
  centimeters: number;
  meters: number;
  explanation: string;
}

export type HeightInInchesFieldErrors = {
  feet?: string;
  inches?: string;
  totalInches?: string;
  centimeters?: string;
  meters?: string;
};

/** Exact international inch / foot factors. */
export const INCHES_PER_FOOT = 12;
export const CM_PER_INCH = 2.54;
export const M_PER_INCH = 0.0254;
export const CM_PER_METER = 100;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 2 ft 4 in = 28 in. */
export const DEFAULT_HEIGHT_IN_INCHES_INPUT: HeightInInchesInput = {
  source: 'feetInches',
  feet: 2,
  inches: 4,
  totalInches: null,
  centimeters: null,
  meters: null,
};
