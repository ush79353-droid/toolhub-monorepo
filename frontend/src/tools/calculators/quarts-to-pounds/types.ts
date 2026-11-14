/** Which field the user last edited. */
export type CalcSource = 'volume' | 'mass';

/** Quart definitions used by the dedicated standard control and density lb/qt. */
export type QuartStandard = 'usLiquid' | 'imperial' | 'usDry';

export type DensityUnit =
  | 'gPerMl'
  | 'kgPerL'
  | 'kgPerM3'
  | 'gPerCm3'
  | 'lbPerUsLiquidQt'
  | 'lbPerUsLiquidGal';

export type VolumeUnit =
  | 'usLiquidQt'
  | 'imperialQt'
  | 'usDryQt'
  | 'mL'
  | 'L'
  | 'usCup'
  | 'usPint'
  | 'usGallon';

export type MassUnit = 'g' | 'kg' | 'oz' | 'lb';

export interface QuartsToPoundsInput {
  source: CalcSource;
  ingredientId: string;
  quartStandard: QuartStandard;
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

export interface QuartsToPoundsResult {
  source: CalcSource;
  ingredientId: string;
  ingredientName: string;
  densityGPerMl: number;
  densityApproximate: boolean;
  quartStandard: QuartStandard;
  volumeMl: number;
  massG: number;
  volume: number;
  volumeUnit: VolumeUnit;
  mass: number;
  massUnit: MassUnit;
  otherVolumeUnits: readonly OtherUnitRow[];
  otherMassUnits: readonly OtherUnitRow[];
}

export type QuartsToPoundsFieldErrors = {
  densityValue?: string;
  volume?: string;
  mass?: string;
};

/** Exact: 1 US liquid quart = 946.352946 mL. */
export const ML_PER_US_LIQUID_QUART = 946.352946;
/** Exact: 1 Imperial liquid quart = 1136.5225 mL. */
export const ML_PER_IMPERIAL_QUART = 1136.5225;
/** Exact: 1 US dry quart = 2 × US dry pint = 1101.220942715 mL. */
export const ML_PER_US_DRY_QUART = 1101.220942715;

/** Exact: 1 US customary cup = 236.5882365 mL. */
export const ML_PER_US_CUP = 236.5882365;
/** Exact: 1 US liquid pint = 473.176473 mL. */
export const ML_PER_US_PINT = 473.176473;
/** Exact: 1 US liquid gallon = 3785.411784 mL. */
export const ML_PER_US_GALLON = 3785.411784;

/** Exact: 1 lb = 453.59237 g (international avoirdupois pound). */
export const GRAMS_PER_POUND = 453.59237;
/** Exact: 1 lb = 16 oz → 1 oz = 28.349523125 g. */
export const GRAMS_PER_OUNCE = GRAMS_PER_POUND / 16;

export const ML_PER_QUART_STANDARD: Record<QuartStandard, number> = {
  usLiquid: ML_PER_US_LIQUID_QUART,
  imperial: ML_PER_IMPERIAL_QUART,
  usDry: ML_PER_US_DRY_QUART,
};

export const VOLUME_UNIT_FOR_QUART_STANDARD: Record<QuartStandard, VolumeUnit> = {
  usLiquid: 'usLiquidQt',
  imperial: 'imperialQt',
  usDry: 'usDryQt',
};

export const QUART_STANDARD_FOR_VOLUME_UNIT: Partial<Record<VolumeUnit, QuartStandard>> = {
  usLiquidQt: 'usLiquid',
  imperialQt: 'imperial',
  usDryQt: 'usDry',
};

/** Milliliters per one unit of volume. */
export const ML_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  usLiquidQt: ML_PER_US_LIQUID_QUART,
  imperialQt: ML_PER_IMPERIAL_QUART,
  usDryQt: ML_PER_US_DRY_QUART,
  mL: 1,
  L: 1000,
  usCup: ML_PER_US_CUP,
  usPint: ML_PER_US_PINT,
  usGallon: ML_PER_US_GALLON,
};

/** Grams per one unit of mass. */
export const GRAMS_PER_MASS_UNIT: Record<MassUnit, number> = {
  g: 1,
  kg: 1000,
  oz: GRAMS_PER_OUNCE,
  lb: GRAMS_PER_POUND,
};

/**
 * Canonical g/mL per density-unit value.
 * lb/US liquid quart and lb/US liquid gallon use those denominators explicitly.
 */
export const G_PER_ML_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerMl: 1,
  kgPerL: 1,
  gPerCm3: 1,
  kgPerM3: 0.001,
  lbPerUsLiquidQt: GRAMS_PER_POUND / ML_PER_US_LIQUID_QUART,
  lbPerUsLiquidGal: GRAMS_PER_POUND / ML_PER_US_GALLON,
};

export const QUART_STANDARD_OPTIONS: readonly { value: QuartStandard; label: string }[] = [
  { value: 'usLiquid', label: 'US liquid quart' },
  { value: 'imperial', label: 'Imperial liquid quart' },
  { value: 'usDry', label: 'US dry quart' },
] as const;

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'lbPerUsLiquidQt', label: 'lb/US liq. qt' },
  { value: 'lbPerUsLiquidGal', label: 'lb/US liq. gal' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'usLiquidQt', label: 'US liquid qt' },
  { value: 'imperialQt', label: 'Imperial qt' },
  { value: 'usDryQt', label: 'US dry qt' },
  { value: 'mL', label: 'mL' },
  { value: 'L', label: 'L' },
  { value: 'usCup', label: 'US cup' },
  { value: 'usPint', label: 'US pint' },
  { value: 'usGallon', label: 'US gallon' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'lb', label: 'lb' },
  { value: 'oz', label: 'oz' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/**
 * Conventional water density ≈ 1 g/mL (= 1 kg/L).
 * Not exact at every temperature; labeled approximate in the UI.
 */
export const WATER_DENSITY_G_PER_ML = 1;

/** Demo default: 1 US liquid quart of water @ 1 kg/L ≈ 2.08635 lb. */
export const DEFAULT_QUARTS_TO_POUNDS_INPUT: QuartsToPoundsInput = {
  source: 'volume',
  ingredientId: 'water',
  quartStandard: 'usLiquid',
  densityValue: WATER_DENSITY_G_PER_ML,
  densityUnit: 'kgPerL',
  volume: 1,
  volumeUnit: 'usLiquidQt',
  mass: null,
  massUnit: 'lb',
};

export const EMPTY_QUARTS_TO_POUNDS_INPUT: QuartsToPoundsInput = {
  source: 'volume',
  ingredientId: 'water',
  quartStandard: 'usLiquid',
  densityValue: WATER_DENSITY_G_PER_ML,
  densityUnit: 'kgPerL',
  volume: null,
  volumeUnit: 'usLiquidQt',
  mass: null,
  massUnit: 'lb',
};
