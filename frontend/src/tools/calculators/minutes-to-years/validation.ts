import {
  MAX_ABS_VALUE,
  type MinutesToYearsFieldErrors,
  type MinutesToYearsInput,
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

function applyError(
  errors: MinutesToYearsFieldErrors,
  field: keyof MinutesToYearsFieldErrors,
  state: ReturnType<typeof durationProblem>,
  labels: { bad: string; large: string },
): boolean {
  if (state === 'blank') return true;
  if (state === 'bad') errors[field] = labels.bad;
  else if (state === 'large') errors[field] = labels.large;
  return false;
}

export function validateMinutesToYears(input: MinutesToYearsInput): {
  isValid: boolean;
  errors: MinutesToYearsFieldErrors;
} {
  const errors: MinutesToYearsFieldErrors = {};
  let blank = false;

  if (input.source === 'hms') {
    const h = durationProblem(input.hmsHours);
    const m = durationProblem(input.hmsMinutes);
    const s = durationProblem(input.hmsSeconds);
    if (h === 'blank' && m === 'blank' && s === 'blank') {
      blank = true;
    } else {
      if (h !== 'blank' && h !== 'ok') {
        applyError(errors, 'hmsHours', h, {
          bad: 'Enter a valid number of hours.',
          large: 'Enter a smaller value.',
        });
      }
      if (m !== 'blank' && m !== 'ok') {
        applyError(errors, 'hmsMinutes', m, {
          bad: 'Enter a valid number of minutes.',
          large: 'Enter a smaller value.',
        });
      }
      if (s !== 'blank' && s !== 'ok') {
        applyError(errors, 'hmsSeconds', s, {
          bad: 'Enter a valid number of seconds.',
          large: 'Enter a smaller value.',
        });
      }
    }
  } else {
    const field = input.source;
    const value =
      field === 'minutes'
        ? input.minutes
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
                  : input.seconds;
    blank = applyError(errors, field, durationProblem(value), {
      bad: 'Enter a valid duration.',
      large: 'Enter a smaller value.',
    });
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
