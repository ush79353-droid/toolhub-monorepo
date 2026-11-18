import type { SpeedUnit } from '../speed/types';

/** Primary + expandable fields for this focused converter. */
export const KNOTS_KPH_FIELDS = ['knot', 'kmh', 'mph', 'mps', 'ftPerSec'] as const;
export type KnotsKphField = (typeof KNOTS_KPH_FIELDS)[number] & SpeedUnit;

export const PRIMARY_FIELDS: readonly KnotsKphField[] = ['knot', 'kmh'];
export const EXTRA_FIELDS: readonly KnotsKphField[] = ['mph', 'mps', 'ftPerSec'];

export const FIELD_LABELS: Record<KnotsKphField, string> = {
  knot: 'Speed in knots',
  kmh: 'Speed in kph (km/h)',
  mph: 'Miles per hour',
  mps: 'Meters per second',
  ftPerSec: 'Feet per second',
};

export const FIELD_SYMBOLS: Record<KnotsKphField, string> = {
  knot: 'kn',
  kmh: 'km/h',
  mph: 'mph',
  mps: 'm/s',
  ftPerSec: 'ft/s',
};

export type KnotsKphFieldErrors = Partial<Record<KnotsKphField, string>>;

/** Exact: 1 international nautical mile / hour = 1852 m / 3600 s → 1.852 km/h. */
export const KNOTS_TO_KPH = 1.852;
