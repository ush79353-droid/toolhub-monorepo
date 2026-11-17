import {
  MAX_ABS_VALUE,
  type AreaFieldErrors,
  type AreaInput,
  type LengthFieldErrors,
  type LengthInput,
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

function areaProblem(
  value: number | null,
): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateArea(input: AreaInput): {
  isValid: boolean;
  errors: AreaFieldErrors;
} {
  const errors: AreaFieldErrors = {};
  let blank = false;

  if (input.source === 'gaj') {
    const state = areaProblem(input.gaj);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.gaj = 'Enter a valid area in gaj.';
    else if (state === 'negative') errors.gaj = 'Land area cannot be negative.';
    else if (state === 'large') errors.gaj = 'Enter a smaller area.';
  } else {
    const state = areaProblem(input.squareYards);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.squareYards = 'Enter a valid area in square yards.';
    else if (state === 'negative') errors.squareYards = 'Land area cannot be negative.';
    else if (state === 'large') errors.squareYards = 'Enter a smaller area.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}

export function validateLength(input: LengthInput): {
  isValid: boolean;
  errors: LengthFieldErrors;
} {
  const errors: LengthFieldErrors = {};
  let blank = false;

  if (input.source === 'linearGaj') {
    const state = areaProblem(input.linearGaj);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.linearGaj = 'Enter a valid length in gaj.';
    else if (state === 'negative') errors.linearGaj = 'Length cannot be negative.';
    else if (state === 'large') errors.linearGaj = 'Enter a smaller length.';
  } else {
    const state = areaProblem(input.yards);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.yards = 'Enter a valid length in yards.';
    else if (state === 'negative') errors.yards = 'Length cannot be negative.';
    else if (state === 'large') errors.yards = 'Enter a smaller length.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
