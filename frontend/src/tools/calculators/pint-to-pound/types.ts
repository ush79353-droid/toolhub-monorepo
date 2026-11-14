/** Which field the user last edited. */
export type CalcSource = 'volume' | 'mass';

/** Pint definitions used by the dedicated standard control and density lb/pint. */
export type PintStandard = 'usLiquid' | 'imperial' | 'usDry';

export type DensityUnit =
  | 'gPerMl'
  | 'kgPerL'
  | 'kgPerM3'
  | 'gPerCm3'
  | 'lbPerUsLiquidPt'
  | 'lbPerFt3';

export type VolumeUnit =
  | 'usLiquidPt'
  | 'imperialPt'
  | 'usDryPt'
  | 'mL'
  | 'L'
  | 'usCup'
  | 'usQuart'
  | 'usGallon'
  | 'cm3';

export type MassUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb';

export interface PintToPoundInput {
  source: CalcSource;
  ingredientId: string;
  pintStandard: PintStandard;
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

export interface PintToPoundResult {
  source: CalcSource;
  ingredientId: string;
  ingredientName: string;
  densityGPerMl: number;
  densityApproximate: boolean;
  pintStandard: PintStandard;
  volumeMl: number;
  massG: number;
  volume: number;
  volumeUnit: VolumeUnit;
  mass: number;
  massUnit: MassUnit;
  otherVolumeUnits: readonly OtherUnitRow[];
  otherMassUnits: readonly OtherUnitRow[];
}

export type PintToPoundFieldErrors = {
  densityValue?: string;
  volume?: string;
  mass?: string;
};

/** Exact: 1 US liquid pint = 473.176473 mL. */
export const ML_PER_US_LIQUID_PINT = 473.176473;
/** Exact: 1 imperial liquid pint = 568.26125 mL. */
export const ML_PER_IMPERIAL_PINT = 568.26125;
/** Exact (US dry): 1 US dry pint = 550.6104713575 mL. */
export const ML_PER_US_DRY_PINT = 550.6104713575;

/** Exact: 1 US customary cup = 236.5882365 mL. */
export const ML_PER_US_CUP = 236.5882365;
/** Exact: 1 US liquid quart = 946.352946 mL. */
export const ML_PER_US_QUART = 946.352946;
/** Exact: 1 US liquid gallon = 3785.411784 mL. */
export const ML_PER_US_GALLON = 3785.411784;
/** Exact: 1 ft³ = 28316.846592 mL. */
export const ML_PER_CUBIC_FOOT = 28316.846592;

/** Exact: 1 lb = 453.59237 g (international avoirdupois pound). */
export const GRAMS_PER_POUND = 453.59237;
/** Exact: 1 lb = 16 oz → 1 oz = 28.349523125 g. */
export const GRAMS_PER_OUNCE = GRAMS_PER_POUND / 16;

export const ML_PER_PINT_STANDARD: Record<PintStandard, number> = {
  usLiquid: ML_PER_US_LIQUID_PINT,
  imperial: ML_PER_IMPERIAL_PINT,
  usDry: ML_PER_US_DRY_PINT,
};

export const VOLUME_UNIT_FOR_PINT_STANDARD: Record<PintStandard, VolumeUnit> = {
  usLiquid: 'usLiquidPt',
  imperial: 'imperialPt',
  usDry: 'usDryPt',
};

export const PINT_STANDARD_FOR_VOLUME_UNIT: Partial<Record<VolumeUnit, PintStandard>> = {
  usLiquidPt: 'usLiquid',
  imperialPt: 'imperial',
  usDryPt: 'usDry',
};

/** Milliliters per one unit of volume. */
export const ML_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  usLiquidPt: ML_PER_US_LIQUID_PINT,
  imperialPt: ML_PER_IMPERIAL_PINT,
  usDryPt: ML_PER_US_DRY_PINT,
  mL: 1,
  L: 1000,
  usCup: ML_PER_US_CUP,
  usQuart: ML_PER_US_QUART,
  usGallon: ML_PER_US_GALLON,
  cm3: 1,
};

/** Grams per one unit of mass. */
export const GRAMS_PER_MASS_UNIT: Record<MassUnit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: GRAMS_PER_OUNCE,
  lb: GRAMS_PER_POUND,
};

/**
 * Canonical g/mL per density-unit value.
 * lb/US liquid pint uses the US liquid pint denominator explicitly.
 */
export const G_PER_ML_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerMl: 1,
  kgPerL: 1,
  gPerCm3: 1,
  kgPerM3: 0.001,
  lbPerUsLiquidPt: GRAMS_PER_POUND / ML_PER_US_LIQUID_PINT,
  lbPerFt3: GRAMS_PER_POUND / ML_PER_CUBIC_FOOT,
};

export const PINT_STANDARD_OPTIONS: readonly { value: PintStandard; label: string }[] = [
  { value: 'usLiquid', label: 'US liquid pint' },
  { value: 'imperial', label: 'Imperial liquid pint' },
  { value: 'usDry', label: 'US dry pint' },
] as const;

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'lbPerUsLiquidPt', label: 'lb/US liq. pt' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'usLiquidPt', label: 'US liquid pt' },
  { value: 'imperialPt', label: 'Imperial pt' },
  { value: 'usDryPt', label: 'US dry pt' },
  { value: 'mL', label: 'mL' },
  { value: 'L', label: 'L' },
  { value: 'usCup', label: 'US cup' },
  { value: 'usQuart', label: 'US quart' },
  { value: 'usGallon', label: 'US gallon' },
  { value: 'cm3', label: 'cm³' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'oz', label: 'oz' },
  { value: 'lb', label: 'lb' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/**
 * Conventional water density ≈ 1 g/mL.
 * Not exact at every temperature; labeled approximate in the UI.
 */
export const WATER_DENSITY_G_PER_ML = 1;

/** Demo default: 1 US liquid pint of water @ 1 g/mL ≈ 1.04318 lb. */
export const DEFAULT_PINT_TO_POUND_INPUT: PintToPoundInput = {
  source: 'volume',
  ingredientId: 'water',
  pintStandard: 'usLiquid',
  densityValue: WATER_DENSITY_G_PER_ML,
  densityUnit: 'gPerMl',
  volume: 1,
  volumeUnit: 'usLiquidPt',
  mass: null,
  massUnit: 'lb',
};

export const EMPTY_PINT_TO_POUND_INPUT: PintToPoundInput = {
  source: 'volume',
  ingredientId: 'water',
  pintStandard: 'usLiquid',
  densityValue: WATER_DENSITY_G_PER_ML,
  densityUnit: 'gPerMl',
  volume: null,
  volumeUnit: 'usLiquidPt',
  mass: null,
  massUnit: 'lb',
};
