export type GTspSource = 'mass' | 'volume';

export type DensityUnit =
  | 'kgPerM3'
  | 'gPerMl'
  | 'gPerCm3'
  | 'gPerL'
  | 'kgPerL'
  | 'lbPerFt3'
  | 'lbPerUsGal';

export type MassUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb';

export type VolumeUnit =
  | 'usTsp'
  | 'metricTsp'
  | 'usTbsp'
  | 'metricTbsp'
  | 'mL'
  | 'L'
  | 'usCup'
  | 'usFlOz'
  | 'usPt'
  | 'usQt';

export interface GToTspInput {
  source: GTspSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  mass: number | null;
  massUnit: MassUnit;
  volume: number | null;
  volumeUnit: VolumeUnit;
}

export interface GToTspResult {
  source: GTspSource;
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

export type GToTspFieldErrors = {
  densityValue?: string;
  mass?: string;
  volume?: string;
};

/** Exact: 1 US fl oz = 29.5735295625 mL. */
export const US_FL_OZ_IN_ML = 29.5735295625;
/** Exact: 1 US customary teaspoon = 1/6 US fl oz = 4.92892159375 mL. */
export const US_TEASPOON_ML = US_FL_OZ_IN_ML / 6;
/** Metric teaspoon = 5 mL. */
export const METRIC_TEASPOON_ML = 5;
/** Exact: 1 US tablespoon = 3 US tsp. */
export const US_TABLESPOON_ML = US_TEASPOON_ML * 3;
/** Metric tablespoon = 15 mL. */
export const METRIC_TABLESPOON_ML = 15;

export const ML_PER_US_GALLON = US_FL_OZ_IN_ML * 128;
export const CUBIC_METERS_PER_CUBIC_FOOT = 0.028316846592;
export const KG_PER_POUND = 0.45359237;

export const ML_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  usTsp: US_TEASPOON_ML,
  metricTsp: METRIC_TEASPOON_ML,
  usTbsp: US_TABLESPOON_ML,
  metricTbsp: METRIC_TABLESPOON_ML,
  mL: 1,
  L: 1000,
  usCup: 236.5882365,
  usFlOz: US_FL_OZ_IN_ML,
  usPt: ML_PER_US_GALLON / 8,
  usQt: ML_PER_US_GALLON / 4,
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
  gPerL: 0.001,
  kgPerM3: 0.001,
  lbPerFt3: (KG_PER_POUND * 1000) / (CUBIC_METERS_PER_CUBIC_FOOT * 1_000_000),
  lbPerUsGal: (KG_PER_POUND * 1000) / ML_PER_US_GALLON,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'gPerL', label: 'g/L' },
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
  { value: 'usTsp', label: 'US tsp' },
  { value: 'metricTsp', label: 'metric tsp' },
  { value: 'usTbsp', label: 'US tbsp' },
  { value: 'metricTbsp', label: 'metric tbsp' },
  { value: 'mL', label: 'mL' },
  { value: 'L', label: 'L' },
  { value: 'usCup', label: 'US cup' },
  { value: 'usFlOz', label: 'US fl oz' },
  { value: 'usPt', label: 'US pt' },
  { value: 'usQt', label: 'US qt' },
] as const;

export const MASS_UNIT_LABEL: Record<MassUnit, string> = {
  mg: 'mg',
  g: 'g',
  kg: 'kg',
  oz: 'oz',
  lb: 'lb',
};

export const VOLUME_UNIT_LABEL: Record<VolumeUnit, string> = {
  usTsp: 'US tsp',
  metricTsp: 'metric tsp',
  usTbsp: 'US tbsp',
  metricTbsp: 'metric tbsp',
  mL: 'mL',
  L: 'L',
  usCup: 'US cup',
  usFlOz: 'US fl oz',
  usPt: 'US pt',
  usQt: 'US qt',
};

/** Table salt (bulk) ≈ 1.217 g/mL = 1217 kg/m³. */
export const SALT_DENSITY_G_PER_ML = 1.217;
export const SALT_DENSITY_KG_PER_M3 = 1217;

export const MAX_ABS_VALUE = 1e15;
