/** Measurement categories for the Metric Converter. */
export type ConversionCategory =
  | 'length'
  | 'mass'
  | 'area'
  | 'volume'
  | 'temperature'
  | 'speed'
  | 'time'
  | 'energy'
  | 'power'
  | 'pressure'
  | 'dataStorage';

export type UnitKind = 'linear' | 'temperature';

export interface UnitDefinition {
  id: string;
  label: string;
  symbol: string;
  group: string;
  /** Base units per 1 of this unit (meters, kg, …). Unused for temperature. */
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
  /** Representative unit ids for share/summary. */
  summaryUnitIds: readonly string[];
  /** Allow negative values (temperature only). */
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
  { value: 'mass', label: 'Mass / Weight' },
  { value: 'area', label: 'Area' },
  { value: 'volume', label: 'Volume' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'speed', label: 'Speed' },
  { value: 'time', label: 'Time' },
  { value: 'energy', label: 'Energy' },
  { value: 'power', label: 'Power' },
  { value: 'pressure', label: 'Pressure' },
  { value: 'dataStorage', label: 'Data Storage' },
] as const;
