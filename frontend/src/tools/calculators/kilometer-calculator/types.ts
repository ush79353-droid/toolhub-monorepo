export type {
  LengthUnit,
  MeterFieldErrors as KilometerFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';

/** Primary kilometer field. */
export const KM_PRIMARY = ['km'] as const satisfies readonly LengthUnit[];

/** Metric fields under the Metric accordion (excluding km). */
export const METRIC_PRIMARY = ['mm', 'cm', 'm'] as const satisfies readonly LengthUnit[];

/** Imperial/US fields. */
export const IMPERIAL_PRIMARY = ['in', 'ft', 'yd', 'mi'] as const satisfies readonly LengthUnit[];

/** Eight units synced on this calculator. */
export const KM_SYNC_UNITS = [
  'km',
  'mm',
  'cm',
  'm',
  'in',
  'ft',
  'yd',
  'mi',
] as const satisfies readonly LengthUnit[];

export type KmSyncUnit = (typeof KM_SYNC_UNITS)[number];

export const UNIT_LABELS: Record<KmSyncUnit, string> = {
  km: 'Kilometers',
  mm: 'Millimeters',
  cm: 'Centimeters',
  m: 'Meters',
  in: 'Inches',
  ft: 'Feet',
  yd: 'Yards',
  mi: 'Miles',
};
