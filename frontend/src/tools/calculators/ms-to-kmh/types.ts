export const MAIN_SPEED_UNITS = ['mps', 'kmh', 'mph', 'fps', 'knots'] as const;

export const EXTRA_SPEED_UNITS = [
  'cms',
  'mms',
  'kms',
  'mpm',
  'kmpm',
  'fpm',
  'mips',
  'mipm',
] as const;

export type MainSpeedUnit = (typeof MAIN_SPEED_UNITS)[number];
export type ExtraSpeedUnit = (typeof EXTRA_SPEED_UNITS)[number];
export type SpeedUnit = MainSpeedUnit | ExtraSpeedUnit;

export type SpeedFieldErrors = Partial<Record<SpeedUnit, string>>;

export const MAX_ABS_MPS = 1e15;
export const DEFAULT_MPS = 10;

/** Exact SI / international factors relative to 1 m/s. */
export const METERS_PER_FOOT = 0.3048;
export const METERS_PER_MILE = 1609.344;
export const METERS_PER_NAUTICAL_MILE = 1852;

export interface SpeedUnitDef {
  id: SpeedUnit;
  label: string;
  symbol: string;
  /** Multiply m/s by this to get the unit. */
  fromMps: number;
}

export const SPEED_UNIT_DEFS: Record<SpeedUnit, SpeedUnitDef> = {
  mps: {
    id: 'mps',
    label: 'Speed in meters per second',
    symbol: 'm/s',
    fromMps: 1,
  },
  kmh: {
    id: 'kmh',
    label: 'Speed in kilometers per hour',
    symbol: 'km/h',
    fromMps: 3.6,
  },
  mph: {
    id: 'mph',
    label: 'Speed in miles per hour',
    symbol: 'mph',
    fromMps: 3600 / METERS_PER_MILE,
  },
  fps: {
    id: 'fps',
    label: 'Speed in feet per second',
    symbol: 'ft/s',
    fromMps: 1 / METERS_PER_FOOT,
  },
  knots: {
    id: 'knots',
    label: 'Speed in knots',
    symbol: 'kn',
    fromMps: 3600 / METERS_PER_NAUTICAL_MILE,
  },
  cms: {
    id: 'cms',
    label: 'Centimeters per second',
    symbol: 'cm/s',
    fromMps: 100,
  },
  mms: {
    id: 'mms',
    label: 'Millimeters per second',
    symbol: 'mm/s',
    fromMps: 1000,
  },
  kms: {
    id: 'kms',
    label: 'Kilometers per second',
    symbol: 'km/s',
    fromMps: 0.001,
  },
  mpm: {
    id: 'mpm',
    label: 'Meters per minute',
    symbol: 'm/min',
    fromMps: 60,
  },
  kmpm: {
    id: 'kmpm',
    label: 'Kilometers per minute',
    symbol: 'km/min',
    fromMps: 0.06,
  },
  fpm: {
    id: 'fpm',
    label: 'Feet per minute',
    symbol: 'ft/min',
    fromMps: 60 / METERS_PER_FOOT,
  },
  mips: {
    id: 'mips',
    label: 'Miles per second',
    symbol: 'mi/s',
    fromMps: 1 / METERS_PER_MILE,
  },
  mipm: {
    id: 'mipm',
    label: 'Miles per minute',
    symbol: 'mi/min',
    fromMps: 60 / METERS_PER_MILE,
  },
};
