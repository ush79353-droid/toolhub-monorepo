/** Which field group the user last edited. All other values derive from seconds. */
export type SecondsSource =
  | 'seconds'
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'hms';

export interface SecondsConverterInput {
  source: SecondsSource;
  seconds: number | null;
  years: number | null;
  months: number | null;
  weeks: number | null;
  days: number | null;
  hours: number | null;
  minutes: number | null;
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

export interface SecondsConverterResult {
  source: SecondsSource;
  seconds: number;
  milliseconds: number;
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  combined: CombinedHms;
  explanation: string;
}

export type SecondsConverterFieldErrors = {
  seconds?: string;
  years?: string;
  months?: string;
  weeks?: string;
  days?: string;
  hours?: string;
  minutes?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};

/** Average Gregorian year (400-year cycle), in days. */
export const DAYS_PER_GREGORIAN_YEAR = 365.2425;
/** Average Gregorian month = year / 12, in days. */
export const DAYS_PER_GREGORIAN_MONTH = DAYS_PER_GREGORIAN_YEAR / 12;

/**
 * Exact seconds per unit.
 * Years/months use average Gregorian durations (not Julian 365.25).
 */
export const TIME_UNIT_SECONDS = {
  ms: 0.001,
  sec: 1,
  min: 60,
  hrs: 3600,
  days: 86_400,
  wks: 604_800,
  mos: 2_629_746,
  yrs: 31_556_952,
} as const;

export type TimeUnit = keyof typeof TIME_UNIT_SECONDS;

export const SECONDS_PER_MINUTE = TIME_UNIT_SECONDS.min;
export const SECONDS_PER_HOUR = TIME_UNIT_SECONDS.hrs;
export const SECONDS_PER_DAY = TIME_UNIT_SECONDS.days;
export const SECONDS_PER_WEEK = TIME_UNIT_SECONDS.wks;
export const SECONDS_PER_GREGORIAN_MONTH = TIME_UNIT_SECONDS.mos;
export const SECONDS_PER_GREGORIAN_YEAR = TIME_UNIT_SECONDS.yrs;

export const MAX_ABS_VALUE = 1e18;
/** Combined HMS uses millisecond rounding; above this, show compact fallback. */
export const MAX_HMS_SECONDS = 1e8 * SECONDS_PER_DAY;
