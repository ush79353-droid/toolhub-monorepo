import {
  LENGTH_UNIT_BY_ID,
  METERS_PER_AU,
  METERS_PER_LIGHT_YEAR,
  METERS_PER_PARSEC,
  type LengthUnitId,
} from '../length-converter/types';

export type DistanceUnit = LengthUnitId;

/** Primary metric fields shown in the Metric group (expanded by default). */
export const METRIC_PRIMARY = ['mm', 'cm', 'm', 'km'] as const satisfies readonly DistanceUnit[];

/** Primary imperial fields shown in the Imperial/US group (expanded by default). */
export const IMPERIAL_PRIMARY = ['in', 'ft', 'yd', 'mi'] as const satisfies readonly DistanceUnit[];

/** Additional units behind Other distance units. */
export const OTHER_DISTANCE_UNITS = [
  'pm',
  'nm',
  'um',
  'dm',
  'dam',
  'hm',
  'thou',
  'ftm',
  'nmi',
  'angstrom',
  'au',
  'ly',
  'pc',
] as const satisfies readonly DistanceUnit[];

export const ALL_DISTANCE_UNITS = [
  ...METRIC_PRIMARY,
  ...IMPERIAL_PRIMARY,
  ...OTHER_DISTANCE_UNITS,
] as const;

export type DistanceSource = (typeof ALL_DISTANCE_UNITS)[number];

export interface DistanceConverterInput {
  source: DistanceSource;
  value: number | null;
}

export type DistanceValues = Record<DistanceSource, number>;

export interface DistanceConverterResult {
  source: DistanceSource;
  meters: number;
  values: DistanceValues;
}

export type DistanceFieldErrors = Partial<Record<DistanceSource, string>>;

export const MAX_ABS_VALUE = 1e30;

export const UNIT_TITLE: Record<DistanceSource, string> = {
  mm: 'Distance in millimeters',
  cm: 'Distance in centimeters',
  m: 'Distance in meters',
  km: 'Distance in kilometers',
  in: 'Distance in inches',
  ft: 'Distance in feet',
  yd: 'Distance in yards',
  mi: 'Distance in miles',
  pm: 'Picometers',
  nm: 'Nanometers',
  um: 'Micrometers',
  dm: 'Decimeters',
  dam: 'Decameters',
  hm: 'Hectometers',
  thou: 'Thou / mil',
  ftm: 'Fathoms',
  nmi: 'Nautical miles',
  angstrom: 'Ångströms',
  au: 'Astronomical units',
  ly: 'Light-years',
  pc: 'Parsecs',
};

export function unitSymbol(unit: DistanceUnit): string {
  return LENGTH_UNIT_BY_ID[unit].symbol;
}

export function unitLabel(unit: DistanceUnit): string {
  return LENGTH_UNIT_BY_ID[unit].label;
}

/** Meters-per-unit map for the distance converter registry (documents astronomical approx). */
export const DISTANCE_METERS_PER_UNIT: Record<DistanceSource, number> = {
  pm: LENGTH_UNIT_BY_ID.pm.factorToMeters,
  nm: LENGTH_UNIT_BY_ID.nm.factorToMeters,
  um: LENGTH_UNIT_BY_ID.um.factorToMeters,
  mm: LENGTH_UNIT_BY_ID.mm.factorToMeters,
  cm: LENGTH_UNIT_BY_ID.cm.factorToMeters,
  dm: LENGTH_UNIT_BY_ID.dm.factorToMeters,
  m: 1,
  dam: LENGTH_UNIT_BY_ID.dam.factorToMeters,
  hm: LENGTH_UNIT_BY_ID.hm.factorToMeters,
  km: LENGTH_UNIT_BY_ID.km.factorToMeters,
  in: LENGTH_UNIT_BY_ID.in.factorToMeters,
  ft: LENGTH_UNIT_BY_ID.ft.factorToMeters,
  yd: LENGTH_UNIT_BY_ID.yd.factorToMeters,
  mi: LENGTH_UNIT_BY_ID.mi.factorToMeters,
  thou: LENGTH_UNIT_BY_ID.thou.factorToMeters,
  ftm: LENGTH_UNIT_BY_ID.ftm.factorToMeters,
  nmi: LENGTH_UNIT_BY_ID.nmi.factorToMeters,
  angstrom: LENGTH_UNIT_BY_ID.angstrom.factorToMeters,
  au: METERS_PER_AU,
  ly: METERS_PER_LIGHT_YEAR,
  /** Geometric parsec = (648000/π) AU — documented approximation via IAU AU. */
  pc: METERS_PER_PARSEC,
};
