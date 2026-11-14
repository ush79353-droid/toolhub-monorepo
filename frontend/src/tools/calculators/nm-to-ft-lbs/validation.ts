import {
  MAX_ABS_VALUE,
  type NmToFtLbsFieldErrors,
  type NmToFtLbsInput,
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

/** Signed torque is allowed (direction). */
function torqueProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateNmToFtLbs(input: NmToFtLbsInput): {
  isValid: boolean;
  errors: NmToFtLbsFieldErrors;
} {
  const errors: NmToFtLbsFieldErrors = {};
  let blank = false;

  if (input.source === 'nm') {
    const state = torqueProblem(input.nm);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.nm = 'Enter a valid torque in newton-meters.';
    else if (state === 'large') errors.nm = 'Enter a smaller absolute value.';
  } else {
    const state = torqueProblem(input.ftlbf);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.ftlbf = 'Enter a valid torque in foot-pounds.';
    else if (state === 'large') errors.ftlbf = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
