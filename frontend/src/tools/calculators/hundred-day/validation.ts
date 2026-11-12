import { MAX_DAY_OFFSET, parseIsoDate } from './dates';
import type { HundredDayInput } from './calculation';

export function validateHundredDay(input: HundredDayInput): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (input.mode !== 'offset' && input.mode !== 'between') {
    errors.mode = 'Choose a calculation mode';
  }
  if (input.mode === 'offset') {
    if (!parseIsoDate(input.startDate)) errors.startDate = 'Enter a real calendar date';
    if (!Number.isInteger(input.dayCount)) errors.dayCount = 'Day count must be a whole number';
    else if (input.dayCount < 1 || input.dayCount > MAX_DAY_OFFSET) {
      errors.dayCount = `Enter a whole number from 1 to ${MAX_DAY_OFFSET.toLocaleString('en-US')}`;
    }
    if (input.direction !== 'after' && input.direction !== 'before') {
      errors.direction = 'Choose days after or days before';
    }
  } else {
    if (!parseIsoDate(input.fromDate)) errors.fromDate = 'Enter a real from date';
    if (!parseIsoDate(input.toDate)) errors.toDate = 'Enter a real to date';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}
