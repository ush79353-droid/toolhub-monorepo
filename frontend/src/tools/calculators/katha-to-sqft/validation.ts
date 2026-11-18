import {
  MAX_ABS_VALUE,
  type KathaAreaSource,
  type KathaToSqftFieldErrors,
  type KathaToSqftInput,
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

function areaProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateKathaToSqft(input: KathaToSqftInput): {
  isValid: boolean;
  errors: KathaToSqftFieldErrors;
} {
  const errors: KathaToSqftFieldErrors = {};
  let blank = false;

  const field = input.source;
  const value = input[field];
  const labels: Record<KathaAreaSource, string> = {
    katha: 'katha',
    ft2: 'square feet',
    m2: 'square meters',
  };

  const state = areaProblem(value);
  if (state === 'blank') blank = true;
  else if (state === 'bad') errors[field] = `Enter a valid number of ${labels[field]}.`;
  else if (state === 'negative') errors[field] = 'Area cannot be negative.';
  else if (state === 'large') errors[field] = 'Enter a smaller value.';

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
