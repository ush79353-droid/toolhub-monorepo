/** Which dosage field the user last edited. */
export type CcGramsSource = 'volume' | 'mass';

export type DensityUnit =
  | 'gPerCm3'
  | 'gPerMl'
  | 'kgPerM3'
  | 'kgPerL'
  | 'lbPerFt3'
  | 'lbPerUsGal';

export type VolumeUnit =
  | 'cc'
  | 'cm3'
  | 'mL'
  | 'L'
  | 'm3'
  | 'flOzUs'
  | 'cupUs'
  | 'ptUs'
  | 'qtUs'
  | 'galUs';

export type MassUnit = 'ug' | 'mg' | 'g' | 'kg' | 'oz' | 'lb';

export interface CcToGramsInput {
  source: CcGramsSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  volumeCc: number | null;
  massG: number | null;
  volumeUnit: VolumeUnit;
  massUnit: MassUnit;
}

export interface CcToGramsResult {
  source: CcGramsSource;
  substanceId: string;
  substanceName: string;
  densityGPerCm3: number;
  densityApproximate: boolean;
  volumeCc: number;
  massG: number;
  explanation: string;
}

export type CcToGramsFieldErrors = {
  densityValue?: string;
  volumeCc?: string;
  massG?: string;
};

/** Exact international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;
export const G_PER_POUND = KG_PER_POUND * 1000;
export const G_PER_OUNCE = G_PER_POUND / 16;

/** Exact: 1 ft = 0.3048 m. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.3048 ** 3;

/** Exact: 1 US liquid gallon = 231 in³. */
export const LITERS_PER_US_GALLON = 3.785411784;
export const CC_PER_US_GALLON = LITERS_PER_US_GALLON * 1000;

/**
 * Multiply displayed density by this to get g/cm³.
 * 1 g/cm³ = 1 g/mL = 1 kg/L = 1000 kg/m³.
 */
export const G_PER_CM3_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerCm3: 1,
  gPerMl: 1,
  kgPerL: 1,
  kgPerM3: 0.001,
  lbPerFt3: KG_PER_POUND / (CUBIC_METERS_PER_CUBIC_FOOT * 1000),
  lbPerUsGal: KG_PER_POUND / LITERS_PER_US_GALLON,
};

/** Multiply displayed volume by this to get cc (cm³). */
export const CC_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  cc: 1,
  cm3: 1,
  mL: 1,
  L: 1000,
  m3: 1e6,
  flOzUs: CC_PER_US_GALLON / 128,
  cupUs: CC_PER_US_GALLON / 16,
  ptUs: CC_PER_US_GALLON / 8,
  qtUs: CC_PER_US_GALLON / 4,
  galUs: CC_PER_US_GALLON,
};

/** Multiply displayed mass by this to get grams. */
export const G_PER_MASS_UNIT: Record<MassUnit, number> = {
  ug: 1e-6,
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: G_PER_OUNCE,
  lb: G_PER_POUND,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
  { value: 'lbPerUsGal', label: 'lb/gal (US)' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'cc', label: 'cc' },
  { value: 'cm3', label: 'cm³' },
  { value: 'mL', label: 'mL' },
  { value: 'L', label: 'L' },
  { value: 'm3', label: 'm³' },
  { value: 'flOzUs', label: 'US fl oz' },
  { value: 'cupUs', label: 'US cup' },
  { value: 'ptUs', label: 'US pt' },
  { value: 'qtUs', label: 'US qt' },
  { value: 'galUs', label: 'US gal' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'ug', label: 'µg' },
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'oz', label: 'oz' },
  { value: 'lb', label: 'lb' },
] as const;

/** Conventional water ≈ 1 g/cm³ near 4 °C (temperature-dependent). */
export const WATER_DENSITY_G_PER_CM3 = 1;

export const MAX_ABS_VALUE = 1e15;

/** Default: water, empty volume/mass (per brief). */
export const DEFAULT_CC_TO_GRAMS_INPUT: CcToGramsInput = {
  source: 'volume',
  substanceId: 'water',
  densityValue: WATER_DENSITY_G_PER_CM3,
  densityUnit: 'gPerCm3',
  volumeCc: null,
  massG: null,
  volumeUnit: 'cc',
  massUnit: 'g',
};
