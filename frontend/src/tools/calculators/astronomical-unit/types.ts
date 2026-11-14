export type AuUnitId =
  | 'au'
  | 'ls'
  | 'lm'
  | 'lh'
  | 'ld'
  | 'ly'
  | 'pc'
  | 'mm'
  | 'cm'
  | 'm'
  | 'km'
  | 'Mm'
  | 'Gm'
  | 'in'
  | 'ft'
  | 'yd'
  | 'mi';

export type AuFieldId = 0 | 1 | 2 | 3 | 4 | 5;

export type AuUnitGroup = 'astro' | 'metric' | 'imperial';

export interface AuUnitDef {
  id: AuUnitId;
  label: string;
  symbol: string;
  factorToMeters: number;
  group: AuUnitGroup;
  /** Parsec uses π; never label as exact. */
  exact?: boolean;
}

/** Exact SI speed of light in vacuum (m/s). */
export const SPEED_OF_LIGHT_MPS = 299_792_458;
/** Julian year in seconds (365.25 × 86400). */
export const JULIAN_YEAR_SECONDS = 365.25 * 86_400;
/** 1 ly = c × Julian year. */
export const METERS_PER_LIGHT_YEAR = SPEED_OF_LIGHT_MPS * JULIAN_YEAR_SECONDS;
/** Exact IAU astronomical unit. */
export const METERS_PER_AU = 149_597_870_700;
/** 1 pc = (648000/π) au. */
export const METERS_PER_PARSEC = (648_000 / Math.PI) * METERS_PER_AU;
export const METERS_PER_LIGHT_SECOND = SPEED_OF_LIGHT_MPS;
export const METERS_PER_LIGHT_MINUTE = SPEED_OF_LIGHT_MPS * 60;
export const METERS_PER_LIGHT_HOUR = SPEED_OF_LIGHT_MPS * 3_600;
export const METERS_PER_LIGHT_DAY = SPEED_OF_LIGHT_MPS * 86_400;

export const AU_UNITS: readonly AuUnitDef[] = [
  {
    id: 'au',
    label: 'Astronomical units',
    symbol: 'au',
    factorToMeters: METERS_PER_AU,
    group: 'astro',
    exact: true,
  },
  {
    id: 'ls',
    label: 'Light-seconds',
    symbol: 'ls',
    factorToMeters: METERS_PER_LIGHT_SECOND,
    group: 'astro',
    exact: true,
  },
  {
    id: 'lm',
    label: 'Light-minutes',
    symbol: 'lm',
    factorToMeters: METERS_PER_LIGHT_MINUTE,
    group: 'astro',
    exact: true,
  },
  {
    id: 'lh',
    label: 'Light-hours',
    symbol: 'lh',
    factorToMeters: METERS_PER_LIGHT_HOUR,
    group: 'astro',
    exact: true,
  },
  {
    id: 'ld',
    label: 'Light-days',
    symbol: 'ld',
    factorToMeters: METERS_PER_LIGHT_DAY,
    group: 'astro',
    exact: true,
  },
  {
    id: 'ly',
    label: 'Light-years',
    symbol: 'ly',
    factorToMeters: METERS_PER_LIGHT_YEAR,
    group: 'astro',
    exact: true,
  },
  {
    id: 'pc',
    label: 'Parsecs',
    symbol: 'pc',
    factorToMeters: METERS_PER_PARSEC,
    group: 'astro',
    exact: false,
  },
  { id: 'mm', label: 'Millimeters', symbol: 'mm', factorToMeters: 0.001, group: 'metric', exact: true },
  { id: 'cm', label: 'Centimeters', symbol: 'cm', factorToMeters: 0.01, group: 'metric', exact: true },
  { id: 'm', label: 'Meters', symbol: 'm', factorToMeters: 1, group: 'metric', exact: true },
  { id: 'km', label: 'Kilometers', symbol: 'km', factorToMeters: 1000, group: 'metric', exact: true },
  { id: 'Mm', label: 'Megameters', symbol: 'Mm', factorToMeters: 1e6, group: 'metric', exact: true },
  { id: 'Gm', label: 'Gigameters', symbol: 'Gm', factorToMeters: 1e9, group: 'metric', exact: true },
  { id: 'in', label: 'Inches', symbol: 'in', factorToMeters: 0.0254, group: 'imperial', exact: true },
  { id: 'ft', label: 'Feet', symbol: 'ft', factorToMeters: 0.3048, group: 'imperial', exact: true },
  { id: 'yd', label: 'Yards', symbol: 'yd', factorToMeters: 0.9144, group: 'imperial', exact: true },
  { id: 'mi', label: 'Miles', symbol: 'mi', factorToMeters: 1609.344, group: 'imperial', exact: true },
];

export const AU_UNIT_BY_ID: Record<AuUnitId, AuUnitDef> = Object.fromEntries(
  AU_UNITS.map((u) => [u.id, u])
) as Record<AuUnitId, AuUnitDef>;

export const ASTRO_UNIT_IDS = ['au', 'ls', 'lm', 'lh', 'ld', 'ly', 'pc'] as const satisfies readonly AuUnitId[];
export const METRIC_UNIT_IDS = ['mm', 'cm', 'm', 'km', 'Mm', 'Gm'] as const satisfies readonly AuUnitId[];
export const IMPERIAL_UNIT_IDS = ['in', 'ft', 'yd', 'mi'] as const satisfies readonly AuUnitId[];

/** Defaults: au, m, km, ly, pc, mi. */
export const DEFAULT_FIELD_UNITS: readonly [
  AuUnitId,
  AuUnitId,
  AuUnitId,
  AuUnitId,
  AuUnitId,
  AuUnitId,
] = ['au', 'm', 'km', 'ly', 'pc', 'mi'];

export const FIELD_LABELS: Record<AuFieldId, string> = {
  0: 'Distance in astronomical units',
  1: 'Distance in meters',
  2: 'Distance in kilometers',
  3: 'Distance in light-years',
  4: 'Distance in parsecs',
  5: 'Distance in miles',
};

/** Demo default: 1 au. */
export const DEFAULT_METERS = METERS_PER_AU;

export const MAX_ABS_VALUE = 1e308;

export type AstronomicalUnitFieldErrors = Partial<Record<AuFieldId, string>>;

export interface AstronomicalUnitResult {
  meters: number;
  values: readonly [number, number, number, number, number, number];
  units: readonly [AuUnitId, AuUnitId, AuUnitId, AuUnitId, AuUnitId, AuUnitId];
  /** Vacuum light-travel time across the current distance (seconds). */
  lightTravelSeconds: number;
}
