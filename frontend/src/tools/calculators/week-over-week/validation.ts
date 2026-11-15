import { calculateWeekOverWeek } from './calculation';
import type {
  WeekOverWeekFieldErrors,
  WeekOverWeekInput,
  WeekOverWeekResult,
} from './types';

function parseNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function validateWeekOverWeekInput(input: WeekOverWeekInput): {
  isValid: boolean;
  errors: WeekOverWeekFieldErrors;
  result: WeekOverWeekResult | null;
} {
  const errors: WeekOverWeekFieldErrors = {};

  const initialWeek = parseNumber(input.initialWeek);
  const followingWeek = parseNumber(input.followingWeek);

  if (initialWeek === null || followingWeek === null) {
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(initialWeek)) {
    errors.initialWeek = 'Enter a valid initial week value.';
  } else if (initialWeek === 0) {
    errors.initialWeek = 'Initial week value must be nonzero.';
  }

  if (Number.isNaN(followingWeek)) {
    errors.followingWeek = 'Enter a valid following week value.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateWeekOverWeek({
    initialWeek: initialWeek!,
    followingWeek: followingWeek!,
  });

  if (!result) {
    errors.form = 'Unable to calculate week-over-week growth for these inputs.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors, result };
}
