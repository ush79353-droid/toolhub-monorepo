export type DayTimeUnit =
  | 'days'
  | 'years'
  | 'months'
  | 'weeks'
  | 'hours'
  | 'minutes'
  | 'seconds';

export type DayConverterSource = DayTimeUnit;

export interface DayConverterInput {
  source: DayConverterSource;
  /** null while the active source field is blank or incomplete. */
  value: number | null;
}

export interface CombinedHms {
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
}

export interface DayConverterResult {
  source: DayConverterSource;
  days: number;
  years: number;
  months: number;
  weeks: number;
  hours: number;
  minutes: number;
  seconds: number;
  combined: CombinedHms;
  explanation: string;
}

export type DayConverterFieldErrors = Partial<Record<DayTimeUnit, string>>;

/** Average Gregorian year (400-year cycle). */
export const DAYS_PER_YEAR = 365.2425;

/** Average month = Gregorian year / 12. */
export const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

/** Days represented by one unit of each kind. */
export const DAYS_PER_UNIT: Record<DayTimeUnit, number> = {
  days: 1,
  years: DAYS_PER_YEAR,
  months: DAYS_PER_MONTH,
  weeks: 7,
  hours: 1 / 24,
  minutes: 1 / 1440,
  seconds: 1 / 86400,
};

export const UNIT_LABEL: Record<DayTimeUnit, string> = {
  days: 'day',
  years: 'yr',
  months: 'mo',
  weeks: 'wk',
  hours: 'h',
  minutes: 'min',
  seconds: 's',
};

export const UNIT_TITLE: Record<DayTimeUnit, string> = {
  days: 'Days',
  years: 'Years',
  months: 'Months',
  weeks: 'Weeks',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
};

export const OUTPUT_UNITS: readonly DayTimeUnit[] = [
  'years',
  'months',
  'weeks',
  'hours',
  'minutes',
  'seconds',
] as const;

export const MAX_ABS_VALUE = 1e12;
/** Combined HMS uses millisecond rounding; above this, show a compact fallback. */
export const MAX_HMS_DAYS = 1e8;
