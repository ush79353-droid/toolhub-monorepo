import type { LengthUnit } from '../meter-converter/types';

export type {
  LengthUnit,
  MeterFieldErrors as DmFieldErrors,
} from '../meter-converter/types';

export {
  DEFAULT_OTHER_EXTRA,
  LENGTH_UNITS,
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  OTHER_EXTRA,
  OTHER_PRIMARY,
  UNIT_LABELS,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

/** Primary metric fields under the Metric accordion (dm is the top-level field). */
export const METRIC_PRIMARY = ['mm', 'cm', 'm', 'km'] as const satisfies readonly LengthUnit[];

/** Extra metric choices for the “Other metric units” dropdown (default hm). */
export const METRIC_OTHER = ['hm', 'dam', 'um', 'nm', 'pm'] as const satisfies readonly LengthUnit[];

export const DEFAULT_METRIC_EXTRA: LengthUnit = 'hm';

/** Primary imperial fields; miles live in the other-imperial dropdown. */
export const IMPERIAL_PRIMARY = ['in', 'ft', 'yd'] as const satisfies readonly LengthUnit[];

export const IMPERIAL_OTHER = [
  'mi',
  'mil',
  'fur',
  'ch',
  'rd',
  'league',
] as const satisfies readonly LengthUnit[];

export const DEFAULT_IMPERIAL_EXTRA: LengthUnit = 'mi';

/** Short field titles matching the dm converter screenshot (not “Length in …”). */
export const FIELD_LABELS: Record<LengthUnit, string> = {
  km: 'Kilometers',
  hm: 'Hectometers',
  dam: 'Decameters',
  m: 'Meters',
  dm: 'Decimeters',
  cm: 'Centimeters',
  mm: 'Millimeters',
  um: 'Micrometers',
  nm: 'Nanometers',
  pm: 'Picometers',
  in: 'Inches',
  ft: 'Feet',
  yd: 'Yards',
  mi: 'Miles',
  mil: 'Thou / mil',
  fur: 'Furlongs',
  ch: 'Chains',
  rd: 'Rods',
  league: 'Leagues',
  nmi: 'Nautical miles',
  solarRadius: 'Sun radii',
  ly: 'Light-years',
  au: 'Astronomical units',
  angstrom: 'Ångströms',
  pc: 'Parsecs',
};
