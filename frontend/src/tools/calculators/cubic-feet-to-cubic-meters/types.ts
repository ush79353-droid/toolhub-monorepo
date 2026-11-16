/** Extra volume units in More Conversion Options (not primary ft³/m³). */
export type ExtraVolumeUnit = 'cm3' | 'L' | 'mL' | 'usGal' | 'in3' | 'yd3';

export const EXTRA_VOLUME_UNITS = [
  'cm3',
  'L',
  'mL',
  'usGal',
  'in3',
  'yd3',
] as const satisfies readonly ExtraVolumeUnit[];

export const EXTRA_VOLUME_LABELS: Record<ExtraVolumeUnit, string> = {
  cm3: 'Cubic centimeters',
  L: 'Liters',
  mL: 'Milliliters',
  usGal: 'US gallons',
  in3: 'Cubic inches',
  yd3: 'Cubic yards',
};

export const EXTRA_VOLUME_SYMBOLS: Record<ExtraVolumeUnit, string> = {
  cm3: 'cm³',
  L: 'L',
  mL: 'mL',
  usGal: 'gal',
  in3: 'in³',
  yd3: 'yd³',
};

export type CuFtToCuMSource = 'cubicFeet' | 'cubicMeters' | ExtraVolumeUnit;

export interface CuFtToCuMInput {
  source: CuFtToCuMSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface CuFtToCuMResult {
  source: CuFtToCuMSource;
  cubicFeet: number;
  cubicMeters: number;
  extras: Record<ExtraVolumeUnit, number>;
  explanation: string;
}

export type CuFtToCuMFieldErrors = Partial<Record<CuFtToCuMSource, string>>;

/** Exact: (0.3048 m)³. Re-exported alias for brief naming. */
export const CUBIC_FEET_TO_CUBIC_METERS = 0.028316846592;

export const MAX_ABS_VALUE = 1e15;
