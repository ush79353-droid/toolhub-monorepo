/** Which field the user last edited among volume/mass. */
export type CubicFeetPoundsSource = 'cubicFeet' | 'pounds';

export type DensityUnit =
  | 'lbPerFt3'
  | 'kgPerM3'
  | 'gPerCm3'
  | 'lbPerIn3'
  | 'kgPerL';

export type SubstanceCategory =
  | 'nonMetals'
  | 'metals'
  | 'liquids'
  | 'construction'
  | 'wood'
  | 'other'
  | 'custom';

export interface CubicFeetToPoundsInput {
  source: CubicFeetPoundsSource;
  category: SubstanceCategory;
  materialId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  cubicFeet: number | null;
  pounds: number | null;
}

export interface CubicFeetToPoundsResult {
  source: CubicFeetPoundsSource;
  materialId: string;
  materialName: string;
  densityLbPerFt3: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  cubicFeet: number;
  pounds: number;
  explanation: string;
}

export type CubicFeetToPoundsFieldErrors = {
  densityValue?: string;
  cubicFeet?: string;
  pounds?: string;
};

/** Exact international avoirdupois pound. */
export const KG_PER_POUND = 0.45359237;

/** Exact: 1 ft = 0.3048 m → 1 ft³ = 0.028316846592 m³. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;

/** Exact: 1 in = 0.0254 m → 1 in³ = 0.0254³ m³. */
export const CUBIC_METERS_PER_CUBIC_INCH = 0.0254 ** 3;

/**
 * Multiply displayed density by this factor to get kg/m³.
 * lb/ft³ uses exact lb and ft³ constants above.
 */
export const KG_PER_M3_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  lbPerFt3: KG_PER_POUND / CUBIC_METERS_PER_CUBIC_FOOT,
  kgPerM3: 1,
  gPerCm3: 1000,
  lbPerIn3: KG_PER_POUND / CUBIC_METERS_PER_CUBIC_INCH,
  kgPerL: 1000,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'lbPerFt3', label: 'lb/ft³' },
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'lbPerIn3', label: 'lb/in³' },
  { value: 'kgPerL', label: 'kg/L' },
] as const;

export const CATEGORY_OPTIONS: readonly { value: SubstanceCategory; label: string }[] = [
  { value: 'nonMetals', label: 'Non-metals' },
  { value: 'metals', label: 'Metals' },
  { value: 'liquids', label: 'Liquids' },
  { value: 'construction', label: 'Construction materials' },
  { value: 'wood', label: 'Wood' },
  { value: 'other', label: 'Other materials' },
  { value: 'custom', label: 'Custom material' },
] as const;

/** Screenshot / reference default for concrete (approximate). */
export const CONCRETE_DENSITY_LB_PER_FT3 = 149.83;

/** Approximate water density near 20 °C. */
export const WATER_DENSITY_LB_PER_FT3 = 62.3;

export const MAX_ABS_VALUE = 1e15;

/** Default: Non-metals / Concrete / 149.83 lb/ft³; volume and mass empty until entered. */
export const DEFAULT_CUBIC_FEET_TO_POUNDS_INPUT: CubicFeetToPoundsInput = {
  source: 'cubicFeet',
  category: 'nonMetals',
  materialId: 'concrete',
  densityValue: CONCRETE_DENSITY_LB_PER_FT3,
  densityUnit: 'lbPerFt3',
  cubicFeet: null,
  pounds: null,
};
