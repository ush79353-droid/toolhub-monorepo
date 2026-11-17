export const MAX_ABS_VALUE = 1e15;

export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;
export const DAYS_PER_AVERAGE_YEAR = 365.25;

export const MINUTES_PER_DAY = 1440;
export const MINUTES_PER_WEEK = 10_080;
/** 365.25 × 24 × 60 */
export const MINUTES_PER_AVERAGE_YEAR = 525_960;
/** Average month = 1/12 of average year */
export const MINUTES_PER_AVERAGE_MONTH = 43_830;
/** 365.25 × 24 */
export const HOURS_PER_AVERAGE_YEAR = 8766;
/** 525960 × 60 */
export const SECONDS_PER_AVERAGE_YEAR = 31_557_600;

export type MinutesToYearsSource =
  | 'minutes'
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'seconds'
  | 'hms';

export interface MinutesToYearsInput {
  source: MinutesToYearsSource;
  minutes: number | null;
  years: number | null;
  months: number | null;
  weeks: number | null;
  days: number | null;
  hours: number | null;
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

export interface MinutesToYearsResult {
  source: MinutesToYearsSource;
  minutes: number;
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  seconds: number;
  combined: CombinedHms;
  explanation: string;
}

export type MinutesToYearsFieldErrors = Partial<
  Record<
    | 'minutes'
    | 'years'
    | 'months'
    | 'weeks'
    | 'days'
    | 'hours'
    | 'seconds'
    | 'hmsHours'
    | 'hmsMinutes'
    | 'hmsSeconds',
    string
  >
>;
