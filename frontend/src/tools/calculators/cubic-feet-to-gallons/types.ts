export type GallonUnit = 'us' | 'uk';

export type CuFtToGalSource = 'cubicFeet' | 'gallons';

export interface CuFtToGalInput {
  source: CuFtToGalSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
  gallonUnit: GallonUnit;
}

export interface CuFtToGalResult {
  source: CuFtToGalSource;
  cubicFeet: number;
  gallons: number;
  gallonUnit: GallonUnit;
  explanation: string;
}

export type CuFtToGalFieldErrors = {
  cubicFeet?: string;
  gallons?: string;
};

export const GALLON_UNIT_OPTIONS = [
  { value: 'us' as const, label: 'US gal' },
  { value: 'uk' as const, label: 'UK gal' },
] as const;

export const DEFAULT_GALLON_UNIT: GallonUnit = 'us';

/** Exact: (0.3048 m)³. */
export const CUBIC_FOOT_IN_CUBIC_METERS = 0.028316846592;
/** Exact US liquid gallon. */
export const US_GALLON_IN_CUBIC_METERS = 0.003785411784;
/** Exact UK imperial gallon. */
export const UK_GALLON_IN_CUBIC_METERS = 0.00454609;

export const MAX_ABS_VALUE = 1e15;
