import {
  MAX_ABS_VALUE,
  type HoursToMinutesFieldErrors,
  type HoursToMinutesInput,
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

function durationProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

function applyError(
  errors: HoursToMinutesFieldErrors,
  field: keyof HoursToMinutesFieldErrors,
  state: ReturnType<typeof durationProblem>,
  labels: { bad: string; negative: string; large: string },
): boolean {
  if (state === 'blank') return true;
  if (state === 'bad') errors[field] = labels.bad;
  else if (state === 'negative') errors[field] = labels.negative;
  else if (state === 'large') errors[field] = labels.large;
  return false;
}

export function validateHoursToMinutes(input: HoursToMinutesInput): {
  isValid: boolean;
  errors: HoursToMinutesFieldErrors;
} {
  const errors: HoursToMinutesFieldErrors = {};
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
          negative: 'Hours cannot be negative.',
          large: 'Enter a smaller value.',
        });
      }
      if (m !== 'blank' && m !== 'ok') {
        applyError(errors, 'hmsMinutes', m, {
          bad: 'Enter a valid number of minutes.',
          negative: 'Minutes cannot be negative.',
          large: 'Enter a smaller value.',
        });
      }
      if (s !== 'blank' && s !== 'ok') {
        applyError(errors, 'hmsSeconds', s, {
          bad: 'Enter a valid number of seconds.',
          negative: 'Seconds cannot be negative.',
          large: 'Enter a smaller value.',
        });
      }
    }
  } else {
    const field = input.source;
    const value =
      field === 'hours' ? input.hours : field === 'minutes' ? input.minutes : input.seconds;
    blank = applyError(errors, field, durationProblem(value), {
      bad: 'Enter a valid duration.',
      negative: 'Duration cannot be negative.',
      large: 'Enter a smaller value.',
    });
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
