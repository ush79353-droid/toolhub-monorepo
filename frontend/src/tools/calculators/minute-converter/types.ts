/** Which field group the user last edited. All other values are derived from seconds. */
export type MinuteSource =
  | 'minutes'
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'seconds'
  | 'hms';

export interface MinuteInput {
  source: MinuteSource;
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

export type {
  CombinedHms,
  TimeUnit,
} from '../hour-converter/types';

export {
  DAYS_PER_GREGORIAN_MONTH,
  DAYS_PER_GREGORIAN_YEAR,
  MAX_ABS_VALUE,
  MAX_HMS_SECONDS,
  MINUTES_PER_HOUR,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  TIME_CONSTANTS,
} from '../hour-converter/types';

import {
  DAYS_PER_GREGORIAN_YEAR,
  MINUTES_PER_HOUR,
} from '../hour-converter/types';

/** Exact: 365.2425 × 1440 = 525,949.2 minutes. */
export const MINUTES_PER_GREGORIAN_YEAR = DAYS_PER_GREGORIAN_YEAR * 24 * MINUTES_PER_HOUR;
/** Exact: year / 12 = 43,829.1 minutes. */
export const MINUTES_PER_GREGORIAN_MONTH = MINUTES_PER_GREGORIAN_YEAR / 12;

export const MINUTES_PER_DAY = 1440;
export const MINUTES_PER_WEEK = 10_080;

export interface MinuteResult {
  source: MinuteSource;
  minutes: number;
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  seconds: number;
  combined: import('../hour-converter/types').CombinedHms;
  explanation: string;
}

export type MinuteFieldErrors = {
  minutes?: string;
  years?: string;
  months?: string;
  weeks?: string;
  days?: string;
  hours?: string;
  seconds?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};
