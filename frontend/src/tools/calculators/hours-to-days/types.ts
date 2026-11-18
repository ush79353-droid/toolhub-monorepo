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
  MAX_ABS_VALUE,
  TIME_CONSTANTS,
} from '../hour-converter/types';

/** Which field group the user last edited. All other values are derived from seconds. */
export type HoursToDaysSource =
  | 'hours'
  | 'days'
  | 'years'
  | 'months'
  | 'weeks'
  | 'minutes'
  | 'seconds'
  | 'hms';

export interface HoursToDaysInput {
  source: HoursToDaysSource;
  hours: number | null;
  days: number | null;
  years: number | null;
  months: number | null;
  weeks: number | null;
  minutes: number | null;
  seconds: number | null;
  hmsHours: number | null;
  hmsMinutes: number | null;
  hmsSeconds: number | null;
}

export interface HoursToDaysResult {
  source: HoursToDaysSource;
  hours: number;
  days: number;
  years: number;
  months: number;
  weeks: number;
  minutes: number;
  seconds: number;
  combined: CombinedHms;
  dayFractionLabel: string;
  explanation: string;
}

export type HoursToDaysFieldErrors = {
  hours?: string;
  days?: string;
  years?: string;
  months?: string;
  weeks?: string;
  minutes?: string;
  seconds?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};
