/** Which field the user last edited. */
export type CalcSource = 'mass' | 'volume';

export type SubstanceCategory =
  | 'liquids'
  | 'food'
  | 'metals'
  | 'non-metals'
  | 'gases'
  | 'custom';

export type GallonStandard = 'usLiquid' | 'imperial' | 'usDry';

export type DensityUnit =
  | 'gPerMl'
  | 'kgPerL'
  | 'kgPerM3'
  | 'gPerCm3'
  | 'lbPerUsLiquidGal'
  | 'lbPerImperialGal';

export type VolumeUnit =
  | 'usLiquidGal'
  | 'imperialGal'
  | 'usDryGal'
  | 'mL'
  | 'L'
  | 'usQuart'
  | 'usPint'
  | 'ft3'
  | 'm3';

export type MassUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb' | 'tonne';

export interface KgToGallonsInput {
  source: CalcSource;
  category: SubstanceCategory;
  substanceId: string;
  gallonStandard: GallonStandard;
  densityValue: number | null;
  densityUnit: DensityUnit;
  mass: number | null;
  massUnit: MassUnit;
  volume: number | null;
  volumeUnit: VolumeUnit;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface KgToGallonsResult {
  source: CalcSource;
  category: SubstanceCategory;
  substanceId: string;
  substanceName: string;
  densityKgPerL: number;
  densityApproximate: boolean;
  gallonStandard: GallonStandard;
  massKg: number;
  volumeL: number;
  mass: number;
  massUnit: MassUnit;
  volume: number;
  volumeUnit: VolumeUnit;
  otherVolumeUnits: readonly OtherUnitRow[];
  otherMassUnits: readonly OtherUnitRow[];
}

export type KgToGallonsFieldErrors = {
  densityValue?: string;
  mass?: string;
  volume?: string;
};

/** Exact: 1 US liquid gallon = 3.785411784 L. */
export const LITERS_PER_US_LIQUID_GALLON = 3.785411784;
/** Exact: 1 Imperial gallon = 4.54609 L. */
export const LITERS_PER_IMPERIAL_GALLON = 4.54609;
/** Exact: 1 US dry gallon = 268.8025 in³ × 0.016387064 L/in³. */
export const LITERS_PER_US_DRY_GALLON = 268.8025 * 0.016387064;

export const LITERS_PER_US_QUART = LITERS_PER_US_LIQUID_GALLON / 4;
export const LITERS_PER_US_PINT = LITERS_PER_US_LIQUID_GALLON / 8;
/** Exact: 1 ft³ = 28.316846592 L. */
export const LITERS_PER_CUBIC_FOOT = 28.316846592;

/** Exact: 1 lb = 0.45359237 kg. */
export const KG_PER_POUND = 0.45359237;
/** Exact: 1 avoirdupois oz = lb / 16. */
export const KG_PER_OUNCE = KG_PER_POUND / 16;

export const LITERS_PER_GALLON_STANDARD: Record<GallonStandard, number> = {
  usLiquid: LITERS_PER_US_LIQUID_GALLON,
  imperial: LITERS_PER_IMPERIAL_GALLON,
  usDry: LITERS_PER_US_DRY_GALLON,
};

export const VOLUME_UNIT_FOR_GALLON_STANDARD: Record<GallonStandard, VolumeUnit> = {
  usLiquid: 'usLiquidGal',
  imperial: 'imperialGal',
  usDry: 'usDryGal',
};

export const GALLON_STANDARD_FOR_VOLUME_UNIT: Partial<
  Record<VolumeUnit, GallonStandard>
> = {
  usLiquidGal: 'usLiquid',
  imperialGal: 'imperial',
  usDryGal: 'usDry',
};

export const LITERS_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  usLiquidGal: LITERS_PER_US_LIQUID_GALLON,
  imperialGal: LITERS_PER_IMPERIAL_GALLON,
  usDryGal: LITERS_PER_US_DRY_GALLON,
  mL: 0.001,
  L: 1,
  usQuart: LITERS_PER_US_QUART,
  usPint: LITERS_PER_US_PINT,
  ft3: LITERS_PER_CUBIC_FOOT,
  m3: 1000,
};

export const KG_PER_MASS_UNIT: Record<MassUnit, number> = {
  mg: 1e-6,
  g: 0.001,
  kg: 1,
  oz: KG_PER_OUNCE,
  lb: KG_PER_POUND,
  tonne: 1000,
};

/** Factor to convert a density unit reading into kg/L. */
export const KG_PER_L_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerMl: 1,
  kgPerL: 1,
  gPerCm3: 1,
  kgPerM3: 0.001,
  lbPerUsLiquidGal: KG_PER_POUND / LITERS_PER_US_LIQUID_GALLON,
  lbPerImperialGal: KG_PER_POUND / LITERS_PER_IMPERIAL_GALLON,
};

export const CATEGORY_OPTIONS: readonly {
  value: SubstanceCategory;
  label: string;
}[] = [
  { value: 'liquids', label: 'Liquids' },
  { value: 'food', label: 'Food' },
  { value: 'metals', label: 'Metals' },
  { value: 'non-metals', label: 'Non-metals' },
  { value: 'gases', label: 'Gases' },
  { value: 'custom', label: 'Custom substance' },
] as const;

export const GALLON_STANDARD_OPTIONS: readonly {
  value: GallonStandard;
  label: string;
}[] = [
  { value: 'usLiquid', label: 'US liquid gallon' },
  { value: 'imperial', label: 'Imperial gallon' },
  { value: 'usDry', label: 'US dry gallon' },
] as const;

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'lbPerUsLiquidGal', label: 'lb/US liq. gal' },
  { value: 'lbPerImperialGal', label: 'lb/Imp. gal' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'usLiquidGal', label: 'US liquid gal' },
  { value: 'imperialGal', label: 'Imperial gal' },
  { value: 'usDryGal', label: 'US dry gal' },
  { value: 'L', label: 'L' },
  { value: 'mL', label: 'mL' },
  { value: 'usQuart', label: 'US quart' },
  { value: 'usPint', label: 'US pint' },
  { value: 'ft3', label: 'ft³' },
  { value: 'm3', label: 'm³' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'mg', label: 'mg' },
  { value: 'lb', label: 'lb' },
  { value: 'oz', label: 'oz' },
  { value: 'tonne', label: 't' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/**
 * Conventional water density ≈ 1 kg/L.
 * Approximate; actual density varies with temperature and pressure.
 */
export const WATER_DENSITY_KG_PER_L = 1;

/** Demo: 1 kg water @ 1 kg/L ≈ 0.264172 US gal. */
export const DEFAULT_KG_TO_GALLONS_INPUT: KgToGallonsInput = {
  source: 'mass',
  category: 'liquids',
  substanceId: 'water',
  gallonStandard: 'usLiquid',
  densityValue: WATER_DENSITY_KG_PER_L,
  densityUnit: 'kgPerL',
  mass: 1,
  massUnit: 'kg',
  volume: null,
  volumeUnit: 'usLiquidGal',
};

export const EMPTY_KG_TO_GALLONS_INPUT: KgToGallonsInput = {
  source: 'mass',
  category: 'liquids',
  substanceId: 'water',
  gallonStandard: 'usLiquid',
  densityValue: WATER_DENSITY_KG_PER_L,
  densityUnit: 'kgPerL',
  mass: null,
  massUnit: 'kg',
  volume: null,
  volumeUnit: 'usLiquidGal',
};
