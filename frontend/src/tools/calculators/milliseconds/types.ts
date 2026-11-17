export type {
  TimeUnit,
  TimeUnitFieldErrors as MillisecondsFieldErrors,
} from '../time-unit/types';

export {
  DAY,
  HOUR,
  MAX_INPUT_LENGTH,
  MINUTE,
  SECOND,
  TIME_UNIT_DEFS,
  TIME_UNIT_SECONDS,
  WEEK,
  YEAR,
} from '../time-unit/types';

import type { TimeUnit } from '../time-unit/types';

/** Core fields always visible (milliseconds primary). */
export const CORE_UNITS = [
  'milliseconds',
  'seconds',
  'minutes',
  'hours',
  'days',
] as const satisfies readonly TimeUnit[];

export type CoreTimeUnit = (typeof CORE_UNITS)[number];

/** Extra selector — sub-second + longer fixed durations. Years use Julian 365.25 days (shared time-unit). */
export const OTHER_UNITS = [
  'nanoseconds',
  'microseconds',
  'weeks',
  'fortnights',
  'years',
] as const satisfies readonly TimeUnit[];

export type OtherTimeUnit = (typeof OTHER_UNITS)[number];

export const DEFAULT_OTHER_UNIT: OtherTimeUnit = 'nanoseconds';

export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = 60_000;
export const MS_PER_HOUR = 3_600_000;
export const MS_PER_DAY = 86_400_000;
export const MS_PER_WEEK = 604_800_000;
/** Julian-year ms via shared engine: 365.25 × 86,400 × 1000. */
export const MS_PER_JULIAN_YEAR = 31_557_600_000;

export const FIELD_LABELS: Record<CoreTimeUnit | OtherTimeUnit, string> = {
  milliseconds: 'Time in milliseconds',
  seconds: 'Time in seconds',
  minutes: 'Time in minutes',
  hours: 'Time in hours',
  days: 'Time in days',
  nanoseconds: 'Time in nanoseconds',
  microseconds: 'Time in microseconds',
  weeks: 'Time in weeks',
  fortnights: 'Time in fortnights',
  years: 'Time in years (365.25-day average)',
};
