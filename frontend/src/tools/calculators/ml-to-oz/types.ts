import { VOLUME_UNIT_BY_ID, type VolumeUnitId } from '../volume-conversion/types';

export type { VolumeUnitId };

export const MAX_ABS_VALUE = 1e15;

/** Exact: 1 US fl oz = 29.5735295625 mL. */
export const ML_PER_US_FL_OZ = 29.5735295625;
/** Exact: 1 UK fl oz = 28.4130625 mL. */
export const ML_PER_UK_FL_OZ = 28.4130625;

export type MlOzField = 'milliliters' | 'ounces' | 'other';

export const FIELD_KEYS: readonly MlOzField[] = ['milliliters', 'ounces', 'other'];

export const FIELD_LABELS: Record<MlOzField, string> = {
  milliliters: 'Volume in milliliters',
  ounces: 'Volume in ounces',
  other: 'Other volume units',
};

export const DEFAULT_UNITS: Record<MlOzField, VolumeUnitId> = {
  milliliters: 'mL',
  ounces: 'usFlOz',
  other: 'm3',
};

/** Metric-oriented choices for the first field. */
export const MILLILITER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'mL',
  'uL',
  'cL',
  'dL',
  'L',
  'cm3',
];

/** Fluid-ounce systems only — never mass ounces. */
export const OUNCE_UNIT_OPTIONS: readonly VolumeUnitId[] = ['usFlOz', 'impFlOz'];

/** Third synchronized field — related volume units. */
export const OTHER_UNIT_OPTIONS: readonly VolumeUnitId[] = [
  'm3',
  'L',
  'cm3',
  'dm3',
  'usCup',
  'usPt',
  'usQt',
  'usLiquidGal',
  'imperialGal',
  'usFlOz',
  'impFlOz',
  'in3',
  'ft3',
];

export function unitSymbol(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].symbol;
}

export function unitLabel(unit: VolumeUnitId): string {
  return VOLUME_UNIT_BY_ID[unit].name;
}

export type MlToOzFieldErrors = Partial<Record<MlOzField, string>>;

export interface MlToOzResult {
  milliliters: number;
  units: Record<MlOzField, VolumeUnitId>;
  values: Record<MlOzField, number>;
}
