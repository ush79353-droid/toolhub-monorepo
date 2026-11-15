export type LightYearUnitId =
  | 'ly'
  | 'mm'
  | 'cm'
  | 'm'
  | 'km'
  | 'in'
  | 'ft'
  | 'yd'
  | 'mi'
  | 'au'
  | 'pc';

export type LightYearFieldId = 0 | 1 | 2 | 3;

export type LightYearUnitGroup = 'ly' | 'metric' | 'imperial' | 'astro';

export interface LightYearUnitDef {
  id: LightYearUnitId;
  label: string;
  symbol: string;
  factorToMeters: number;
  group: LightYearUnitGroup;
  /** Parsec uses π; never label the meter factor as exact. */
  exact?: boolean;
}

/** Exact SI speed of light in vacuum (m/s). */
export const SPEED_OF_LIGHT_MPS = 299_792_458;
/** Julian year in seconds (365.25 × 86400). */
export const JULIAN_YEAR_SECONDS = 365.25 * 86_400;
/** 1 ly = c × Julian year = 9_460_730_472_580_800 m (by definition). */
export const METERS_PER_LIGHT_YEAR = SPEED_OF_LIGHT_MPS * JULIAN_YEAR_SECONDS;
/** Exact IAU astronomical unit. */
export const METERS_PER_AU = 149_597_870_700;
/** 1 pc = (648000/π) AU — approximate in meters because of π. */
export const METERS_PER_PARSEC = (648_000 / Math.PI) * METERS_PER_AU;

export const LIGHT_YEAR_UNITS: readonly LightYearUnitDef[] = [
  {
    id: 'ly',
    label: 'Light-years',
    symbol: 'ly',
    factorToMeters: METERS_PER_LIGHT_YEAR,
    group: 'ly',
    exact: true,
  },
  { id: 'mm', label: 'Millimeters', symbol: 'mm', factorToMeters: 0.001, group: 'metric', exact: true },
  { id: 'cm', label: 'Centimeters', symbol: 'cm', factorToMeters: 0.01, group: 'metric', exact: true },
  { id: 'm', label: 'Meters', symbol: 'm', factorToMeters: 1, group: 'metric', exact: true },
  { id: 'km', label: 'Kilometers', symbol: 'km', factorToMeters: 1000, group: 'metric', exact: true },
  { id: 'in', label: 'Inches', symbol: 'in', factorToMeters: 0.0254, group: 'imperial', exact: true },
  { id: 'ft', label: 'Feet', symbol: 'ft', factorToMeters: 0.3048, group: 'imperial', exact: true },
  { id: 'yd', label: 'Yards', symbol: 'yd', factorToMeters: 0.9144, group: 'imperial', exact: true },
  { id: 'mi', label: 'Miles', symbol: 'mi', factorToMeters: 1609.344, group: 'imperial', exact: true },
  {
    id: 'au',
    label: 'Astronomical units',
    symbol: 'AU',
    factorToMeters: METERS_PER_AU,
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
];

export const LIGHT_YEAR_UNIT_BY_ID: Record<LightYearUnitId, LightYearUnitDef> =
  Object.fromEntries(LIGHT_YEAR_UNITS.map((u) => [u.id, u])) as Record<
    LightYearUnitId,
    LightYearUnitDef
  >;

export const METRIC_UNIT_IDS = ['mm', 'cm', 'm', 'km'] as const satisfies readonly LightYearUnitId[];
export const IMPERIAL_UNIT_IDS = ['in', 'ft', 'yd', 'mi'] as const satisfies readonly LightYearUnitId[];
export const ASTRO_UNIT_IDS = ['au', 'pc'] as const satisfies readonly LightYearUnitId[];

export const DEFAULT_FIELD_UNITS: readonly [
  LightYearUnitId,
  LightYearUnitId,
  LightYearUnitId,
  LightYearUnitId,
] = ['ly', 'km', 'mi', 'au'];

export const FIELD_LABELS: Record<LightYearFieldId, string> = {
  0: 'Distance in light-years',
  1: 'Distance in kilometers',
  2: 'Distance in miles',
  3: 'Distance in astronomical units',
};

/** Demo default: 1 light-year. */
export const DEFAULT_METERS = METERS_PER_LIGHT_YEAR;

export const MAX_ABS_VALUE = 1e308;

export type LightYearFieldErrors = Partial<Record<LightYearFieldId, string>>;

export interface LightYearConversionResult {
  meters: number;
  values: readonly [number, number, number, number];
  units: readonly [LightYearUnitId, LightYearUnitId, LightYearUnitId, LightYearUnitId];
}
