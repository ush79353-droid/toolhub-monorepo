import {
  MAX_ABS_VALUE,
  type SecondsToMinutesFieldErrors,
  type SecondsToMinutesInput,
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

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
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

export function validateSecondsToMinutes(input: SecondsToMinutesInput): {
  isValid: boolean;
  errors: SecondsToMinutesFieldErrors;
} {
  const errors: SecondsToMinutesFieldErrors = {};
  const state = durationProblem(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[input.source] = 'Enter a valid finite duration.';
  } else if (state === 'large') {
    errors[input.source] = 'Enter a smaller finite value.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
