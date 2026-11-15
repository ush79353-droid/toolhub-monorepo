/** Which field the user last edited. */
export type CalcSource = 'volume' | 'mass';

/** Gallon definitions used by the dedicated standard control and density lb/gal. */
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
  | 'ft3';

export type MassUnit = 'g' | 'kg' | 'oz' | 'lb' | 'shortTon' | 'tonne';

export interface GallonsToPoundsInput {
  source: CalcSource;
  liquidId: string;
  gallonStandard: GallonStandard;
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

export interface GallonsToPoundsResult {
  source: CalcSource;
  liquidId: string;
  liquidName: string;
  densityGPerMl: number;
  densityApproximate: boolean;
  gallonStandard: GallonStandard;
  volumeMl: number;
  massG: number;
  volume: number;
  volumeUnit: VolumeUnit;
  mass: number;
  massUnit: MassUnit;
  otherVolumeUnits: readonly OtherUnitRow[];
  otherMassUnits: readonly OtherUnitRow[];
}

export type GallonsToPoundsFieldErrors = {
  densityValue?: string;
  volume?: string;
  mass?: string;
};

/** Exact: 1 US liquid gallon = 3785.411784 mL. */
export const ML_PER_US_LIQUID_GALLON = 3785.411784;
/** Exact: 1 Imperial gallon = 4546.09 mL. */
export const ML_PER_IMPERIAL_GALLON = 4546.09;
/** Exact: 1 US dry gallon = 268.8025 in³ × 16.387064 mL/in³. */
export const ML_PER_US_DRY_GALLON = 268.8025 * 16.387064;

/** Exact: 1 US liquid quart = 946.352946 mL. */
export const ML_PER_US_QUART = 946.352946;
/** Exact: 1 US liquid pint = 473.176473 mL. */
export const ML_PER_US_PINT = 473.176473;
/** Exact: 1 ft³ = 28316.846592 mL. */
export const ML_PER_CUBIC_FOOT = 28316.846592;

/** Exact: 1 lb = 453.59237 g (international avoirdupois pound). */
export const GRAMS_PER_POUND = 453.59237;
/** Exact: 1 lb = 16 oz. */
export const GRAMS_PER_OUNCE = GRAMS_PER_POUND / 16;
/** Exact: 1 US short ton = 2000 lb. */
export const GRAMS_PER_SHORT_TON = GRAMS_PER_POUND * 2000;
/** Exact: 1 metric tonne = 1000 kg. */
export const GRAMS_PER_TONNE = 1_000_000;

export const ML_PER_GALLON_STANDARD: Record<GallonStandard, number> = {
  usLiquid: ML_PER_US_LIQUID_GALLON,
  imperial: ML_PER_IMPERIAL_GALLON,
  usDry: ML_PER_US_DRY_GALLON,
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

export const ML_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  usLiquidGal: ML_PER_US_LIQUID_GALLON,
  imperialGal: ML_PER_IMPERIAL_GALLON,
  usDryGal: ML_PER_US_DRY_GALLON,
  mL: 1,
  L: 1000,
  usQuart: ML_PER_US_QUART,
  usPint: ML_PER_US_PINT,
  ft3: ML_PER_CUBIC_FOOT,
};

export const GRAMS_PER_MASS_UNIT: Record<MassUnit, number> = {
  g: 1,
  kg: 1000,
  oz: GRAMS_PER_OUNCE,
  lb: GRAMS_PER_POUND,
  shortTon: GRAMS_PER_SHORT_TON,
  tonne: GRAMS_PER_TONNE,
};

export const G_PER_ML_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerMl: 1,
  kgPerL: 1,
  gPerCm3: 1,
  kgPerM3: 0.001,
  lbPerUsLiquidGal: GRAMS_PER_POUND / ML_PER_US_LIQUID_GALLON,
  lbPerImperialGal: GRAMS_PER_POUND / ML_PER_IMPERIAL_GALLON,
};

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
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'lb', label: 'lb' },
  { value: 'oz', label: 'oz' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'shortTon', label: 'US short ton' },
  { value: 'tonne', label: 'tonne' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/**
 * Conventional water density ≈ 1 g/mL (= 1 kg/L).
 * Not exact at every temperature; labeled approximate in the UI.
 */
export const WATER_DENSITY_G_PER_ML = 1;

/** Demo default: 1 US liquid gallon of water @ 1 kg/L ≈ 8.3454 lb. */
export const DEFAULT_GALLONS_TO_POUNDS_INPUT: GallonsToPoundsInput = {
  source: 'volume',
  liquidId: 'water',
  gallonStandard: 'usLiquid',
  densityValue: WATER_DENSITY_G_PER_ML,
  densityUnit: 'kgPerL',
  volume: 1,
  volumeUnit: 'usLiquidGal',
  mass: null,
  massUnit: 'lb',
};

export const EMPTY_GALLONS_TO_POUNDS_INPUT: GallonsToPoundsInput = {
  source: 'volume',
  liquidId: 'water',
  gallonStandard: 'usLiquid',
  densityValue: WATER_DENSITY_G_PER_ML,
  densityUnit: 'kgPerL',
  volume: null,
  volumeUnit: 'usLiquidGal',
  mass: null,
  massUnit: 'lb',
};
