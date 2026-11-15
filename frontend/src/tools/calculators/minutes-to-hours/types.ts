export type DurationField = 'hours' | 'minutes' | 'seconds';

export interface HmsParts {
  sign: 1 | -1;
  hours: string;
  minutes: string;
  seconds: string;
}

export type MinutesToHoursFieldErrors = Partial<
  Record<DurationField | 'hmsHours' | 'hmsMinutes' | 'hmsSeconds', string>
>;

export const MAX_INPUT_LENGTH = 64;
export const DISPLAY_FRAC_DIGITS = 12;
export const DEFAULT_MINUTES = '150';
