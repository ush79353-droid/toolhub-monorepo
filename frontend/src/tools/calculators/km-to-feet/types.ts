export type {
  LengthUnit,
  MeterFieldErrors as KmToFeetFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';

/** Primary pair. */
export const PRIMARY_UNITS = ['km', 'ft'] as const satisfies readonly LengthUnit[];

/** Other length units under the accordion. */
export const OTHER_UNITS = ['mm', 'cm', 'm', 'in', 'yd', 'mi'] as const satisfies readonly LengthUnit[];

/** All synced units on this calculator. */
export const KM_FT_SYNC_UNITS = [
  'km',
  'ft',
  'mm',
  'cm',
  'm',
  'in',
  'yd',
  'mi',
] as const satisfies readonly LengthUnit[];

export type KmFtSyncUnit = (typeof KM_FT_SYNC_UNITS)[number];

/** Exact: 1 foot = 0.3048 m. */
export const METERS_PER_FOOT = 0.3048;

/** Exact: feet per kilometer = 1000 / 0.3048. */
export const FEET_PER_KM = 1000 / METERS_PER_FOOT;

export const UNIT_LABELS: Record<KmFtSyncUnit, string> = {
  km: 'Kilometers (metric)',
  ft: 'Feet (imperial)',
  mm: 'Millimeters',
  cm: 'Centimeters',
  m: 'Meters',
  in: 'Inches',
  yd: 'Yards',
  mi: 'Miles',
};
