import { VOLUME_UNIT_BY_ID, type VolumeUnitId } from '../volume-conversion/types';

export type { VolumeUnitId };

export const MAX_ABS_VALUE = 1e15;

/** Exact metric teaspoon (and US nutrition-label teaspoon). */
export const ML_PER_METRIC_TSP = 5;
/** Exact: 1 US tsp = US liquid gallon / 768. */
export const ML_PER_US_TSP = 4.92892159375;
/** Exact: 1 US tbsp = 3 US tsp. */
export const ML_PER_US_TBSP = 14.78676478125;
/** Exact metric tablespoon. */
export const ML_PER_METRIC_TBSP = 15;

export type TeaspoonStandard = 'metric' | 'us_customary' | 'us_nutrition';

export const TEASPOON_TO_ML: Record<TeaspoonStandard, number> = {
  metric: ML_PER_METRIC_TSP,
  us_customary: ML_PER_US_TSP,
  us_nutrition: ML_PER_METRIC_TSP,
};

export type TspMlField = 'teaspoons' | 'milliliters' | 'other';

export const FIELD_KEYS: readonly TspMlField[] = ['teaspoons', 'milliliters', 'other'];

export const FIELD_LABELS: Record<TspMlField, string> = {
  teaspoons: 'Teaspoons',
  milliliters: 'Milliliters',
  other: 'Other related units',
};

export const DEFAULT_UNITS: Record<TspMlField, VolumeUnitId> = {
  teaspoons: 'metricTsp',
  milliliters: 'mL',
  other: 'cm3',
};

export const TEASPOON_UNIT_OPTIONS: readonly VolumeUnitId[] = ['metricTsp', 'usTsp'];

export const MILLILITER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'mL',
  'uL',
  'cL',
  'dL',
  'L',
  'cm3',
];

export const OTHER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'cm3',
  'mL',
  'L',
  'usFlOz',
  'usCup',
  'usTbsp',
  'metricTbsp',
];

export function unitSymbol(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].symbol;
}

export function unitLabel(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].name;
}

export type TspToMlFieldErrors = Partial<Record<TspMlField, string>>;

export interface TspToMlResult {
  milliliters: number;
  units: Record<TspMlField, VolumeUnitId>;
  values: Record<TspMlField, number>;
}
