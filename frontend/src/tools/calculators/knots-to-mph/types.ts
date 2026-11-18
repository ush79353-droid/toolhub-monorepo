/** All five fields stay visible (screenshot parity). */
export const KNOTS_MPH_FIELDS = ['knot', 'mph', 'kmh', 'ftPerSec', 'mps'] as const;
export type KnotsMphField = (typeof KNOTS_MPH_FIELDS)[number];

export const FIELD_LABELS: Record<KnotsMphField, string> = {
  knot: 'Speed in knots',
  mph: 'Speed in miles per hour',
  kmh: 'Speed in kilometers per hour',
  ftPerSec: 'Speed in feet per second',
  mps: 'Speed in meters per second',
};

export const FIELD_SYMBOLS: Record<KnotsMphField, string> = {
  knot: 'kn',
  mph: 'mph',
  kmh: 'km/h',
  ftPerSec: 'ft/s',
  mps: 'm/s',
};

export type KnotsMphFieldErrors = Partial<Record<KnotsMphField, string>>;

/** Exact: 1852 / 1609.344 */
export const KNOTS_TO_MPH = 1852 / 1609.344;
