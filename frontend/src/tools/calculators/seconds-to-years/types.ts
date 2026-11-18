/** Which field group the user last edited. All other values derive from seconds. */
export type SecYearsSource =
  | 'seconds'
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'hms';

export interface SecondsToYearsInput {
  source: SecYearsSource;
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

export interface SecondsToYearsResult {
  source: SecYearsSource;
  seconds: number;
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  combined: CombinedHms;
  explanation: string;
}

export type SecondsToYearsFieldErrors = {
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
export const DAYS_PER_YEAR = 365.2425;
/** Average Gregorian month = year / 12, in days. */
export const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 3_600;
export const SECONDS_PER_DAY = 86_400;
export const SECONDS_PER_WEEK = 604_800;
export const SECONDS_PER_YEAR = DAYS_PER_YEAR * SECONDS_PER_DAY; // 31,556,952
export const SECONDS_PER_MONTH = SECONDS_PER_YEAR / 12; // 2,629,746

export const MAX_ABS_VALUE = 1e18;
/** Combined HMS uses millisecond rounding; above this, show compact fallback. */
export const MAX_HMS_SECONDS = 1e8 * SECONDS_PER_DAY;
