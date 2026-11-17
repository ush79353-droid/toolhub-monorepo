export type {
  LengthUnit,
  MeterFieldErrors as MillimeterFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';
import { UNIT_LABELS as BASE_LABELS, METERS_PER_UNIT } from '../meter-converter/types';

/** Exact SI millimeter. */
export const METERS_PER_MM = METERS_PER_UNIT.mm;
export const MM_PER_INCH = 25.4;
export const MM_PER_FOOT = 304.8;
export const MM_PER_YARD = 914.4;
export const MM_PER_MILE = 1_609_344;
export const MM_PER_CM = 10;
export const MM_PER_M = 1000;

export const IMPERIAL_CORE = ['in', 'ft', 'mi'] as const satisfies readonly LengthUnit[];
export const IMPERIAL_OTHER = ['yd', 'fur', 'ch', 'rd'] as const satisfies readonly LengthUnit[];

export const METRIC_CORE = ['cm', 'm', 'km'] as const satisfies readonly LengthUnit[];
/** Exclude mm — already the primary field. */
export const METRIC_OTHER = ['um', 'nm', 'dm', 'dam', 'hm'] as const satisfies readonly LengthUnit[];

export type ImperialOtherUnit = (typeof IMPERIAL_OTHER)[number];
export type MetricOtherUnit = (typeof METRIC_OTHER)[number];

export const DEFAULT_IMPERIAL_OTHER: ImperialOtherUnit = 'yd';
export const DEFAULT_METRIC_OTHER: MetricOtherUnit = 'um';

export const UNIT_LABELS: Record<LengthUnit, string> = {
  ...BASE_LABELS,
  mm: 'Millimeters',
  in: 'Inches',
  ft: 'Feet',
  mi: 'Miles',
  yd: 'Yards',
  fur: 'Furlongs',
  ch: 'Chains',
  rd: 'Rods',
  cm: 'Centimeters',
  m: 'Meters',
  km: 'Kilometers',
  um: 'Micrometers',
  nm: 'Nanometers',
  dm: 'Decimeters',
  dam: 'Decameters',
  hm: 'Hectometers',
};
