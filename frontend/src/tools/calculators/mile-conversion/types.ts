export type {
  LengthUnit,
  MeterFieldErrors as MileFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_AU,
  METERS_PER_LIGHT_YEAR,
  METERS_PER_NAUTICAL_MILE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';
import { UNIT_LABELS as BASE_LABELS, METERS_PER_UNIT } from '../meter-converter/types';

/** Exact international statute mile. */
export const METERS_PER_MILE = METERS_PER_UNIT.mi;
export const KM_PER_MILE = 1.609344;
export const FEET_PER_MILE = 5280;
export const YARDS_PER_MILE = 1760;
export const INCHES_PER_MILE = 63360;

export const METRIC_CORE = ['km', 'm', 'cm'] as const satisfies readonly LengthUnit[];
export const METRIC_OTHER = ['mm', 'um', 'nm'] as const satisfies readonly LengthUnit[];

export const IMPERIAL_CORE = ['yd', 'ft'] as const satisfies readonly LengthUnit[];
/** Exclude mi — already the primary field. */
export const IMPERIAL_OTHER = ['in', 'fur', 'ch', 'rd'] as const satisfies readonly LengthUnit[];

export const OTHER_CORE = ['ly', 'au', 'nmi'] as const satisfies readonly LengthUnit[];
export const OTHER_EXTRA = ['pc', 'solarRadius', 'angstrom'] as const satisfies readonly LengthUnit[];

export type MetricOtherUnit = (typeof METRIC_OTHER)[number];
export type ImperialOtherUnit = (typeof IMPERIAL_OTHER)[number];
export type OtherExtraUnit = (typeof OTHER_EXTRA)[number];

export const DEFAULT_METRIC_OTHER: MetricOtherUnit = 'mm';
export const DEFAULT_IMPERIAL_OTHER: ImperialOtherUnit = 'in';
export const DEFAULT_OTHER_EXTRA: OtherExtraUnit = 'pc';

export const UNIT_LABELS: Record<LengthUnit, string> = {
  ...BASE_LABELS,
  mi: 'Miles',
  km: 'Kilometers',
  m: 'Meters',
  cm: 'Centimeters',
  mm: 'Millimeters',
  um: 'Micrometers',
  nm: 'Nanometers',
  yd: 'Yards',
  ft: 'Feet',
  in: 'Inches',
  fur: 'Furlongs',
  ch: 'Chains',
  rd: 'Rods',
  ly: 'Light years',
  au: 'Astronomical units',
  nmi: 'Nautical miles',
  pc: 'Parsecs',
  solarRadius: 'Sun radii',
  angstrom: 'Ångströms',
};
