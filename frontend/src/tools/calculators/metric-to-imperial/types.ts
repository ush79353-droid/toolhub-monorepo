export type ConversionCategory =
  | 'length'
  | 'area'
  | 'volume'
  | 'mass'
  | 'temperature'
  | 'speed';

export type UnitSystem = 'metric' | 'imperial';

export type ActiveField = 'metric' | 'imperial';

export interface ConversionUnit {
  id: string;
  label: string;
  symbol: string;
  system: UnitSystem;
  /** Base units per 1 of this unit (linear). Unused for temperature. */
  factorToBase?: number;
}

export interface ConversionCategoryConfig {
  id: ConversionCategory;
  label: string;
  kind: 'linear' | 'temperature';
  baseLabel: string;
  allowNegative: boolean;
  metricUnits: readonly ConversionUnit[];
  imperialUnits: readonly ConversionUnit[];
  defaultMetricUnit: string;
  defaultImperialUnit: string;
  metricFieldLabel: string;
  imperialFieldLabel: string;
}

export type MetricImperialFieldErrors = {
  metric?: string;
  imperial?: string;
};

export const CATEGORY_OPTIONS: readonly {
  value: ConversionCategory;
  label: string;
}[] = [
  { value: 'length', label: 'Length' },
  { value: 'area', label: 'Area' },
  { value: 'volume', label: 'Volume' },
  { value: 'mass', label: 'Mass / Weight' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'speed', label: 'Speed' },
] as const;

export const MAX_ABS_VALUE = 1e24;
export const ABS_ZERO_EPS = 1e-9;
