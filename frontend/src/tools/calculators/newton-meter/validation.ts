import {
  MAX_ABS_VALUE,
  type NewtonMeterFieldErrors,
  type NewtonMeterInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete. */
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
  const cleaned = raw.trim();
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function torqueProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateNewtonMeter(input: NewtonMeterInput): {
  isValid: boolean;
  errors: NewtonMeterFieldErrors;
} {
  const errors: NewtonMeterFieldErrors = {};
  let blank = false;

  if (input.source === 'first') {
    const state = torqueProblem(input.first);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.first = 'Enter a valid torque.';
    else if (state === 'large') errors.first = 'Enter a smaller absolute value.';
  } else {
    const state = torqueProblem(input.second);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.second = 'Enter a valid torque.';
    else if (state === 'large') errors.second = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
