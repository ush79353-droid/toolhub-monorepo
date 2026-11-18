import type { LengthUnit } from '../meter-converter/types';
import {
  MAX_ABS_VALUE,
  METERS_PER_UNIT,
  UNIT_LABELS,
  UNIT_SYMBOLS,
} from '../meter-converter/types';

export type { LengthUnit };
export { MAX_ABS_VALUE, METERS_PER_UNIT, UNIT_LABELS, UNIT_SYMBOLS };

/** Units synced for the nm converter UI. */
export const NM_UNITS = [
  'nm',
  'pm',
  'um',
  'mm',
  'cm',
  'm',
  'km',
  'in',
  'ft',
  'yd',
  'mi',
  'angstrom',
] as const satisfies readonly LengthUnit[];

export type NmUnit = (typeof NM_UNITS)[number];

export type NmFieldErrors = Partial<Record<NmUnit, string>>;

export const METRIC_UNITS = [
  'pm',
  'um',
  'mm',
  'cm',
  'm',
  'km',
] as const satisfies readonly NmUnit[];

export const IMPERIAL_UNITS = ['in', 'ft', 'yd', 'mi'] as const satisfies readonly NmUnit[];

export const OTHER_UNITS = ['angstrom'] as const satisfies readonly NmUnit[];

export type MetricUnit = (typeof METRIC_UNITS)[number];
export type ImperialUnit = (typeof IMPERIAL_UNITS)[number];
export type OtherUnit = (typeof OTHER_UNITS)[number];

export const DEFAULT_METRIC_UNIT: MetricUnit = 'um';
export const DEFAULT_IMPERIAL_UNIT: ImperialUnit = 'mi';
export const DEFAULT_OTHER_UNIT: OtherUnit = 'angstrom';

export const METERS_PER_NM = 1e-9;
