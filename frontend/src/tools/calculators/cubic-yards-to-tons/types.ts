/** Substance discovery categories (density still comes from the material or custom entry). */
export type SubstanceCategory = 'food' | 'metals' | 'nonMetals' | 'gases' | 'liquids';

export type DensityUnit = 'kgPerM3' | 'gPerCm3' | 'gPerMl' | 'kgPerL' | 'lbPerFt3' | 'lbPerYd3';

export type VolumeUnit = 'yd3' | 'ft3' | 'm3' | 'cm3' | 'L';

export type MassUnit = 'mg' | 'g' | 'kg' | 't' | 'lb' | 'usTon' | 'longTon';

/** Which field the user last edited. */
export type CalcSource = 'volume' | 'mass';

export interface CubicYardsToTonsInput {
  source: CalcSource;
  category: SubstanceCategory;
  materialId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  volume: number | null;
  volumeUnit: VolumeUnit;
  mass: number | null;
  massUnit: MassUnit;
}

export interface OtherUnitRow {
  unit: string;
  label: string;
  value: number;
}

export interface CubicYardsToTonsResult {
  source: CalcSource;
  materialId: string;
  materialName: string;
  densityKgPerM3: number;
  densityApproximate: boolean;
  volumeCubicMeters: number;
  massKg: number;
  volume: number;
  volumeUnit: VolumeUnit;
  mass: number;
  massUnit: MassUnit;
  otherVolumeUnits: readonly OtherUnitRow[];
  otherMassUnits: readonly OtherUnitRow[];
}

export type CubicYardsToTonsFieldErrors = {
  densityValue?: string;
  volume?: string;
  mass?: string;
};

/** Exact: 1 yd = 0.9144 m → 1 yd³ = 0.9144³ m³. */
export const CUBIC_METERS_PER_CUBIC_YARD = 0.764554857984;
/** Exact: 1 ft³ = (0.3048)³ m³. */
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;
/** Exact: 1 yd³ = 27 ft³. */
export const CUBIC_FEET_PER_CUBIC_YARD = 27;

/** Exact: 1 lb = 0.45359237 kg (international avoirdupois pound). */
export const KILOGRAMS_PER_POUND = 0.45359237;
/** Exact: 1 metric tonne = 1000 kg. */
export const KILOGRAMS_PER_METRIC_TONNE = 1000;
/** Exact: 1 US short ton = 2000 lb. */
export const KILOGRAMS_PER_US_SHORT_TON = 2000 * KILOGRAMS_PER_POUND; // 907.18474
/** Exact: 1 imperial long ton = 2240 lb. */
export const KILOGRAMS_PER_IMPERIAL_LONG_TON = 2240 * KILOGRAMS_PER_POUND; // 1016.0469088

/**
 * Canonical kg/m³ per density-unit value.
 * lb/ft³ and lb/yd³ use exact lb and volume constants above.
 */
export const KG_PER_M3_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  kgPerM3: 1,
  gPerCm3: 1000,
  gPerMl: 1000,
  kgPerL: 1000,
  lbPerFt3: KILOGRAMS_PER_POUND / CUBIC_METERS_PER_CUBIC_FOOT,
  lbPerYd3: KILOGRAMS_PER_POUND / CUBIC_METERS_PER_CUBIC_YARD,
};

export const CUBIC_METERS_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  yd3: CUBIC_METERS_PER_CUBIC_YARD,
  ft3: CUBIC_METERS_PER_CUBIC_FOOT,
  m3: 1,
  cm3: 1e-6,
  L: 0.001,
};

export const KILOGRAMS_PER_MASS_UNIT: Record<MassUnit, number> = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  t: KILOGRAMS_PER_METRIC_TONNE,
  lb: KILOGRAMS_PER_POUND,
  usTon: KILOGRAMS_PER_US_SHORT_TON,
  longTon: KILOGRAMS_PER_IMPERIAL_LONG_TON,
};

export const CATEGORY_OPTIONS: readonly { value: SubstanceCategory; label: string }[] = [
  { value: 'food', label: 'Food' },
  { value: 'metals', label: 'Metals' },
  { value: 'nonMetals', label: 'Non-metals' },
  { value: 'gases', label: 'Gases' },
  { value: 'liquids', label: 'Liquids' },
] as const;

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
  { value: 'lbPerYd3', label: 'lb/yd³' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'yd3', label: 'yd³' },
  { value: 'ft3', label: 'ft³' },
  { value: 'm3', label: 'm³' },
  { value: 'cm3', label: 'cm³' },
  { value: 'L', label: 'L' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 't', label: 't (metric)' },
  { value: 'lb', label: 'lb' },
  { value: 'usTon', label: 'US short ton' },
  { value: 'longTon', label: 'imp. long ton' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/** Conventional water density ≈ 1000 kg/m³ (not exact at every temperature). */
export const WATER_DENSITY_KG_PER_M3 = 1000;

/** Demo default: Food / Water / 1 yd³ → ≈ 0.76455 t. */
export const DEFAULT_CUBIC_YARDS_TO_TONS_INPUT: CubicYardsToTonsInput = {
  source: 'volume',
  category: 'food',
  materialId: 'water',
  densityValue: WATER_DENSITY_KG_PER_M3,
  densityUnit: 'kgPerM3',
  volume: 1,
  volumeUnit: 'yd3',
  mass: null,
  massUnit: 't',
};

export const EMPTY_CUBIC_YARDS_TO_TONS_INPUT: CubicYardsToTonsInput = {
  source: 'volume',
  category: 'food',
  materialId: 'water',
  densityValue: WATER_DENSITY_KG_PER_M3,
  densityUnit: 'kgPerM3',
  volume: null,
  volumeUnit: 'yd3',
  mass: null,
  massUnit: 't',
};
