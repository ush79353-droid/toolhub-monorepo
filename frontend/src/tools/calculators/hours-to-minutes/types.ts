import type { CombinedHms } from '../hour-converter/types';

export type { CombinedHms } from '../hour-converter/types';

export {
  MAX_ABS_VALUE,
  MINUTES_PER_HOUR,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  TIME_CONSTANTS,
} from '../hour-converter/types';

/** Which field group the user last edited. All other values are derived from seconds. */
export type HoursToMinutesSource = 'hours' | 'minutes' | 'seconds' | 'hms';

export interface HoursToMinutesInput {
  source: HoursToMinutesSource;
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
  hmsHours: number | null;
  hmsMinutes: number | null;
  hmsSeconds: number | null;
}

export interface HoursToMinutesResult {
  source: HoursToMinutesSource;
  hours: number;
  minutes: number;
  seconds: number;
  combined: CombinedHms;
  explanation: string;
}

export type HoursToMinutesFieldErrors = {
  hours?: string;
  minutes?: string;
  seconds?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};
