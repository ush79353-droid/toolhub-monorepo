export type ConversionField = 'source' | 'dest';

export type ConversionFieldErrors = Partial<Record<ConversionField, string>>;

export const CATEGORY_IDS = [
  'length',
  'area',
  'volume',
  'mass',
  'temperature',
  'time',
  'speed',
  'pressure',
  'energy',
  'power',
  'force',
  'torque',
  'angle',
  'frequency',
  'dataStorage',
  'dataTransfer',
  'density',
  'acceleration',
  'fuelEconomy',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const DEFAULT_CATEGORY: CategoryId = 'length';
export const DEFAULT_SOURCE_UNIT = 'm';
export const DEFAULT_DEST_UNIT = 'cm';
export const DEFAULT_SOURCE_VALUE = 1;
export const MAX_ABS_VALUE = 1e24;

export type UnitKind = 'linear' | 'temperature' | 'fuel';

export interface UnitDefinition {
  id: string;
  label: string;
  symbol: string;
  kind: UnitKind;
  /**
   * Linear: multiply value by this to reach the category base.
   * Temperature / fuel: unused (handled in calculation).
   */
  toBase?: number;
}

export interface ConversionCategory {
  id: CategoryId;
  label: string;
  kind: UnitKind;
  /** Human label for the internal base (docs / debugging). */
  baseLabel: string;
  units: readonly UnitDefinition[];
  defaultSourceUnit: string;
  defaultDestUnit: string;
  /** Short note shown under the category selector when relevant. */
  note?: string;
}
