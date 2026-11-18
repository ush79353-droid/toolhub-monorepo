/** Which field group the user last edited. All other values derive from milliseconds. */
export type MsSource =
  | 'milliseconds'
  | 'seconds'
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'hms';

export interface MsToSecondsInput {
  source: MsSource;
  milliseconds: number | null;
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

export interface MsToSecondsResult {
  source: MsSource;
  milliseconds: number;
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

export type MsToSecondsFieldErrors = {
  milliseconds?: string;
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

export const MILLISECONDS_PER_SECOND = 1000;
export const MILLISECONDS_PER_MINUTE = 60_000;
export const MILLISECONDS_PER_HOUR = 3_600_000;
export const MILLISECONDS_PER_DAY = 86_400_000;
export const MILLISECONDS_PER_WEEK = 604_800_000;

/** Average Gregorian year (400-year cycle), in days. */
export const DAYS_PER_GREGORIAN_YEAR = 365.2425;
/** Average Gregorian month = year / 12, in days. */
export const DAYS_PER_GREGORIAN_MONTH = DAYS_PER_GREGORIAN_YEAR / 12;

export const MILLISECONDS_PER_GREGORIAN_YEAR =
  DAYS_PER_GREGORIAN_YEAR * MILLISECONDS_PER_DAY;
export const MILLISECONDS_PER_GREGORIAN_MONTH =
  MILLISECONDS_PER_GREGORIAN_YEAR / 12;

export const MAX_ABS_VALUE = 1e18;
export const MAX_HMS_MS = 1e8 * MILLISECONDS_PER_DAY;
