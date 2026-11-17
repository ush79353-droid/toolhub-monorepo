export type {
  LengthUnit,
  MeterFieldErrors as MilFieldErrors,
} from '../meter-converter/types';

export {
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_SOLAR_RADIUS,
  METERS_PER_UNIT,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

import type { LengthUnit } from '../meter-converter/types';
import { UNIT_LABELS as BASE_LABELS, METERS_PER_UNIT } from '../meter-converter/types';

/** Exact: 1 mil = 0.001 in = 0.0000254 m. */
export const METERS_PER_MIL = METERS_PER_UNIT.mil;
export const MICRONS_PER_MIL = 25.4;
export const MILS_PER_INCH = 1000;

export const METRIC_CORE = ['um', 'mm', 'cm'] as const satisfies readonly LengthUnit[];
export const METRIC_OTHER = ['nm', 'm', 'km', 'dm', 'pm'] as const satisfies readonly LengthUnit[];

export const IMPERIAL_CORE = ['in', 'ft'] as const satisfies readonly LengthUnit[];
/** Exclude mil/thou — already the primary field. */
export const IMPERIAL_OTHER = ['yd', 'mi'] as const satisfies readonly LengthUnit[];

export const OTHER_CORE = ['nmi', 'solarRadius'] as const satisfies readonly LengthUnit[];
export const OTHER_EXTRA = ['angstrom', 'ly', 'au'] as const satisfies readonly LengthUnit[];

export type MetricOtherUnit = (typeof METRIC_OTHER)[number];
export type ImperialOtherUnit = (typeof IMPERIAL_OTHER)[number];
export type OtherExtraUnit = (typeof OTHER_EXTRA)[number];

export const DEFAULT_METRIC_OTHER: MetricOtherUnit = 'nm';
export const DEFAULT_IMPERIAL_OTHER: ImperialOtherUnit = 'yd';
export const DEFAULT_OTHER_EXTRA: OtherExtraUnit = 'angstrom';

export const UNIT_LABELS: Record<LengthUnit, string> = {
  ...BASE_LABELS,
  mil: 'Mils',
  um: 'Microns (micrometers)',
  mm: 'Millimeters',
  cm: 'Centimeters',
  nm: 'Nanometers',
  m: 'Meters',
  km: 'Kilometers',
  in: 'Inches',
  ft: 'Feet',
  yd: 'Yards',
  mi: 'Miles',
  nmi: 'Nautical miles',
  solarRadius: 'Sun radii',
  angstrom: 'Ångströms',
  ly: 'Light-years',
  au: 'Astronomical units',
};
