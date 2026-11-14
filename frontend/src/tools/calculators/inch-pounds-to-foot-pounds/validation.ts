import {
  MAX_ABS_VALUE,
  type InchPoundsToFootPoundsFieldErrors,
  type InchPoundsToFootPoundsInput,
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

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
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

export function validateInchPoundsToFootPounds(input: InchPoundsToFootPoundsInput): {
  isValid: boolean;
  errors: InchPoundsToFootPoundsFieldErrors;
} {
  const errors: InchPoundsToFootPoundsFieldErrors = {};
  let blank = false;

  if (input.source === 'inlbf') {
    const state = torqueProblem(input.inlbf);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.inlbf = 'Enter a valid torque in inch-pounds.';
    else if (state === 'large') errors.inlbf = 'Enter a smaller absolute value.';
  } else {
    const state = torqueProblem(input.ftlbf);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.ftlbf = 'Enter a valid torque in foot-pounds.';
    else if (state === 'large') errors.ftlbf = 'Enter a smaller absolute value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
