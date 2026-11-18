/** Linear speed units — multiply by factor to obtain meters per second. */
export const SPEED_UNITS = [
  'mph',
  'ftPerSec',
  'ydPerSec',
  'miPerSec',
  'ftPerMin',
  'kmh',
  'mps',
  'kmPerSec',
  'mPerMin',
  'cmPerSec',
  'mmPerSec',
  'knot',
  'c',
] as const;
export type SpeedUnit = (typeof SPEED_UNITS)[number];

/** Pace fields — inverse of speed for a fixed distance. */
export const PACE_UNITS = [
  'minPerKm',
  'secPerKm',
  'minPerMile',
  'secPerMile',
  'minPer100m',
  'secPer100m',
] as const;
export type PaceUnit = (typeof PACE_UNITS)[number];

export type SpeedField = SpeedUnit | PaceUnit;

export type SpeedFieldErrors = Partial<Record<SpeedField, string>>;

export const SPEED_TO_MPS: Record<SpeedUnit, number> = {
  mph: 0.44704,
  ftPerSec: 0.3048,
  ydPerSec: 0.9144,
  miPerSec: 1609.344,
  ftPerMin: 0.00508,
  kmh: 1 / 3.6,
  mps: 1,
  kmPerSec: 1000,
  mPerMin: 1 / 60,
  cmPerSec: 0.01,
  mmPerSec: 0.001,
  knot: 1852 / 3600,
  c: 299_792_458,
};

export const SPEED_UNIT_SYMBOLS: Record<SpeedUnit, string> = {
  mph: 'mph',
  ftPerSec: 'ft/s',
  ydPerSec: 'yd/s',
  miPerSec: 'mi/s',
  ftPerMin: 'ft/min',
  kmh: 'km/h',
  mps: 'm/s',
  kmPerSec: 'km/s',
  mPerMin: 'm/min',
  cmPerSec: 'cm/s',
  mmPerSec: 'mm/s',
  knot: 'kn',
  c: 'c',
};

export const SPEED_FIELD_LABELS: Record<SpeedUnit, string> = {
  mph: 'Miles per hour',
  ftPerSec: 'Feet per second',
  ydPerSec: 'Yards per second',
  miPerSec: 'Miles per second',
  ftPerMin: 'Feet per minute',
  kmh: 'Kilometers per hour',
  mps: 'Meters per second',
  kmPerSec: 'Kilometers per second',
  mPerMin: 'Meters per minute',
  cmPerSec: 'Centimeters per second',
  mmPerSec: 'Millimeters per second',
  knot: 'Knots',
  c: 'Speed of light (vacuum)',
};

/** Distance in meters for each pace unit definition. */
export const PACE_DISTANCE_M: Record<PaceUnit, number> = {
  minPerKm: 1000,
  secPerKm: 1000,
  minPerMile: 1609.344,
  secPerMile: 1609.344,
  minPer100m: 100,
  secPer100m: 100,
};

export const PACE_UNIT_SYMBOLS: Record<PaceUnit, string> = {
  minPerKm: 'min/km',
  secPerKm: 's/km',
  minPerMile: 'min/mi',
  secPerMile: 's/mi',
  minPer100m: 'min/100m',
  secPer100m: 's/100m',
};

export const PACE_FIELD_LABELS: Record<PaceUnit, string> = {
  minPerKm: 'Minutes per kilometer',
  secPerKm: 'Seconds per kilometer',
  minPerMile: 'Minutes per mile',
  secPerMile: 'Seconds per mile',
  minPer100m: 'Minutes per 100 meters',
  secPer100m: 'Seconds per 100 meters',
};

export const IMPERIAL_PRIMARY: readonly SpeedUnit[] = ['mph', 'ftPerSec', 'ydPerSec'];
export const IMPERIAL_OTHER: readonly SpeedUnit[] = ['miPerSec', 'ftPerMin'];
export const METRIC_PRIMARY: readonly SpeedUnit[] = ['kmh', 'mps', 'kmPerSec'];
export const METRIC_OTHER: readonly SpeedUnit[] = ['mPerMin', 'cmPerSec', 'mmPerSec'];
export const OTHER_PRIMARY: readonly SpeedUnit[] = ['knot', 'c'];
export const PACE_PRIMARY: readonly PaceUnit[] = [
  'minPerKm',
  'secPerKm',
  'minPerMile',
  'secPerMile',
];
export const PACE_OTHER: readonly PaceUnit[] = ['minPer100m', 'secPer100m'];

export function isPaceUnit(field: SpeedField): field is PaceUnit {
  return (PACE_UNITS as readonly string[]).includes(field);
}

export function isSpeedUnit(field: SpeedField): field is SpeedUnit {
  return (SPEED_UNITS as readonly string[]).includes(field);
}

export const MAX_ABS_MPS = 1e30;
/** Pace in minutes units: value is minutes; seconds units: value is seconds. */
export function paceUsesMinutes(unit: PaceUnit): boolean {
  return unit.startsWith('min');
}
