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
export type HoursToWeeksSource =
  | 'hours'
  | 'weeks'
  | 'years'
  | 'months'
  | 'days'
  | 'minutes'
  | 'seconds'
  | 'hms';

export interface HoursToWeeksInput {
  source: HoursToWeeksSource;
  hours: number | null;
  weeks: number | null;
  years: number | null;
  months: number | null;
  days: number | null;
  minutes: number | null;
  seconds: number | null;
  hmsHours: number | null;
  hmsMinutes: number | null;
  hmsSeconds: number | null;
}

export interface HoursToWeeksResult {
  source: HoursToWeeksSource;
  hours: number;
  weeks: number;
  years: number;
  months: number;
  days: number;
  minutes: number;
  seconds: number;
  combined: CombinedHms;
  weekFractionLabel: string;
  explanation: string;
}

export type HoursToWeeksFieldErrors = {
  hours?: string;
  weeks?: string;
  years?: string;
  months?: string;
  days?: string;
  minutes?: string;
  seconds?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};
