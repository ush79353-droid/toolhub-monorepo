/** Which field the user last edited. Others are derived via liters. */
export type LToGalSource = 'liters' | 'gallons' | 'other';

export type GallonKind = 'usGal' | 'impGal';

export type OtherVolumeUnit =
  | 'mL'
  | 'cm3'
  | 'm3'
  | 'usQt'
  | 'usPt'
  | 'usFlOz'
  | 'impFlOz';

export interface LToGalInput {
  source: LToGalSource;
  liters: number | null;
  gallons: number | null;
  other: number | null;
  gallonKind: GallonKind;
  otherUnit: OtherVolumeUnit;
}

export interface LToGalResult {
  source: LToGalSource;
  liters: number;
  gallons: number;
  other: number;
  gallonKind: GallonKind;
  otherUnit: OtherVolumeUnit;
  explanation: string;
}

export type LToGalFieldErrors = {
  liters?: string;
  gallons?: string;
  other?: string;
};

/** Exact: 1 US liquid gallon = 3.785411784 L. */
export const LITERS_PER_US_GALLON = 3.785411784;

/** Exact: 1 Imperial gallon = 4.54609 L. */
export const LITERS_PER_IMPERIAL_GALLON = 4.54609;

export const LITERS_PER_GALLON_KIND: Record<GallonKind, number> = {
  usGal: LITERS_PER_US_GALLON,
  impGal: LITERS_PER_IMPERIAL_GALLON,
};

export const LITERS_PER_OTHER_UNIT: Record<OtherVolumeUnit, number> = {
  mL: 0.001,
  cm3: 0.001,
  m3: 1000,
  usQt: LITERS_PER_US_GALLON / 4,
  usPt: LITERS_PER_US_GALLON / 8,
  usFlOz: LITERS_PER_US_GALLON / 128,
  impFlOz: LITERS_PER_IMPERIAL_GALLON / 160,
};

export const GALLON_KIND_OPTIONS: readonly { value: GallonKind; label: string }[] = [
  { value: 'usGal', label: 'US gal' },
  { value: 'impGal', label: 'imp gal' },
] as const;

export const OTHER_UNIT_OPTIONS: readonly { value: OtherVolumeUnit; label: string }[] = [
  { value: 'usFlOz', label: 'US fl oz' },
  { value: 'impFlOz', label: 'imp fl oz' },
  { value: 'usQt', label: 'US qt' },
  { value: 'usPt', label: 'US pt' },
  { value: 'mL', label: 'mL' },
  { value: 'cm3', label: 'cm³' },
  { value: 'm3', label: 'm³' },
] as const;

export const GALLON_KIND_LABEL: Record<GallonKind, string> = {
  usGal: 'US gal',
  impGal: 'imp gal',
};

export const OTHER_UNIT_LABEL: Record<OtherVolumeUnit, string> = {
  mL: 'mL',
  cm3: 'cm³',
  m3: 'm³',
  usQt: 'US qt',
  usPt: 'US pt',
  usFlOz: 'US fl oz',
  impFlOz: 'imp fl oz',
};

export const MAX_ABS_VALUE = 1e15;

/** Demo: 1 L ≈ 0.264172 US gal. */
export const DEFAULT_L_TO_GAL_INPUT: LToGalInput = {
  source: 'liters',
  liters: 1,
  gallons: null,
  other: null,
  gallonKind: 'usGal',
  otherUnit: 'usFlOz',
};
