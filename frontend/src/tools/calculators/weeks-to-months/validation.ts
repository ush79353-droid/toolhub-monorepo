import {
  MAX_ABS_VALUE,
  type WeeksToMonthsFieldErrors,
  type WeeksToMonthsInput,
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

function durationProblem(
  value: number | null,
): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

function applyFieldError(
  errors: WeeksToMonthsFieldErrors,
  field: keyof WeeksToMonthsFieldErrors,
  state: ReturnType<typeof durationProblem>,
): boolean {
  if (state === 'blank') return true;
  if (state === 'bad') errors[field] = 'Enter a valid finite duration.';
  else if (state === 'negative') errors[field] = 'Duration cannot be negative.';
  else if (state === 'large') errors[field] = 'Enter a smaller duration.';
  return false;
}

export function validateWeeksToMonths(input: WeeksToMonthsInput): {
  isValid: boolean;
  errors: WeeksToMonthsFieldErrors;
} {
  const errors: WeeksToMonthsFieldErrors = {};
  let blank = false;

  if (input.source === 'hms') {
    const h = durationProblem(input.hmsHours);
    const m = durationProblem(input.hmsMinutes);
    const s = durationProblem(input.hmsSeconds);
    if (h === 'blank' && m === 'blank' && s === 'blank') {
      blank = true;
    } else {
      if (h === 'bad') errors.hmsHours = 'Enter a valid number of hours.';
      else if (h === 'negative') errors.hmsHours = 'Duration cannot be negative.';
      else if (h === 'large') errors.hmsHours = 'Enter a smaller duration.';
      if (m === 'bad') errors.hmsMinutes = 'Enter a valid number of minutes.';
      else if (m === 'negative') errors.hmsMinutes = 'Duration cannot be negative.';
      else if (m === 'large') errors.hmsMinutes = 'Enter a smaller duration.';
      if (s === 'bad') errors.hmsSeconds = 'Enter a valid number of seconds.';
      else if (s === 'negative') errors.hmsSeconds = 'Duration cannot be negative.';
      else if (s === 'large') errors.hmsSeconds = 'Enter a smaller duration.';
    }
  } else {
    const field = input.source;
    const value =
      field === 'weeks'
        ? input.weeks
        : field === 'months'
          ? input.months
          : field === 'years'
            ? input.years
            : field === 'days'
              ? input.days
              : field === 'hours'
                ? input.hours
                : field === 'minutes'
                  ? input.minutes
                  : input.seconds;
    blank = applyFieldError(errors, field, durationProblem(value));
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
