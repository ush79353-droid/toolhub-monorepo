import { VOLUME_UNIT_BY_ID, type VolumeUnitId } from '../volume-conversion/types';

export type { VolumeUnitId };

export const MAX_ABS_VALUE = 1e15;

/** Exact: 1 US tbsp = US liquid gallon / 256. */
export const ML_PER_US_TBSP = 14.78676478125;
/** Exact metric tablespoon. */
export const ML_PER_METRIC_TBSP = 15;
/** Exact Australian tablespoon. */
export const ML_PER_AU_TBSP = 20;
/** Exact: 1 US tsp = US liquid gallon / 768. */
export const ML_PER_US_TSP = 4.92892159375;
/** Exact metric teaspoon. */
export const ML_PER_METRIC_TSP = 5;
/** Exact: 1 US fluid ounce = US liquid gallon / 128. */
export const ML_PER_US_FL_OZ = 29.5735295625;
/** Exact: 1 US cup = 16 US tbsp. */
export const ML_PER_US_CUP = 236.5882365;
/** Exact: 1 US liquid pint. */
export const ML_PER_US_PINT = 473.176473;
/** Exact: 1 L = 1000 mL. */
export const ML_PER_LITER = 1000;

export type TablespoonStandard = 'us' | 'metric' | 'australian';

export const TABLESPOON_TO_ML: Record<TablespoonStandard, number> = {
  us: ML_PER_US_TBSP,
  metric: ML_PER_METRIC_TBSP,
  australian: ML_PER_AU_TBSP,
};

export type TbspMlField = 'tablespoons' | 'milliliters' | 'other';

export const FIELD_KEYS: readonly TbspMlField[] = ['tablespoons', 'milliliters', 'other'];

export const FIELD_LABELS: Record<TbspMlField, string> = {
  tablespoons: 'Tablespoons',
  milliliters: 'Milliliters',
  other: 'More relevant units',
};

export const DEFAULT_UNITS: Record<TbspMlField, VolumeUnitId> = {
  tablespoons: 'usTbsp',
  milliliters: 'mL',
  other: 'usTsp',
};

export const TABLESPOON_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'usTbsp',
  'metricTbsp',
  'auTbsp',
];

export const MILLILITER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'mL',
  'uL',
  'cL',
  'dL',
  'L',
  'cm3',
];

export const OTHER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'usTsp',
  'metricTsp',
  'usFlOz',
  'usCup',
  'usPt',
  'L',
];

export function unitSymbol(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].symbol;
}

export function unitLabel(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].name;
}

export type TbspToMlFieldErrors = Partial<Record<TbspMlField, string>>;

export interface TbspToMlResult {
  milliliters: number;
  units: Record<TbspMlField, VolumeUnitId>;
  values: Record<TbspMlField, number>;
}
