/** Which field the user last edited. All other values derive from seconds. */
export type WeeksYearsSource =
  | 'weeks'
  | 'years'
  | 'months'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'hms';

export interface WeeksToYearsInput {
  source: WeeksYearsSource;
  weeks: number | null;
  years: number | null;
  months: number | null;
  days: number | null;
  hours: number | null;
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

export interface WeeksToYearsResult {
  source: WeeksYearsSource;
  seconds: number;
  weeks: number;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  combined: CombinedHms;
  explanation: string;
}

export type WeeksToYearsFieldErrors = {
  weeks?: string;
  years?: string;
  months?: string;
  days?: string;
  hours?: string;
  minutes?: string;
  seconds?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};

export const TIME_SECONDS = {
  second: 1,
  minute: 60,
  hour: 3_600,
  day: 86_400,
  week: 604_800,
  month: 2_629_746,
  year: 31_556_952,
} as const;

export type TimeUnit = keyof typeof TIME_SECONDS;

/** Average Gregorian year (400-year cycle), in days. */
export const DAYS_PER_YEAR = 365.2425;
/** Average Gregorian month = year / 12, in days. */
export const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;
/** Exact: 1 week = 7 days. */
export const DAYS_PER_WEEK = 7;

export const SECONDS_PER_MINUTE = TIME_SECONDS.minute;
export const SECONDS_PER_HOUR = TIME_SECONDS.hour;
export const SECONDS_PER_DAY = TIME_SECONDS.day;
export const SECONDS_PER_WEEK = TIME_SECONDS.week;
export const SECONDS_PER_MONTH = TIME_SECONDS.month;
export const SECONDS_PER_YEAR = TIME_SECONDS.year;

/** Average weeks per Gregorian year (year seconds ÷ week seconds). */
export const WEEKS_PER_YEAR = SECONDS_PER_YEAR / SECONDS_PER_WEEK;
/** Average years per week. */
export const YEARS_PER_WEEK = SECONDS_PER_WEEK / SECONDS_PER_YEAR;

export const MAX_ABS_VALUE = 1e18;
/** Combined HMS uses millisecond rounding; above this, show compact fallback. */
export const MAX_HMS_SECONDS = 1e8 * SECONDS_PER_DAY;
