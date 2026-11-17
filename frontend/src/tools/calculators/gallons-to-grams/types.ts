/** Which measure field the user last edited. */
export type GalGramsSource = 'volume' | 'mass';

export type DensityUnit =
  | 'kgPerM3'
  | 'gPerMl'
  | 'gPerCm3'
  | 'kgPerL'
  | 'gPerL'
  | 'lbPerFt3';

export interface GalToGramsInput {
  source: GalGramsSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  gallons: number | null;
  grams: number | null;
}

export interface GalToGramsResult {
  source: GalGramsSource;
  substanceId: string;
  substanceName: string;
  densityKgPerM3: number;
  densityApproximate: boolean;
  gallons: number;
  grams: number;
  explanation: string;
}

export type GalToGramsFieldErrors = {
  densityValue?: string;
  gallons?: string;
  grams?: string;
};

/** Exact: 1 US liquid gallon = 3.785411784 L = 0.003785411784 m³. */
export const LITERS_PER_US_GALLON = 3.785411784;
export const CUBIC_METERS_PER_US_GALLON = 0.003785411784;
export const GRAMS_PER_KILOGRAM = 1000;

/** Exact: 1 ft = 0.3048 m → 1 ft³ = 0.3048³ m³. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.3048 ** 3;
/** Exact international avoirdupois pound. */
export const POUND_TO_KG = 0.45359237;

/**
 * Multiply displayed density by this to get kg/m³.
 * 1 g/cm³ = 1 g/mL = 1 kg/L = 1000 kg/m³; 1 g/L = 1 kg/m³.
 */
export const KG_PER_M3_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerM3: 1,
  gPerCm3: 1000,
  gPerMl: 1000,
  kgPerL: 1000,
  gPerL: 1,
  lbPerFt3: POUND_TO_KG / CUBIC_METERS_PER_CUBIC_FOOT,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'gPerL', label: 'g/L' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
] as const;

/** Conventional fresh water ≈ 1000 kg/m³ near 4 °C. */
export const WATER_DENSITY_KG_PER_M3 = 1000;

export const MAX_ABS_VALUE = 1e15;
