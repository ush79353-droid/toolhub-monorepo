export type {
  LengthUnit,
  MeterFieldErrors as FeetFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  OTHER_PRIMARY,
  UNIT_LABELS,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';

/** Metric fields under the Metric accordion (ft is the top-level field). */
export const METRIC_PRIMARY = ['mm', 'cm', 'm', 'km'] as const satisfies readonly LengthUnit[];

/** Imperial/US fields excluding feet (primary). */
export const IMPERIAL_PRIMARY = ['in', 'yd', 'mi'] as const satisfies readonly LengthUnit[];

/** Units shown under Convert Feet / Metric / Imperial / Others for sync. */
export const FEET_SYNC_UNITS = [
  'ft',
  'mm',
  'cm',
  'm',
  'km',
  'in',
  'yd',
  'mi',
  'nmi',
  'solarRadius',
  'ly',
] as const satisfies readonly LengthUnit[];
