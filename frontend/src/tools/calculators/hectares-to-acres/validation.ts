import { MAX_ABS_VALUE, type HectaresToAcresFieldErrors, type HectaresToAcresInput } from './types';

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

function numProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateHectaresToAcres(input: HectaresToAcresInput): {
  isValid: boolean;
  errors: HectaresToAcresFieldErrors;
} {
  const errors: HectaresToAcresFieldErrors = {};
  let blank = false;

  if (input.source === 'hectares') {
    const h = numProblem(input.hectares);
    if (h === 'blank') blank = true;
    else if (h === 'bad') errors.hectares = 'Enter a valid area.';
    else if (h === 'negative') errors.hectares = 'Area cannot be negative.';
    else if (h === 'large') errors.hectares = 'Enter a smaller area.';
  } else {
    const a = numProblem(input.acres);
    if (a === 'blank') blank = true;
    else if (a === 'bad') errors.acres = 'Enter a valid area.';
    else if (a === 'negative') errors.acres = 'Area cannot be negative.';
    else if (a === 'large') errors.acres = 'Enter a smaller area.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
