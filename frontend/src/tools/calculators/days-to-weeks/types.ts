export type {
  CombinedHms,
  DayConverterFieldErrors as DaysToWeeksFieldErrors,
  DayConverterInput as DaysToWeeksInput,
  DayConverterResult as DaysToWeeksResult,
  DayConverterSource as DaysToWeeksSource,
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
export const PRIMARY_UNITS: readonly DayTimeUnit[] = ['days', 'weeks'] as const;

/** Secondary fields inside Other Quantities. */
export const OTHER_UNITS: readonly DayTimeUnit[] = [
  'years',
  'months',
  'hours',
  'minutes',
  'seconds',
] as const;

export const ALL_UNITS: readonly DayTimeUnit[] = [
  'days',
  'weeks',
  'years',
  'months',
  'hours',
  'minutes',
  'seconds',
] as const;
