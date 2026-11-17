import type { CombinedHms } from '../hour-converter/types';

export type {
  CombinedHms,
  TimeUnit,
} from '../hour-converter/types';

export {
  DAYS_PER_GREGORIAN_MONTH,
  DAYS_PER_GREGORIAN_YEAR,
  HOURS_PER_DAY,
  HOURS_PER_GREGORIAN_MONTH,
  HOURS_PER_GREGORIAN_YEAR,
  HOURS_PER_WEEK,
  MAX_ABS_VALUE,
  TIME_CONSTANTS,
} from '../hour-converter/types';

/** Which field group the user last edited. All other values are derived from seconds. */
export type HoursToYearsSource =
  | 'hours'
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'minutes'
  | 'seconds'
  | 'hms';

export interface HoursToYearsInput {
  source: HoursToYearsSource;
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

export interface HoursToYearsResult {
  source: HoursToYearsSource;
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

export type HoursToYearsFieldErrors = {
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
