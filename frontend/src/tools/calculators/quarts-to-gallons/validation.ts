import {
  MAX_ABS_VALUE,
  type QuartsToGallonsFieldErrors,
  type QuartsToGallonsInput,
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

function volumeProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateQuartsToGallons(input: QuartsToGallonsInput): {
  isValid: boolean;
  errors: QuartsToGallonsFieldErrors;
} {
  const errors: QuartsToGallonsFieldErrors = {};
  const state = volumeProblem(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[input.source] = 'Enter a valid volume.';
  } else if (state === 'negative') {
    errors[input.source] = 'Volume cannot be negative.';
  } else if (state === 'large') {
    errors[input.source] = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
