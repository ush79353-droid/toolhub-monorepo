import { VOLUME_UNIT_BY_ID, type VolumeUnitId } from '../volume-conversion/types';

export type { VolumeUnitId };

export const MAX_ABS_VALUE = 1e15;

/** Exact: 1 US tsp = US liquid gallon / 768. */
export const ML_PER_US_TSP = 4.92892159375;
/** Exact metric teaspoon. */
export const ML_PER_METRIC_TSP = 5;
/** Traditional Imperial teaspoon (imperial gallon / 768). */
export const ML_PER_IMPERIAL_TSP = 5.91938802083333;
/** Exact: 1 US tbsp = 3 US tsp. */
export const ML_PER_US_TBSP = 14.78676478125;

export type MlTspField = 'milliliters' | 'teaspoons';

export const FIELD_KEYS: readonly MlTspField[] = ['milliliters', 'teaspoons'];

export const FIELD_LABELS: Record<MlTspField, string> = {
  milliliters: 'Volume in milliliters (mL)',
  teaspoons: 'Volume in teaspoons (tsp)',
};

export const DEFAULT_UNITS: Record<MlTspField, VolumeUnitId> = {
  milliliters: 'mL',
  teaspoons: 'usTsp',
};

export const MILLILITER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'mL',
  'uL',
  'cL',
  'dL',
  'L',
  'cm3',
];

export const TEASPOON_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'usTsp',
  'metricTsp',
  'impTsp',
];

export function unitSymbol(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].symbol;
}

export function unitLabel(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].name;
}

export type MlToTspFieldErrors = Partial<Record<MlTspField, string>>;

export interface MlToTspResult {
  milliliters: number;
  units: Record<MlTspField, VolumeUnitId>;
  values: Record<MlTspField, number>;
}
