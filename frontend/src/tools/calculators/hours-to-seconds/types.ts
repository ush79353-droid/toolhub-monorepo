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
export type HoursToSecondsSource = 'hours' | 'seconds' | 'hms';

export interface HoursToSecondsInput {
  source: HoursToSecondsSource;
  hours: number | null;
  seconds: number | null;
  hmsHours: number | null;
  hmsMinutes: number | null;
  hmsSeconds: number | null;
}

export interface HoursToSecondsResult {
  source: HoursToSecondsSource;
  hours: number;
  minutes: number;
  seconds: number;
  combined: CombinedHms;
  explanation: string;
}

export type HoursToSecondsFieldErrors = {
  hours?: string;
  seconds?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};
