export type MgTbspSource = 'milligrams' | 'tablespoons';

export type TablespoonStandard = 'us' | 'metric' | 'australian';

export type DensityUnit =
  | 'gPerMl'
  | 'gPerCm3'
  | 'kgPerM3'
  | 'kgPerL'
  | 'mgPerMl'
  | 'lbPerUsGal';

export interface MgToTablespoonInput {
  source: MgTbspSource;
  substanceId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  tablespoonStandard: TablespoonStandard;
  milligrams: number | null;
  tablespoons: number | null;
}

export interface MgToTablespoonResult {
  source: MgTbspSource;
  substanceId: string;
  substanceName: string;
  densityGPerMl: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  tablespoonStandard: TablespoonStandard;
  tablespoonMl: number;
  milligrams: number;
  tablespoons: number;
  explanation: string;
}

export type MgToTablespoonFieldErrors = {
  densityValue?: string;
  milligrams?: string;
  tablespoons?: string;
};

/** Exact: 1 US liquid gallon = 3785.411784 mL; 1 US tbsp = gallon / 256. */
export const US_TABLESPOON_ML = 14.78676478125;
export const METRIC_TABLESPOON_ML = 15;
export const AUSTRALIAN_TABLESPOON_ML = 20;
export const MILLIGRAMS_PER_GRAM = 1000;
export const ML_PER_US_GALLON = 3785.411784;
export const KG_PER_POUND = 0.45359237;

export const TABLESPOON_ML: Record<TablespoonStandard, number> = {
  us: US_TABLESPOON_ML,
  metric: METRIC_TABLESPOON_ML,
  australian: AUSTRALIAN_TABLESPOON_ML,
};

export const TABLESPOON_STANDARD_OPTIONS: readonly {
  value: TablespoonStandard;
  label: string;
}[] = [
  { value: 'us', label: 'US tbsp (14.78676478125 mL)' },
  { value: 'metric', label: 'Metric tbsp (15 mL)' },
  { value: 'australian', label: 'Australian tbsp (20 mL)' },
] as const;

export const TABLESPOON_STANDARD_LABEL: Record<TablespoonStandard, string> = {
  us: 'US tbsp',
  metric: 'metric tbsp',
  australian: 'Australian tbsp',
};

/** Multiply displayed density by this to get g/mL. */
export const G_PER_ML_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerMl: 1,
  gPerCm3: 1,
  kgPerL: 1,
  kgPerM3: 0.001,
  mgPerMl: 0.001,
  lbPerUsGal: (KG_PER_POUND * 1000) / ML_PER_US_GALLON,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'kgPerL', label: 'kg/L' },
  { value: 'mgPerMl', label: 'mg/mL' },
  { value: 'lbPerUsGal', label: 'lb/US gal' },
] as const;

/** Assumed bulk density for table salt from the reference screenshot. */
export const SALT_DENSITY_G_PER_ML = 1.217;
export const WATER_DENSITY_G_PER_ML = 1;

export const MAX_ABS_VALUE = 1e15;
