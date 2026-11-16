/**
 * Length units for Meter Converter.
 * Internal canonical unit: meters.
 *
 * Note: Omni’s “kilotors” label is not a recognized SI/imperial length unit and
 * is omitted (no invented factor).
 */

export const LENGTH_UNITS = [
  'm',
  'km',
  'hm',
  'dam',
  'dm',
  'cm',
  'mm',
  'um',
  'nm',
  'pm',
  'in',
  'ft',
  'yd',
  'mi',
  'mil',
  'fur',
  'ch',
  'rd',
  'league',
  'nmi',
  'solarRadius',
  'ly',
  'au',
  'angstrom',
  'pc',
] as const;

export type LengthUnit = (typeof LENGTH_UNITS)[number];

export type MeterFieldErrors = Partial<Record<LengthUnit, string>>;

export const SPEED_OF_LIGHT_MPS = 299_792_458;
export const JULIAN_YEAR_SECONDS = 365.25 * 24 * 3600;
/** 1 ly = c × Julian year (IAU). */
export const METERS_PER_LIGHT_YEAR = SPEED_OF_LIGHT_MPS * JULIAN_YEAR_SECONDS;
/** Exact IAU astronomical unit. */
export const METERS_PER_AU = 149_597_870_700;
/** Geometric parsec = (648000/π) AU. */
export const METERS_PER_PARSEC = (648_000 / Math.PI) * METERS_PER_AU;
/** IAU nominal solar radius. */
export const METERS_PER_SOLAR_RADIUS = 695_700_000;
/** Exact international nautical mile. */
export const METERS_PER_NAUTICAL_MILE = 1852;
/** League = 3 statute miles. */
export const METERS_PER_LEAGUE = 3 * 1609.344;

/** Meters per one unit of measure. */
export const METERS_PER_UNIT: Record<LengthUnit, number> = {
  km: 1000,
  hm: 100,
  dam: 10,
  m: 1,
  dm: 0.1,
  cm: 0.01,
  mm: 0.001,
  um: 1e-6,
  nm: 1e-9,
  pm: 1e-12,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
  mil: 0.0000254,
  fur: 201.168,
  ch: 20.1168,
  rd: 5.0292,
  league: METERS_PER_LEAGUE,
  nmi: METERS_PER_NAUTICAL_MILE,
  solarRadius: METERS_PER_SOLAR_RADIUS,
  ly: METERS_PER_LIGHT_YEAR,
  au: METERS_PER_AU,
  angstrom: 1e-10,
  pc: METERS_PER_PARSEC,
};

export const UNIT_SYMBOLS: Record<LengthUnit, string> = {
  km: 'km',
  hm: 'hm',
  dam: 'dam',
  m: 'm',
  dm: 'dm',
  cm: 'cm',
  mm: 'mm',
  um: 'µm',
  nm: 'nm',
  pm: 'pm',
  in: 'in',
  ft: 'ft',
  yd: 'yd',
  mi: 'mi',
  mil: 'mil',
  fur: 'fur',
  ch: 'ch',
  rd: 'rd',
  league: 'league',
  nmi: 'nmi',
  solarRadius: 'R☉',
  ly: 'ly',
  au: 'AU',
  angstrom: 'Å',
  pc: 'pc',
};

export const UNIT_LABELS: Record<LengthUnit, string> = {
  km: 'Length in kilometers',
  hm: 'Length in hectometers',
  dam: 'Length in decameters',
  m: 'Length in meters',
  dm: 'Length in decimeters',
  cm: 'Length in centimeters',
  mm: 'Length in millimeters',
  um: 'Length in micrometers',
  nm: 'Length in nanometers',
  pm: 'Length in picometers',
  in: 'Length in inches',
  ft: 'Length in feet',
  yd: 'Length in yards',
  mi: 'Length in miles (statute)',
  mil: 'Length in thou / mil',
  fur: 'Length in furlongs',
  ch: 'Length in chains',
  rd: 'Length in rods',
  league: 'Length in leagues (3 mi)',
  nmi: 'Length in nautical miles',
  solarRadius: 'Length in solar radii',
  ly: 'Length in light-years',
  au: 'Length in astronomical units',
  angstrom: 'Length in ångströms',
  pc: 'Length in parsecs',
};

export const METRIC_PRIMARY: readonly LengthUnit[] = ['km', 'mm', 'cm'];
export const METRIC_OTHER: readonly LengthUnit[] = ['hm', 'dam', 'dm', 'um', 'nm', 'pm'];
export const IMPERIAL_PRIMARY: readonly LengthUnit[] = ['in', 'ft', 'yd', 'mi'];
export const IMPERIAL_OTHER: readonly LengthUnit[] = ['mil', 'fur', 'ch', 'rd', 'league'];
export const OTHER_PRIMARY: readonly LengthUnit[] = ['nmi', 'solarRadius', 'ly'];
export const OTHER_EXTRA: readonly LengthUnit[] = ['au', 'angstrom', 'pc'];

export const MAX_ABS_VALUE = 1e30;

export const DEFAULT_METRIC_EXTRA: LengthUnit = 'um';
export const DEFAULT_IMPERIAL_EXTRA: LengthUnit = 'mil';
export const DEFAULT_OTHER_EXTRA: LengthUnit = 'au';
