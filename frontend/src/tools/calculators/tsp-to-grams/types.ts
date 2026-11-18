export type TspGramsSource = 'volume' | 'mass';

export type DensityUnit = 'kgPerM3' | 'gPerMl' | 'gPerCm3';

export type VolumeUnit = 'usTsp' | 'metricTsp';

export interface TspToGramsInput {
  source: TspGramsSource;
  categoryId: string;
  typeId: string;
  densityValue: number | null;
  densityUnit: DensityUnit;
  teaspoons: number | null;
  volumeUnit: VolumeUnit;
  grams: number | null;
}

export interface TspToGramsResult {
  source: TspGramsSource;
  categoryId: string;
  typeId: string;
  ingredientName: string;
  densityGPerMl: number;
  densityApproximate: boolean;
  densityValue: number;
  densityUnit: DensityUnit;
  teaspoons: number;
  volumeUnit: VolumeUnit;
  volumeMl: number;
  grams: number;
  explanation: string;
}

export type TspToGramsFieldErrors = {
  densityValue?: string;
  teaspoons?: string;
  grams?: string;
};

/** Exact: 1 US fl oz = 29.5735295625 mL. */
export const US_FL_OZ_IN_ML = 29.5735295625;
/** Exact: 1 US customary teaspoon = 1/6 US fl oz. */
export const US_TEASPOON_ML = US_FL_OZ_IN_ML / 6;
/** Metric teaspoon = 5 mL. */
export const METRIC_TEASPOON_ML = 5;

export const ML_PER_VOLUME_UNIT: Record<VolumeUnit, number> = {
  usTsp: US_TEASPOON_ML,
  metricTsp: METRIC_TEASPOON_ML,
};

/** Multiply displayed density by this to get g/mL. */
export const G_PER_ML_PER_DENSITY_UNIT: Record<DensityUnit, number> = {
  gPerMl: 1,
  gPerCm3: 1,
  kgPerM3: 0.001,
};

export const DENSITY_UNIT_OPTIONS: readonly { value: DensityUnit; label: string }[] = [
  { value: 'kgPerM3', label: 'kg/m³' },
  { value: 'gPerMl', label: 'g/mL' },
  { value: 'gPerCm3', label: 'g/cm³' },
] as const;

export const VOLUME_UNIT_OPTIONS: readonly { value: VolumeUnit; label: string }[] = [
  { value: 'usTsp', label: 'US tsp' },
  { value: 'metricTsp', label: 'metric tsp' },
] as const;

export const VOLUME_UNIT_LABEL: Record<VolumeUnit, string> = {
  usTsp: 'US tsp',
  metricTsp: 'metric tsp',
};

export const MAX_ABS_VALUE = 1e15;
