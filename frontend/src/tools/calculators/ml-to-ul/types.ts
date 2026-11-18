import { VOLUME_UNIT_BY_ID, type VolumeUnitId } from '../volume-conversion/types';

export type { VolumeUnitId };

export const MAX_ABS_VALUE = 1e15;

/** Exact: 1 mL = 1000 µL. */
export const UL_PER_ML = 1000;

export type MlUlField = 'milliliters' | 'microliters' | 'other';

export const FIELD_KEYS: readonly MlUlField[] = ['milliliters', 'microliters', 'other'];

export const FIELD_LABELS: Record<MlUlField, string> = {
  milliliters: 'Volume in milliliters (mL)',
  microliters: 'Volume in microliters (µL)',
  other: 'Volume in other units',
};

export const DEFAULT_UNITS: Record<MlUlField, VolumeUnitId> = {
  milliliters: 'mL',
  microliters: 'uL',
  other: 'L',
};

export const OTHER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'L',
  'cL',
  'dL',
  'cm3',
  'dm3',
  'm3',
  'usFlOz',
  'usTsp',
  'usTbsp',
  'metricTsp',
  'metricTbsp',
];

export function unitSymbol(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].symbol;
}

export function unitLabel(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].name;
}

export type MlToUlFieldErrors = Partial<Record<MlUlField, string>>;

export interface MlToUlResult {
  milliliters: number;
  units: Record<MlUlField, VolumeUnitId>;
  values: Record<MlUlField, number>;
}
