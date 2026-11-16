/** Which field the user last edited. Others are derived via liters. */
export type CuInToGalSource = 'cubicInches' | 'gallons' | 'other';

export type GallonKind = 'usGal' | 'ukGal';

export type OtherVolumeUnit = 'L' | 'mL' | 'cm3' | 'm3' | 'ft3';

export interface CuInToGalInput {
  source: CuInToGalSource;
  cubicInches: number | null;
  gallons: number | null;
  other: number | null;
  gallonKind: GallonKind;
  otherUnit: OtherVolumeUnit;
}

export interface CuInToGalResult {
  source: CuInToGalSource;
  cubicInches: number;
  gallons: number;
  other: number;
  liters: number;
  gallonKind: GallonKind;
  otherUnit: OtherVolumeUnit;
  explanation: string;
}

export type CuInToGalFieldErrors = {
  cubicInches?: string;
  gallons?: string;
  other?: string;
};

/** Exact: 1 in = 0.0254 m → 1 in³ = 0.0254³ m³ = 1.6387064×10⁻⁵ m³ = 0.016387064 L. */
export const LITERS_PER_CUBIC_INCH = 0.016387064;

/** Exact: 1 US liquid gallon = 231 in³. */
export const CUBIC_INCHES_PER_US_GALLON = 231;

/** Exact: 1 UK imperial gallon = 4.54609 L. */
export const LITERS_PER_UK_GALLON = 4.54609;

/** Exact: 231 × 0.016387064 L. */
export const LITERS_PER_US_GALLON = CUBIC_INCHES_PER_US_GALLON * LITERS_PER_CUBIC_INCH;

/** Exact: 1 ft = 12 in → 1 ft³ = 1728 in³. */
export const CUBIC_INCHES_PER_CUBIC_FOOT = 1728;

export const LITERS_PER_GALLON_KIND: Record<GallonKind, number> = {
  usGal: LITERS_PER_US_GALLON,
  ukGal: LITERS_PER_UK_GALLON,
};

export const LITERS_PER_OTHER_UNIT: Record<OtherVolumeUnit, number> = {
  L: 1,
  mL: 0.001,
  cm3: 0.001,
  m3: 1000,
  ft3: CUBIC_INCHES_PER_CUBIC_FOOT * LITERS_PER_CUBIC_INCH,
};

export const GALLON_KIND_OPTIONS: readonly { value: GallonKind; label: string }[] = [
  { value: 'usGal', label: 'US gal' },
  { value: 'ukGal', label: 'UK gal' },
] as const;

export const OTHER_UNIT_OPTIONS: readonly { value: OtherVolumeUnit; label: string }[] = [
  { value: 'L', label: 'L' },
  { value: 'mL', label: 'mL' },
  { value: 'cm3', label: 'cm³' },
  { value: 'm3', label: 'm³' },
  { value: 'ft3', label: 'ft³' },
] as const;

export const GALLON_KIND_LABEL: Record<GallonKind, string> = {
  usGal: 'US gal',
  ukGal: 'UK gal',
};

export const OTHER_UNIT_LABEL: Record<OtherVolumeUnit, string> = {
  L: 'L',
  mL: 'mL',
  cm3: 'cm³',
  m3: 'm³',
  ft3: 'ft³',
};

export const DEFAULT_GALLON_KIND: GallonKind = 'usGal';
export const DEFAULT_OTHER_UNIT: OtherVolumeUnit = 'L';

export const MAX_ABS_VALUE = 1e15;
