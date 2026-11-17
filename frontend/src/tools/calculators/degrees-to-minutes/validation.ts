import {
  MAX_ABS_VALUE,
  type DegreesToMinutesFieldErrors,
  type DegreesToMinutesInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete so the source field is not overwritten. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.')
  );
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function finiteProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateDegreesToMinutes(input: DegreesToMinutesInput): {
  isValid: boolean;
  errors: DegreesToMinutesFieldErrors;
} {
  const errors: DegreesToMinutesFieldErrors = {};
  const state = finiteProblem(input.value);
  const field = input.source === 'degrees' ? 'degrees' : 'arcminutes';

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[field] =
      field === 'degrees'
        ? 'Enter a valid angle in degrees.'
        : 'Enter a valid angle in arcminutes.';
  } else if (state === 'large') {
    errors[field] = 'Enter a smaller finite value.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
