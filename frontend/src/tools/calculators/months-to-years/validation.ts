import {
  MAX_ABS_VALUE,
  type MonthsToYearsFieldErrors,
  type MonthsToYearsInput,
} from './types';

export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    /e[+-]?$/i.test(cleaned)
  );
}

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function durationProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateMonthsToYears(input: MonthsToYearsInput): {
  isValid: boolean;
  errors: MonthsToYearsFieldErrors;
} {
  const errors: MonthsToYearsFieldErrors = {};
  let blank = false;

  if (input.source === 'months') {
    const state = durationProblem(input.months);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.months = 'Enter a valid number of months.';
    else if (state === 'large') errors.months = 'Enter a smaller absolute value.';
  } else if (input.source === 'years') {
    const state = durationProblem(input.years);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.years = 'Enter a valid number of years.';
    else if (state === 'large') errors.years = 'Enter a smaller absolute value.';
  } else {
    const yearsBlank = input.yearsPart === null;
    const monthsBlank = input.monthsPart === null;
    if (yearsBlank && monthsBlank) {
      blank = true;
    } else {
      if (!yearsBlank) {
        const state = durationProblem(input.yearsPart);
        if (state === 'bad') errors.yearsPart = 'Enter a valid years value.';
        else if (state === 'large') errors.yearsPart = 'Enter a smaller absolute value.';
      }
      if (!monthsBlank) {
        const state = durationProblem(input.monthsPart);
        if (state === 'bad') errors.monthsPart = 'Enter a valid months value.';
        else if (state === 'large') errors.monthsPart = 'Enter a smaller absolute value.';
      }
    }
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
