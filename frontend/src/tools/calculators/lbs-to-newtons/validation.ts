import { MAX_ABS_VALUE, type LbsToNewtonsFieldErrors, type LbsToNewtonsInput } from './types';

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

function validateSignedForce(
  value: number | null,
  field: 'lbf' | 'newtons',
  label: string,
  errors: LbsToNewtonsFieldErrors
): void {
  if (value === null) return;
  if (!Number.isFinite(value)) {
    errors[field] = `Enter a valid ${label}.`;
  } else if (Math.abs(value) > MAX_ABS_VALUE) {
    errors[field] = `Enter a smaller absolute ${label}.`;
  }
}

export function validateLbsToNewtons(input: LbsToNewtonsInput): {
  isValid: boolean;
  errors: LbsToNewtonsFieldErrors;
} {
  const errors: LbsToNewtonsFieldErrors = {};

  if (input.source === 'lbf') {
    if (input.lbf === null) {
      return { isValid: false, errors };
    }
    validateSignedForce(input.lbf, 'lbf', 'force in pounds-force', errors);
  } else {
    if (input.newtons === null) {
      return { isValid: false, errors };
    }
    validateSignedForce(input.newtons, 'newtons', 'force in newtons', errors);
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
