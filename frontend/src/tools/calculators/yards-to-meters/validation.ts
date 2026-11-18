import {
  MAX_ABS_VALUE,
  type YardsToMetersFieldErrors,
  type YardsToMetersInput,
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

function lengthProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateYardsToMeters(input: YardsToMetersInput): {
  isValid: boolean;
  errors: YardsToMetersFieldErrors;
} {
  const errors: YardsToMetersFieldErrors = {};
  let blank = false;

  if (input.source === 'yards') {
    const state = lengthProblem(input.yards);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.yards = 'Enter a valid length in yards.';
    else if (state === 'negative') errors.yards = 'Enter a non-negative length.';
    else if (state === 'large') errors.yards = 'Enter a smaller absolute value.';
  } else {
    const state = lengthProblem(input.meters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.meters = 'Enter a valid length in meters.';
    else if (state === 'negative') errors.meters = 'Enter a non-negative length.';
    else if (state === 'large') errors.meters = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
