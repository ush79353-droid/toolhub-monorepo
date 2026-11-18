export type {
  LengthUnit,
  MeterFieldErrors as MmFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';

/** Primary millimeter field (Input section). */
export const MM_PRIMARY = ['mm'] as const satisfies readonly LengthUnit[];

/** Metric fields under the Metric accordion (excluding mm). */
export const METRIC_PRIMARY = ['cm', 'm', 'km'] as const satisfies readonly LengthUnit[];

/** Imperial/US fields. */
export const IMPERIAL_PRIMARY = ['in', 'ft', 'yd', 'mi'] as const satisfies readonly LengthUnit[];

/** Eight units synced on this calculator. */
export const MM_SYNC_UNITS = [
  'mm',
  'cm',
  'm',
  'km',
  'in',
  'ft',
  'yd',
  'mi',
] as const satisfies readonly LengthUnit[];

export type MmSyncUnit = (typeof MM_SYNC_UNITS)[number];

export const UNIT_LABELS: Record<MmSyncUnit, string> = {
  mm: 'Length in millimeters',
  cm: 'Length in centimeters',
  m: 'Length in meters',
  km: 'Length in kilometers',
  in: 'Length in inches',
  ft: 'Length in feet',
  yd: 'Length in yards',
  mi: 'Length in miles',
};
