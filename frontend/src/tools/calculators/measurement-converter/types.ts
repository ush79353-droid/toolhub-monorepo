export type Dimension =
  | 'length'
  | 'mass'
  | 'time'
  | 'area'
  | 'volume'
  | 'speed'
  | 'acceleration'
  | 'force'
  | 'pressure'
  | 'energy'
  | 'power'
  | 'temperature'
  | 'density'
  | 'frequency'
  | 'angle';

export type UnitKind = 'linear' | 'temperature';

export type PrecisionMode = 'auto' | '2' | '3' | '4' | '6' | '10';

export type ActiveField = 'input' | 'output';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  dimension: Dimension;
  kind: UnitKind;
  /** Multiply by this to reach the category SI base (linear only). */
  factorToBase?: number;
}

export interface DimensionCategory {
  id: Dimension;
  label: string;
  symbol: string;
  kind: UnitKind;
  baseLabel: string;
  defaultFrom: string;
  defaultTo: string;
  units: readonly UnitDefinition[];
  note?: string;
}

export interface MeasurementInput {
  dimension: Dimension;
  fromUnit: string;
  toUnit: string;
  /** Canonical numeric value in the active field's unit. */
  value: number | null;
  activeField: ActiveField;
  precision: PrecisionMode;
}

export interface MeasurementResult {
  dimension: Dimension;
  fromUnit: string;
  toUnit: string;
  inputValue: number;
  outputValue: number;
  /** How many of `to` equal 1 of `from`. */
  factorFromToOne: number;
  /** How many of `from` equal 1 of `to`. */
  factorToFromOne: number;
  formattedInput: string;
  formattedOutput: string;
  explanation: string;
}

export type MeasurementFieldErrors = {
  value?: string;
  fromUnit?: string;
  toUnit?: string;
};

export const DIMENSION_IDS: readonly Dimension[] = [
  'length',
  'mass',
  'time',
  'area',
  'volume',
  'speed',
  'acceleration',
  'force',
  'pressure',
  'energy',
  'power',
  'temperature',
  'density',
  'frequency',
  'angle',
] as const;

export const PRECISION_OPTIONS: readonly { value: PrecisionMode; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: '2', label: '2 significant figures' },
  { value: '3', label: '3 significant figures' },
  { value: '4', label: '4 significant figures' },
  { value: '6', label: '6 significant figures' },
  { value: '10', label: '10 significant figures' },
] as const;

export const MAX_ABS_VALUE = 1e24;

export const DEFAULT_MEASUREMENT_INPUT: MeasurementInput = {
  dimension: 'length',
  fromUnit: 'm',
  toUnit: 'km',
  value: null,
  activeField: 'input',
  precision: 'auto',
};
