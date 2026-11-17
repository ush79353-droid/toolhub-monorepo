export type GramsFlOzSource = 'mass' | 'volume';

export type FluidOunceSystem = 'US' | 'UK';

export type DensityUnit =
  | 'gPerMl'
  | 'gPerCm3'
  | 'kgPerM3'
  | 'kgPerL'
  | 'lbPerFt3'
  | 'lbPerUsGal';

export type MassUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb';

export type VolumeUnit =
  | 'usFlOz'
  | 'ukFlOz'
  | 'mL'
  | 'L'
  | 'cm3'
  | 'usTsp'
  | 'usTbsp'
  | 'usCup'
  | 'usPt'
  | 'usQt'
  | 'usGal'
  | 'ukPt'
  | 'ukGal';

export interface GramsToFlOzInput {
  source: GramsFlOzSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  mass: number | null;
  massUnit: MassUnit;
  volume: number | null;
  volumeUnit: VolumeUnit;
}

export interface GramsToFlOzResult {
  source: GramsFlOzSource;
  substanceId: string;
  substanceName: string;
  densityGPerMl: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  mass: number;
  massUnit: MassUnit;
  massG: number;
  volume: number;
  volumeUnit: VolumeUnit;
  volumeMl: number;
  explanation: string;
}

export type GramsToFlOzFieldErrors = {
  densityValue?: string;
  mass?: string;
  volume?: string;
};

/** Exact: 1 US fl oz = 29.5735295625 mL. */
export const US_FL_OZ_IN_ML = 29.5735295625;
/** Exact: 1 UK/imperial fl oz = 28.4130625 mL. */
export const UK_FL_OZ_IN_ML = 28.4130625;
/** Exact: 1 US liquid gallon = 128 US fl oz = 3785.411784 mL. */
export const ML_PER_US_GALLON = US_FL_OZ_IN_ML * 128;
/** Exact: 1 UK imperial gallon = 160 UK fl oz = 4546.09 mL. */
export const ML_PER_UK_GALLON = UK_FL_OZ_IN_ML * 160;

export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;
export const KG_PER_POUND = 0.45359237;

export const ML_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  usFlOz: US_FL_OZ_IN_ML,
  ukFlOz: UK_FL_OZ_IN_ML,
  mL: 1,
  L: 1000,
  cm3: 1,
  usTsp: ML_PER_US_GALLON / 768,
  usTbsp: ML_PER_US_GALLON / 256,
  usCup: 236.5882365,
  usPt: ML_PER_US_GALLON / 8,
  usQt: ML_PER_US_GALLON / 4,
  usGal: ML_PER_US_GALLON,
  ukPt: ML_PER_UK_GALLON / 8,
  ukGal: ML_PER_UK_GALLON,
};

export const G_PER_MASS_UNIT: Record<MassUnit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: (KG_PER_POUND * 1000) / 16,
  lb: KG_PER_POUND * 1000,
};

/** Multiply displayed density by this to get g/mL. */
export const G_PER_ML_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerMl: 1,
  gPerCm3: 1,
  kgPerL: 1,
  kgPerM3: 0.001,
  lbPerFt3: (KG_PER_POUND * 1000) / (CUBIC_METERS_PER_CUBIC_FOOT * 1_000_000),
  lbPerUsGal: (KG_PER_POUND * 1000) / ML_PER_US_GALLON,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'lbPerFt3', label: 'lb/ft³' },
  { value: 'lbPerUsGal', label: 'lb/US gal' },
] as const;

export const MASS_UNIT_OPTIONS: readonly { value: MassUnit; label: string }[] = [
  { value: 'g', label: 'g' },
  { value: 'mg', label: 'mg' },
  { value: 'kg', label: 'kg' },
  { value: 'oz', label: 'oz' },
  { value: 'lb', label: 'lb' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'usFlOz', label: 'US fl oz' },
  { value: 'ukFlOz', label: 'UK fl oz' },
  { value: 'mL', label: 'mL' },
  { value: 'L', label: 'L' },
  { value: 'cm3', label: 'cm³' },
  { value: 'usTsp', label: 'US tsp' },
  { value: 'usTbsp', label: 'US tbsp' },
  { value: 'usCup', label: 'US cup' },
  { value: 'usPt', label: 'US pt' },
  { value: 'usQt', label: 'US qt' },
  { value: 'usGal', label: 'US gal' },
  { value: 'ukPt', label: 'UK pt' },
  { value: 'ukGal', label: 'UK gal' },
] as const;

export const MASS_UNIT_LABEL: Record<MassUnit, string> = {
  mg: 'mg',
  g: 'g',
  kg: 'kg',
  oz: 'oz',
  lb: 'lb',
};

export const VOLUME_UNIT_LABEL: Record<VolumeUnit, string> = {
  usFlOz: 'US fl oz',
  ukFlOz: 'UK fl oz',
  mL: 'mL',
  L: 'L',
  cm3: 'cm³',
  usTsp: 'US tsp',
  usTbsp: 'US tbsp',
  usCup: 'US cup',
  usPt: 'US pt',
  usQt: 'US qt',
  usGal: 'US gal',
  ukPt: 'UK pt',
  ukGal: 'UK gal',
};

/** Conventional water ≈ 1 g/mL. */
export const WATER_DENSITY_G_PER_ML = 1;

export const MAX_ABS_VALUE = 1e15;
