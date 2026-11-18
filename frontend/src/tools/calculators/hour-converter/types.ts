/** Which field group the user last edited. All other values are derived from seconds. */
export type HourSource =
  | 'hours'
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'minutes'
  | 'seconds'
  | 'hms';

export interface HourInput {
  source: HourSource;
  hours: number | null;
  years: number | null;
  months: number | null;
  weeks: number | null;
  days: number | null;
  minutes: number | null;
  seconds: number | null;
  hmsHours: number | null;
  hmsMinutes: number | null;
  hmsSeconds: number | null;
}

export interface CombinedHms {
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
}

export interface HourResult {
  source: HourSource;
  hours: number;
  years: number;
  months: number;
  weeks: number;
  days: number;
  minutes: number;
  seconds: number;
  combined: CombinedHms;
  explanation: string;
}

export type HourFieldErrors = {
  hours?: string;
  years?: string;
  months?: string;
  weeks?: string;
  days?: string;
  minutes?: string;
  seconds?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};

export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const SECONDS_PER_HOUR = 3600;
export const HOURS_PER_DAY = 24;
export const HOURS_PER_WEEK = 168;
export const DAYS_PER_WEEK = 7;

/** Average Gregorian year (400-year cycle), in days. */
export const DAYS_PER_GREGORIAN_YEAR = 365.2425;
/** Average Gregorian month = year / 12, in days. */
export const DAYS_PER_GREGORIAN_MONTH = DAYS_PER_GREGORIAN_YEAR / 12;

/** Exact: 365.2425 × 24 = 8765.82 hours. */
export const HOURS_PER_GREGORIAN_YEAR = DAYS_PER_GREGORIAN_YEAR * HOURS_PER_DAY;
/** Exact: 30.436875 × 24 = 730.485 hours. */
export const HOURS_PER_GREGORIAN_MONTH = DAYS_PER_GREGORIAN_MONTH * HOURS_PER_DAY;

export const TIME_CONSTANTS = {
  SECOND: 1,
  MINUTE: SECONDS_PER_MINUTE,
  HOUR: SECONDS_PER_HOUR,
  DAY: SECONDS_PER_HOUR * HOURS_PER_DAY,
  WEEK: SECONDS_PER_HOUR * HOURS_PER_WEEK,
  MONTH: DAYS_PER_GREGORIAN_MONTH * SECONDS_PER_HOUR * HOURS_PER_DAY,
  YEAR: DAYS_PER_GREGORIAN_YEAR * SECONDS_PER_HOUR * HOURS_PER_DAY,
} as const;

export type TimeUnit = keyof typeof TIME_CONSTANTS;

export const MAX_ABS_VALUE = 1e15;
/** Combined HMS uses millisecond rounding; above this (seconds), show compact fallback. */
export const MAX_HMS_SECONDS = 1e8 * TIME_CONSTANTS.DAY;
