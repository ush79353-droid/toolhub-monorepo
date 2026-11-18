import { VOLUME_UNIT_BY_ID, type VolumeUnitId } from '../volume-conversion/types';

export type { VolumeUnitId };

export const MAX_ABS_VALUE = 1e15;

/** Exact: 1 US tbsp = US liquid gallon / 256. */
export const ML_PER_US_TBSP = 14.78676478125;
/** Exact metric tablespoon. */
export const ML_PER_METRIC_TBSP = 15;
/** Exact Australian tablespoon. */
export const ML_PER_AU_TBSP = 20;
/** Traditional Imperial tablespoon (imperial gallon / 256). */
export const ML_PER_IMPERIAL_TBSP = 17.7581640625;
/** Exact: 1 US cup = 16 US tbsp. */
export const ML_PER_US_CUP = 236.5882365;
/** Exact metric cup. */
export const ML_PER_METRIC_CUP = 250;
/** Exact: 1 US tsp = US liquid gallon / 768. */
export const ML_PER_US_TSP = 4.92892159375;

export type MlTbspField = 'milliliters' | 'tablespoons' | 'other';

export const FIELD_KEYS: readonly MlTbspField[] = ['milliliters', 'tablespoons', 'other'];

export const FIELD_LABELS: Record<MlTbspField, string> = {
  milliliters: 'Milliliters',
  tablespoons: 'Tablespoons',
  other: 'Other units',
};

export const DEFAULT_UNITS: Record<MlTbspField, VolumeUnitId> = {
  milliliters: 'mL',
  tablespoons: 'usTbsp',
  other: 'usCup',
};

export const MILLILITER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'mL',
  'uL',
  'cL',
  'dL',
  'L',
  'cm3',
];

export const TABLESPOON_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'usTbsp',
  'metricTbsp',
  'auTbsp',
  'impTbsp',
];

export const OTHER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'usCup',
  'metricCup',
  'usLegalCup',
  'imperialCup',
  'usTsp',
  'metricTsp',
  'usFlOz',
  'impFlOz',
  'usPt',
  'usQt',
  'usLiquidGal',
  'imperialGal',
  'L',
  'cm3',
];

export function unitSymbol(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].symbol;
}

export function unitLabel(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].name;
}

export type MlToTbspFieldErrors = Partial<Record<MlTbspField, string>>;

export interface MlToTbspResult {
  milliliters: number;
  units: Record<MlTbspField, VolumeUnitId>;
  values: Record<MlTbspField, number>;
}
