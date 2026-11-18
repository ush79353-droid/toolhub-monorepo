import { MAX_ABS_VALUE, type MsToSecondsFieldErrors, type MsToSecondsInput } from './types';

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

export function validateMsToSeconds(input: MsToSecondsInput): {
  isValid: boolean;
  errors: MsToSecondsFieldErrors;
} {
  const errors: MsToSecondsFieldErrors = {};
  let blank = false;

  if (input.source === 'hms') {
    const h = durationProblem(input.hmsHours);
    const m = durationProblem(input.hmsMinutes);
    const s = durationProblem(input.hmsSeconds);
    if (h === 'blank' && m === 'blank' && s === 'blank') {
      blank = true;
    } else {
      if (h === 'bad') errors.hmsHours = 'Enter a valid number of hours.';
      else if (h === 'large') errors.hmsHours = 'Enter a smaller absolute value.';
      if (m === 'bad') errors.hmsMinutes = 'Enter a valid number of minutes.';
      else if (m === 'large') errors.hmsMinutes = 'Enter a smaller absolute value.';
      if (s === 'bad') errors.hmsSeconds = 'Enter a valid number of seconds.';
      else if (s === 'large') errors.hmsSeconds = 'Enter a smaller absolute value.';
    }
  } else {
    const field = input.source;
    const value =
      field === 'milliseconds'
        ? input.milliseconds
        : field === 'seconds'
          ? input.seconds
          : field === 'years'
            ? input.years
            : field === 'months'
              ? input.months
              : field === 'weeks'
                ? input.weeks
                : field === 'days'
                  ? input.days
                  : field === 'hours'
                    ? input.hours
                    : input.minutes;
    const state = durationProblem(value);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors[field] = 'Enter a valid finite duration.';
    else if (state === 'large') errors[field] = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
