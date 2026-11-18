export const MAIN_TIME_UNITS = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
] as const;

export const EXTRA_TIME_UNITS = [
  'milliseconds',
  'microseconds',
  'nanoseconds',
  'fortnights',
  'decades',
  'centuries',
  'millennia',
] as const;

export type MainTimeUnit = (typeof MAIN_TIME_UNITS)[number];
export type ExtraTimeUnit = (typeof EXTRA_TIME_UNITS)[number];
export type TimeUnit = MainTimeUnit | ExtraTimeUnit;

export type TimeUnitFieldErrors = Partial<Record<TimeUnit, string>>;

export const MAX_INPUT_LENGTH = 64;
export const DISPLAY_FRAC_DIGITS = 18;

export const SECOND = 1;
export const MINUTE = 60;
export const HOUR = 3600;
export const DAY = 86400;
export const WEEK = 7 * DAY;
/** Julian-year convention: 365.25 × 86,400. */
export const YEAR = 31_557_600;
/** 1/12 of the average year: 2,629,800 seconds = 30.4375 days. */
export const MONTH = 2_629_800;
export const FORTNIGHT = 14 * DAY;
export const DECADE = 10 * YEAR;
export const CENTURY = 100 * YEAR;
export const MILLENNIUM = 1000 * YEAR;

/** Exact seconds = num / den. Sub-second units use den > 1. */
export const TIME_UNIT_RATIO: Record<TimeUnit, { num: number; den: number }> = {
  years: { num: YEAR, den: 1 },
  months: { num: MONTH, den: 1 },
  weeks: { num: WEEK, den: 1 },
  days: { num: DAY, den: 1 },
  hours: { num: HOUR, den: 1 },
  minutes: { num: MINUTE, den: 1 },
  seconds: { num: SECOND, den: 1 },
  milliseconds: { num: 1, den: 1000 },
  microseconds: { num: 1, den: 1_000_000 },
  nanoseconds: { num: 1, den: 1_000_000_000 },
  fortnights: { num: FORTNIGHT, den: 1 },
  decades: { num: DECADE, den: 1 },
  centuries: { num: CENTURY, den: 1 },
  millennia: { num: MILLENNIUM, den: 1 },
};

export const TIME_UNIT_SECONDS: Record<TimeUnit, number> = {
  years: YEAR,
  months: MONTH,
  weeks: WEEK,
  days: DAY,
  hours: HOUR,
  minutes: MINUTE,
  seconds: SECOND,
  milliseconds: 0.001,
  microseconds: 0.000001,
  nanoseconds: 1e-9,
  fortnights: FORTNIGHT,
  decades: DECADE,
  centuries: CENTURY,
  millennia: MILLENNIUM,
};

export interface TimeUnitDef {
  id: TimeUnit;
  label: string;
  symbol: string;
}

export const TIME_UNIT_DEFS: Record<TimeUnit, TimeUnitDef> = {
  years: { id: 'years', label: 'Years', symbol: 'yr' },
  months: { id: 'months', label: 'Months', symbol: 'mo' },
  weeks: { id: 'weeks', label: 'Weeks', symbol: 'wk' },
  days: { id: 'days', label: 'Days', symbol: 'd' },
  hours: { id: 'hours', label: 'Hours', symbol: 'hr' },
  minutes: { id: 'minutes', label: 'Minutes', symbol: 'min' },
  seconds: { id: 'seconds', label: 'Seconds', symbol: 'sec' },
  milliseconds: { id: 'milliseconds', label: 'Milliseconds', symbol: 'ms' },
  microseconds: { id: 'microseconds', label: 'Microseconds', symbol: 'µs' },
  nanoseconds: { id: 'nanoseconds', label: 'Nanoseconds', symbol: 'ns' },
  fortnights: { id: 'fortnights', label: 'Fortnights', symbol: 'fn' },
  decades: { id: 'decades', label: 'Decades', symbol: 'dec' },
  centuries: { id: 'centuries', label: 'Centuries', symbol: 'c' },
  millennia: { id: 'millennia', label: 'Millennia', symbol: 'kyr' },
};

export const DEFAULT_HOURS = '24';
export const DEFAULT_EXTRA_UNIT: ExtraTimeUnit = 'milliseconds';
