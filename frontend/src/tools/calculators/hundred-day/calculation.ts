import {
  MAX_DAY_OFFSET,
  addCalendarDays,
  diffCalendarDays,
  formatLongDate,
  parseIsoDate,
  weekdayName,
  weeksAndDays,
} from './dates';

export type HundredDayMode = 'offset' | 'between';
export type DayDirection = 'after' | 'before';

export interface HundredDayInput {
  mode: HundredDayMode;
  startDate: string;
  dayCount: number;
  direction: DayDirection;
  includeStart: boolean;
  fromDate: string;
  toDate: string;
}

export interface OffsetResult {
  mode: 'offset';
  resultDate: string;
  longDate: string;
  weekday: string;
  startDate: string;
  dayCount: number;
  direction: DayDirection;
  includeStart: boolean;
  /** Calendar days actually added (negative means before). */
  appliedOffset: number;
  counting: 'exclusive' | 'inclusive';
}

export interface BetweenResult {
  mode: 'between';
  fromDate: string;
  toDate: string;
  includeStart: boolean;
  signedExclusive: number;
  signedCount: number;
  absoluteCount: number;
  counting: 'exclusive' | 'inclusive';
  weeks: number;
  leftoverDays: number;
}

export type HundredDayResult = OffsetResult | BetweenResult;

/**
 * Inclusive offset: the start date is day 1, so a positive count lands N−1 days later.
 * Exclusive offset: the start date is day 0, so the result is exactly N calendar days away.
 */
export function offsetForCount(dayCount: number, direction: DayDirection, includeStart: boolean): number {
  const magnitude = includeStart ? dayCount - 1 : dayCount;
  return direction === 'before' ? -magnitude : magnitude;
}

export function calculateOffset(input: Pick<HundredDayInput, 'startDate' | 'dayCount' | 'direction' | 'includeStart'>): OffsetResult {
  if (!parseIsoDate(input.startDate)) throw new Error('Invalid start date');
  if (!Number.isInteger(input.dayCount) || input.dayCount < 1 || input.dayCount > MAX_DAY_OFFSET) {
    throw new Error('Day count is out of range');
  }
  const appliedOffset = offsetForCount(input.dayCount, input.direction, input.includeStart);
  const resultDate = addCalendarDays(input.startDate, appliedOffset);
  return {
    mode: 'offset',
    resultDate,
    longDate: formatLongDate(resultDate),
    weekday: weekdayName(resultDate),
    startDate: input.startDate,
    dayCount: input.dayCount,
    direction: input.direction,
    includeStart: input.includeStart,
    appliedOffset,
    counting: input.includeStart ? 'inclusive' : 'exclusive',
  };
}

/**
 * Exclusive signed difference is To − From in calendar days.
 * Inclusive count includes both endpoints: same day is 1; otherwise exclusive difference plus its sign.
 */
export function calculateBetween(
  input: Pick<HundredDayInput, 'fromDate' | 'toDate' | 'includeStart'>
): BetweenResult {
  if (!parseIsoDate(input.fromDate) || !parseIsoDate(input.toDate)) throw new Error('Invalid date');
  const signedExclusive = diffCalendarDays(input.fromDate, input.toDate);
  let signedCount = signedExclusive;
  if (input.includeStart) {
    if (signedExclusive === 0) signedCount = 1;
    else signedCount = signedExclusive + Math.sign(signedExclusive);
  }
  const split = weeksAndDays(signedCount);
  return {
    mode: 'between',
    fromDate: input.fromDate,
    toDate: input.toDate,
    includeStart: input.includeStart,
    signedExclusive,
    signedCount,
    absoluteCount: Math.abs(signedCount),
    counting: input.includeStart ? 'inclusive' : 'exclusive',
    weeks: split.weeks,
    leftoverDays: split.days,
  };
}

export function calculateHundredDay(input: HundredDayInput): HundredDayResult {
  return input.mode === 'between' ? calculateBetween(input) : calculateOffset(input);
}
