export type {
  CombinedHms,
  DayConverterFieldErrors as DaysToMonthsFieldErrors,
  DayConverterInput as DaysToMonthsInput,
  DayConverterResult as DaysToMonthsResult,
  DayConverterSource as DaysToMonthsSource,
  DayTimeUnit,
} from '../day-converter/types';

export {
  DAYS_PER_MONTH,
  DAYS_PER_UNIT,
  DAYS_PER_YEAR,
  MAX_ABS_VALUE,
  UNIT_LABEL,
  UNIT_TITLE,
} from '../day-converter/types';

import type { DayTimeUnit } from '../day-converter/types';

/** Primary pair shown above the accordion. */
export const PRIMARY_UNITS: readonly DayTimeUnit[] = ['days', 'months'] as const;

/** Secondary fields inside Other Time Conversions. */
export const OTHER_UNITS: readonly DayTimeUnit[] = [
  'seconds',
  'minutes',
  'hours',
  'weeks',
  'years',
] as const;

export const ALL_UNITS: readonly DayTimeUnit[] = [
  'days',
  'months',
  'seconds',
  'minutes',
  'hours',
  'weeks',
  'years',
] as const;
