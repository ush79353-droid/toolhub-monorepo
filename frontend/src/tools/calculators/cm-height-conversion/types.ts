/** Which measurement the user last edited. All other values are derived from it. */
export type CmHeightSource =
  | 'centimeters'
  | 'feetInches'
  | 'meters'
  | 'millimeters'
  | 'totalInches'
  | 'decimalFeet';

export interface CmHeightInput {
  source: CmHeightSource;
  centimeters: number | null;
  feet: number | null;
  inches: number | null;
  meters: number | null;
  millimeters: number | null;
  totalInches: number | null;
  decimalFeet: number | null;
}

export interface CmHeightResult {
  source: CmHeightSource;
  centimeters: number;
  /** Normalized whole feet (floor of total inches / 12). */
  feet: number;
  /** Remaining inches after normalization (0 ≤ inches < 12 for finite totals ≥ 0). */
  inches: number;
  meters: number;
  millimeters: number;
  totalInches: number;
  decimalFeet: number;
  explanation: string;
  /** Friendly mixed label, e.g. "5 ft 8.90 in". */
  mixedLabel: string;
}

export type CmHeightFieldErrors = {
  centimeters?: string;
  feet?: string;
  inches?: string;
  meters?: string;
  millimeters?: string;
  totalInches?: string;
  decimalFeet?: string;
};

/** Exact international inch / foot / SI factors. */
export const INCHES_PER_FOOT = 12;
export const CM_PER_INCH = 2.54;
export const CM_PER_FOOT = 30.48;
export const CM_PER_METER = 100;
export const MM_PER_CM = 10;

export const LENGTH_TO_CM = {
  cm: 1,
  mm: 0.1,
  m: 100,
  in: 2.54,
  ft: 30.48,
} as const;

export type HeightUnit = keyof typeof LENGTH_TO_CM;

export const MAX_ABS_VALUE = 1e15;

/** Empty start — no demo height. */
export const DEFAULT_CM_HEIGHT_INPUT: CmHeightInput = {
  source: 'centimeters',
  centimeters: null,
  feet: null,
  inches: null,
  meters: null,
  millimeters: null,
  totalInches: null,
  decimalFeet: null,
};
