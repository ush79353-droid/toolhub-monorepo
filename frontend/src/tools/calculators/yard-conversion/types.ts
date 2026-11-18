export type {
  LengthUnit,
  MeterFieldErrors as YardFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';
import { UNIT_LABELS as BASE_LABELS, METERS_PER_UNIT } from '../meter-converter/types';

/** Exact international yard. */
export const METERS_PER_YARD = METERS_PER_UNIT.yd;
export const FEET_PER_YARD = 3;
export const INCHES_PER_YARD = 36;
export const YARDS_PER_MILE = 1760;
export const INCHES_PER_FOOT = 12;

export const METRIC_CORE = ['mm', 'cm', 'm'] as const satisfies readonly LengthUnit[];
/** Other metric selector options (default km). */
export const METRIC_OTHER = ['nm', 'um', 'mm', 'cm', 'dm', 'm', 'km'] as const satisfies readonly LengthUnit[];

export const IMPERIAL_CORE = ['in', 'ft', 'mi'] as const satisfies readonly LengthUnit[];
/** Extra imperial units besides the ft/in composite. */
export const IMPERIAL_OTHER_UNITS = ['mil', 'fur', 'ch', 'rd'] as const satisfies readonly LengthUnit[];

export type MetricOtherUnit = (typeof METRIC_OTHER)[number];
export type ImperialOtherUnit = (typeof IMPERIAL_OTHER_UNITS)[number];
/** ftIn = combined feet + inches representation. */
export type ImperialOtherMode = 'ftIn' | ImperialOtherUnit;

export const DEFAULT_METRIC_OTHER: MetricOtherUnit = 'km';
export const DEFAULT_IMPERIAL_OTHER: ImperialOtherMode = 'ftIn';

export type YardActiveField = LengthUnit | 'ftIn';

export const UNIT_LABELS: Record<LengthUnit, string> = {
  ...BASE_LABELS,
  yd: 'Yards',
  in: 'Inches',
  ft: 'Feet',
  mi: 'Miles',
  mm: 'Millimeters',
  cm: 'Centimeters',
  m: 'Meters',
  km: 'Kilometers',
  nm: 'Nanometers',
  um: 'Micrometers',
  dm: 'Decimeters',
  mil: 'Mils (thou)',
  fur: 'Furlongs',
  ch: 'Chains',
  rd: 'Rods',
};
