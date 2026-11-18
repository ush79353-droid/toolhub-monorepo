/** Which of the three synchronized fields the user last edited. */
export type VolumeSource = 'usGal' | 'ukGal' | 'ft3';

export type VolumeUnit = 'us_gal' | 'uk_gal' | 'ft3';

export interface GalToCuFtInput {
  source: VolumeSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface GalToCuFtResult {
  source: VolumeSource;
  usGal: number;
  ukGal: number;
  ft3: number;
  explanation: string;
}

export type GalToCuFtFieldErrors = Partial<Record<VolumeSource, string>>;

/** Exact: 1 US liquid gallon = 3.785411784 L. */
export const LITERS_PER_US_GALLON = 3.785411784;
/** Exact: 1 UK imperial gallon = 4.54609 L. */
export const LITERS_PER_UK_GALLON = 4.54609;
/** Exact: 1 ft³ = (0.3048 m)³ = 0.028316846592 m³ = 28.316846592 L. */
export const LITERS_PER_CUBIC_FOOT = 28.316846592;

export const LITERS_PER_UNIT: Record<VolumeUnit, number> = {
  us_gal: LITERS_PER_US_GALLON,
  uk_gal: LITERS_PER_UK_GALLON,
  ft3: LITERS_PER_CUBIC_FOOT,
};

export const SOURCE_TO_UNIT: Record<VolumeSource, VolumeUnit> = {
  usGal: 'us_gal',
  ukGal: 'uk_gal',
  ft3: 'ft3',
};

export const MAX_ABS_VALUE = 1e15;
