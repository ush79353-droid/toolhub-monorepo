/** Measurement categories for Metric to Standard Converter. */
export type ConversionCategory =
  | 'length'
  | 'area'
  | 'mass'
  | 'volume'
  | 'temperature';

export type UnitKind = 'linear' | 'temperature';

export interface UnitDefinition {
  id: string;
  label: string;
  symbol: string;
  group: string;
  /** Base units per 1 of this unit. Unused for temperature. */
  factorToBase?: number;
}

export interface ConversionGroup {
  id: string;
  title: string;
  units: readonly UnitDefinition[];
}

export interface CategoryDefinition {
  id: ConversionCategory;
  label: string;
  kind: UnitKind;
  baseLabel: string;
  summaryUnitIds: readonly string[];
  allowNegative: boolean;
  groups: readonly ConversionGroup[];
}

export type MetricFieldErrors = Record<string, string>;

export const MAX_ABS_VALUE = 1e30;

export const CATEGORY_OPTIONS: readonly {
  value: ConversionCategory;
  label: string;
}[] = [
  { value: 'length', label: 'Length' },
  { value: 'area', label: 'Area' },
  { value: 'mass', label: 'Mass / Weight' },
  { value: 'volume', label: 'Volume' },
  { value: 'temperature', label: 'Temperature' },
] as const;
