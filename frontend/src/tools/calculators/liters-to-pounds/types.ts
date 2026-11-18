/** Which field the user last edited among volume/mass. */
export type LitersPoundsSource = 'liters' | 'pounds';

export type DensityUnit =
  | 'kgPerM3'
  | 'kgPerL'
  | 'gPerMl'
  | 'gPerCm3'
  | 'lbPerL'
  | 'lbPerFt3';

export type SubstanceCategory =
  | 'food'
  | 'beverages'
  | 'oils'
  | 'dairy'
  | 'cooking'
  | 'other'
  | 'custom';

export interface LitersToPoundsInput {
  source: LitersPoundsSource;
  category: SubstanceCategory;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  liters: number | null;
  pounds: number | null;
}

export interface LitersToPoundsResult {
  source: LitersPoundsSource;
  substanceId: string;
  substanceName: string;
  densityKgPerL: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  liters: number;
  pounds: number;
  kilograms: number;
  explanation: string;
}

export type LitersToPoundsFieldErrors = {
  densityValue?: string;
  liters?: string;
  pounds?: string;
};

/** Exact international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;

/** Exact: 1 ft = 0.3048 m → 1 ft³ = 0.028316846592 m³. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;

/**
 * Multiply displayed density by this factor to get kg/L.
 * kg/m³ → kg/L = ÷1000; lb/L → kg/L = × KG_PER_POUND;
 * lb/ft³ → kg/m³ = × KG_PER_POUND / ft³_m³, then ÷1000 for kg/L.
 */
export const KG_PER_L_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerL: 1,
  gPerMl: 1,
  gPerCm3: 1,
  kgPerM3: 0.001,
  lbPerL: KG_PER_POUND,
  lbPerFt3: KG_PER_POUND / CUBIC_METERS_PER_CUBIC_FOOT / 1000,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'lbPerL', label: 'lb/L' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
] as const;

export const CATEGORY_OPTIONS: readonly { value: SubstanceCategory; label: string }[] = [
  { value: 'food', label: 'Food' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'oils', label: 'Oils and Fats' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'cooking', label: 'Cooking Ingredients' },
  { value: 'other', label: 'Other Liquids' },
  { value: 'custom', label: 'Custom Substance' },
] as const;

/** Conventional water ≈ 1 kg/L (temperature-dependent). */
export const WATER_DENSITY_KG_PER_L = 1;

export const MAX_ABS_VALUE = 1e15;

/** Demo default: 5 L water @ 1000 kg/m³ ≈ 11.023113 lb. */
export const DEFAULT_LITERS_TO_POUNDS_INPUT: LitersToPoundsInput = {
  source: 'liters',
  category: 'food',
  substanceId: 'water',
  densityValue: 1000,
  densityUnit: 'kgPerM3',
  liters: 5,
  pounds: null,
};
