import {
  MAX_ABS_VALUE,
  type DistanceConverterInput,
  type DistanceFieldErrors,
} from './types';

/** Half-typed values such as `1.` stay incomplete so the source field is not overwritten. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.') ||
    cleaned.toLowerCase().endsWith('e') ||
    cleaned.toLowerCase().endsWith('e-') ||
    cleaned.toLowerCase().endsWith('e+')
  );
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function valueState(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateDistance(input: DistanceConverterInput): {
  isValid: boolean;
  errors: DistanceFieldErrors;
} {
  const errors: DistanceFieldErrors = {};
  const state = valueState(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[input.source] = 'Enter a valid non-negative distance.';
  } else if (state === 'negative') {
    errors[input.source] = 'Distance must be zero or positive.';
  } else if (state === 'large') {
    errors[input.source] = 'Enter a smaller finite value.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
