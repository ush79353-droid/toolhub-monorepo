export type ConversionDirection = 'military-to-standard' | 'standard-to-military';
export type DayPeriod = 'AM' | 'PM';

export const DIRECTION_LABELS: Record<ConversionDirection, string> = {
  'military-to-standard': 'Military time to 12-hour time',
  'standard-to-military': '12-hour time to military time',
};

export interface ParsedMilitaryTime {
  hours: number;
  minutes: number;
}

export interface StandardTime {
  hours: number;
  minutes: number;
  period: DayPeriod;
}

export interface MilitaryTimeResult {
  military: string;
  standard: string;
  twentyFour: string;
}

export type MilitaryFieldErrors = {
  military?: string;
  hour?: string;
  minute?: string;
};

export const DEFAULT_MILITARY = '1830';
export const DEFAULT_HOUR = 6;
export const DEFAULT_MINUTE = 30;
export const DEFAULT_PERIOD: DayPeriod = 'PM';

export const HOUR_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => i);
