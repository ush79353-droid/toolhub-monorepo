/** Which measure field the user last edited. */
export type FlOzLbSource = 'volume' | 'mass';

export type DensityUnit =
  | 'kgPerM3'
  | 'gPerCm3'
  | 'gPerMl'
  | 'kgPerL'
  | 'lbPerFt3'
  | 'lbPerUsGal';

export type VolumeUnit =
  | 'usFlOz'
  | 'impFlOz'
  | 'mL'
  | 'L'
  | 'usGal'
  | 'impGal'
  | 'cm3';

export type MassUnit = 'lb' | 'kg' | 'g' | 'mg' | 'oz';

export interface FlOzToLbInput {
  source: FlOzLbSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  volume: number | null;
  mass: number | null;
  volumeUnit: VolumeUnit;
  massUnit: MassUnit;
}

export interface FlOzToLbResult {
  source: FlOzLbSource;
  substanceId: string;
  substanceName: string;
  densityKgPerM3: number;
  densityApproximate: boolean;
  volumeM3: number;
  massKg: number;
  volume: number;
  volumeUnit: VolumeUnit;
  mass: number;
  massUnit: MassUnit;
  explanation: string;
}

export type FlOzToLbFieldErrors = {
  densityValue?: string;
  volume?: string;
  mass?: string;
};

/** Exact: 1 US liquid gallon = 231 in³; 1 in = 0.0254 m → 1 US fl oz = gal/128. */
export const US_FL_OZ_TO_M3 = 0.0000295735295625;
/** Exact: 1 imperial gallon = 4.54609 L; 1 Imp fl oz = gal/160. */
export const IMPERIAL_FL_OZ_TO_M3 = 0.0000284130625;
/** Exact international avoirdupois pound. */
export const POUND_TO_KG = 0.45359237;
export const OUNCE_TO_KG = POUND_TO_KG / 16;

/** Exact: 1 ft = 0.3048 m. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.3048 ** 3;
/** Exact: 1 US liquid gallon in m³. */
export const US_GAL_TO_M3 = US_FL_OZ_TO_M3 * 128;
/** Exact: 1 imperial gallon in m³. */
export const IMP_GAL_TO_M3 = IMPERIAL_FL_OZ_TO_M3 * 160;

/**
 * Multiply displayed density by this to get kg/m³.
 * 1 g/cm³ = 1 g/mL = 1 kg/L = 1000 kg/m³.
 */
export const KG_PER_M3_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerM3: 1,
  gPerCm3: 1000,
  gPerMl: 1000,
  kgPerL: 1000,
  lbPerFt3: POUND_TO_KG / CUBIC_METERS_PER_CUBIC_FOOT,
  lbPerUsGal: POUND_TO_KG / US_GAL_TO_M3,
};

/** Multiply displayed volume by this to get m³. */
export const M3_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  usFlOz: US_FL_OZ_TO_M3,
  impFlOz: IMPERIAL_FL_OZ_TO_M3,
  mL: 1e-6,
  L: 0.001,
  usGal: US_GAL_TO_M3,
  impGal: IMP_GAL_TO_M3,
  cm3: 1e-6,
};

/** Multiply displayed mass by this to get kilograms. */
export const KG_PER_MASS_UNIT: Record<MassUnit, number> = {
  kg: 1,
  g: 0.001,
  mg: 1e-6,
  lb: POUND_TO_KG,
  oz: OUNCE_TO_KG,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
  { value: 'lbPerUsGal', label: 'lb/US gal' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'usFlOz', label: 'US fl oz' },
  { value: 'impFlOz', label: 'UK fl oz' },
  { value: 'mL', label: 'mL' },
  { value: 'L', label: 'L' },
  { value: 'usGal', label: 'US gal' },
  { value: 'impGal', label: 'UK gal' },
  { value: 'cm3', label: 'cm³' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'lb', label: 'lb' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'mg', label: 'mg' },
  { value: 'oz', label: 'oz' },
] as const;

/** Conventional fresh water ≈ 1000 kg/m³ near 4 °C (temperature-dependent). */
export const WATER_DENSITY_KG_PER_M3 = 1000;

export const MAX_ABS_VALUE = 1e15;

/** Default: water @ 1000 kg/m³, empty volume/mass, US fl oz ↔ lb. */
export const DEFAULT_FL_OZ_TO_LB_INPUT: FlOzToLbInput = {
  source: 'volume',
  substanceId: 'water',
  densityValue: WATER_DENSITY_KG_PER_M3,
  densityUnit: 'kgPerM3',
  volume: null,
  mass: null,
  volumeUnit: 'usFlOz',
  massUnit: 'lb',
};
