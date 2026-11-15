import {
  MAX_ABS_VALUE,
  type DecimeterToMeterFieldErrors,
  type DecimeterToMeterInput,
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
    /e[+-]?$/i.test(cleaned)
  );
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function lengthProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

/** Signed lengths allowed, matching Length Converter / feet-to-inches. */
export function validateDecimeterToMeter(input: DecimeterToMeterInput): {
  isValid: boolean;
  errors: DecimeterToMeterFieldErrors;
} {
  const errors: DecimeterToMeterFieldErrors = {};
  let blank = false;

  if (input.source === 'decimeters') {
    const state = lengthProblem(input.decimeters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.decimeters = 'Enter a valid number of decimeters.';
    else if (state === 'large') errors.decimeters = 'Enter a smaller value.';
  } else {
    const state = lengthProblem(input.meters);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.meters = 'Enter a valid number of meters.';
    else if (state === 'large') errors.meters = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
