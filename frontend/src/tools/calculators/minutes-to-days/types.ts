import type { CombinedHms } from '../hour-converter/types';

export type { CombinedHms, TimeUnit } from '../hour-converter/types';

export {
  MAX_ABS_VALUE,
  MINUTES_PER_HOUR,
  SECONDS_PER_MINUTE,
  TIME_CONSTANTS,
} from '../hour-converter/types';

export type MinutesToDaysSource =
  | 'minutes'
  | 'days'
  | 'seconds'
  | 'hours'
  | 'weeks'
  | 'hms';

export interface MinutesToDaysInput {
  source: MinutesToDaysSource;
  minutes: number | null;
  days: number | null;
  seconds: number | null;
  hours: number | null;
  weeks: number | null;
  hmsHours: number | null;
  hmsMinutes: number | null;
  hmsSeconds: number | null;
}

export interface MinutesToDaysResult {
  source: MinutesToDaysSource;
  minutes: number;
  days: number;
  seconds: number;
  hours: number;
  weeks: number;
  combined: CombinedHms;
  explanation: string;
}

export type MinutesToDaysFieldErrors = {
  minutes?: string;
  days?: string;
  seconds?: string;
  hours?: string;
  weeks?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};

export const MINUTES_PER_DAY = 1440;
export const MINUTES_PER_WEEK = 10_080;
