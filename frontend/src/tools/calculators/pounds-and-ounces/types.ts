/** Active field in the equivalences section. */
export type EquivSource = 'pounds' | 'ounces' | 'mixed' | 'metric' | 'stones';

export type MetricUnit = 'mg' | 'g' | 'kg' | 't';

export interface EquivalenceInput {
  source: EquivSource;
  pounds: number | null;
  ounces: number | null;
  mixedPounds: number | null;
  mixedOunces: number | null;
  metric: number | null;
  metricUnit: MetricUnit;
  stones: number | null;
}

export interface AddRowInput {
  id: string;
  pounds: number | null;
  ounces: number | null;
}

export interface AdditionInput {
  rows: readonly AddRowInput[];
}

export interface MixedWeight {
  pounds: number;
  ounces: number;
}

export interface EquivalenceResult {
  source: EquivSource;
  totalOunces: number;
  decimalPounds: number;
  totalOuncesDisplay: number;
  mixed: MixedWeight;
  grams: number;
  metric: number;
  metricUnit: MetricUnit;
  stones: number;
  otherMetric: readonly { unit: string; label: string; value: number }[];
  otherImperial: readonly { unit: string; label: string; value: number }[];
}

export interface AdditionResult {
  totalOunces: number;
  mixed: MixedWeight;
  decimalPounds: number;
  rowCount: number;
}

export type EquivalenceFieldErrors = {
  pounds?: string;
  ounces?: string;
  mixedPounds?: string;
  mixedOunces?: string;
  metric?: string;
  stones?: string;
};

export type AdditionFieldErrors = {
  /** Keyed as `${rowId}:pounds` or `${rowId}:ounces`. */
  [key: string]: string | undefined;
};

/** Exact: 1 lb = 16 avoirdupois oz. */
export const OUNCES_PER_POUND = 16;
/** Exact: 1 lb = 453.59237 g. */
export const GRAMS_PER_POUND = 453.59237;
/** Exact: 1 oz = 28.349523125 g. */
export const GRAMS_PER_OUNCE = GRAMS_PER_POUND / OUNCES_PER_POUND;
/** Exact: 1 stone = 14 lb. */
export const POUNDS_PER_STONE = 14;
/** Exact: 1 stone = 224 oz. */
export const OUNCES_PER_STONE = POUNDS_PER_STONE * OUNCES_PER_POUND;

export const GRAMS_PER_METRIC_UNIT: Record<MetricUnit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  t: 1_000_000,
};

export const METRIC_UNIT_OPTIONS: readonly { value: MetricUnit; label: string }[] = [
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 't', label: 't' },
] as const;

export const MAX_ABS_VALUE = 1e15;

/** Demo: 2.5 lb = 40 oz = 2 lb 8 oz. */
export const DEFAULT_EQUIVALENCE_INPUT: EquivalenceInput = {
  source: 'pounds',
  pounds: 2.5,
  ounces: null,
  mixedPounds: null,
  mixedOunces: null,
  metric: null,
  metricUnit: 'g',
  stones: null,
};

export const EMPTY_EQUIVALENCE_INPUT: EquivalenceInput = {
  source: 'pounds',
  pounds: null,
  ounces: null,
  mixedPounds: null,
  mixedOunces: null,
  metric: null,
  metricUnit: 'g',
  stones: null,
};

export function createAddRow(id: string): AddRowInput {
  return { id, pounds: null, ounces: null };
}

/** Demo: 2 lb 10 oz + 3 lb 9 oz = 6 lb 3 oz. */
export const DEFAULT_ADDITION_INPUT: AdditionInput = {
  rows: [
    { id: 'row-1', pounds: 2, ounces: 10 },
    { id: 'row-2', pounds: 3, ounces: 9 },
  ],
};

export const EMPTY_ADDITION_INPUT: AdditionInput = {
  rows: [createAddRow('row-1'), createAddRow('row-2')],
};
