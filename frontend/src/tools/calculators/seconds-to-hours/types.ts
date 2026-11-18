export const SECONDS_PER_HOUR = 3_600;
export const SECONDS_PER_MINUTE = 60;
export const MAX_ABS_VALUE = 1e15;
/** Beyond this, HMS shows approximate hours only. */
export const MAX_HMS_SECONDS = 1e12;

export type SecHoursSource = 'seconds' | 'hours' | 'hms';

export interface CombinedHms {
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
}

export interface SecondsToHoursInput {
  source: SecHoursSource;
  seconds: number | null;
  hours: number | null;
  hmsHours: number | null;
  hmsMinutes: number | null;
  hmsSeconds: number | null;
}

export interface SecondsToHoursResult {
  source: SecHoursSource;
  seconds: number;
  hours: number;
  combined: CombinedHms;
  explanation: string;
}

export type SecondsToHoursFieldErrors = {
  seconds?: string;
  hours?: string;
  hmsHours?: string;
  hmsMinutes?: string;
  hmsSeconds?: string;
};
