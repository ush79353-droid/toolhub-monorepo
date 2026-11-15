import type { HundredDayInput } from './calculation';

export const PLACEHOLDER_START = '2026-01-01';

export function createDefaultHundredDayInput(startDate: string): HundredDayInput {
  return {
    mode: 'offset',
    startDate,
    dayCount: 100,
    direction: 'after',
    includeStart: false,
    fromDate: startDate,
    toDate: startDate,
  };
}
