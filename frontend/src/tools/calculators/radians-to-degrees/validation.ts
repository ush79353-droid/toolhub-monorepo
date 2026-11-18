import {
  MAX_ABS_VALUE,
  type RadiansToDegreesFieldErrors,
  type RadiansToDegreesInput,
} from './types';

/** Half-typed values such as `1.` or `1e` stay incomplete. */
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

/**
 * Restricted π expressions (no eval): pi, π, 2pi, 2*pi, pi/2, 3*pi/2, −π/4, …
 * Returns null when blank/incomplete; NaN when invalid.
 */
export function parsePiExpression(raw: string): number | null {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/π/g, 'pi')
    .replace(/\s+/g, '');
  if (!cleaned.includes('pi')) return null;

  const match =
    /^([+-])?(?:(\d+(?:\.\d+)?|\.\d+)\*?)?pi(?:\/(\d+(?:\.\d+)?|\.\d+))?$/.exec(
      cleaned,
    );
  if (!match) return Number.NaN;

  const sign = match[1] === '-' ? -1 : 1;
  const coef = match[2] ? Number(match[2]) : 1;
  const denom = match[3] ? Number(match[3]) : 1;
  if (!Number.isFinite(coef) || !Number.isFinite(denom) || denom === 0) {
    return Number.NaN;
  }
  return (sign * coef * Math.PI) / denom;
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;

  const piValue = parsePiExpression(cleaned);
  if (piValue !== null) {
    return Number.isFinite(piValue) ? piValue : Number.NaN;
  }

  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function finiteProblem(value: number | null): 'blank' | 'bad' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateRadiansToDegrees(input: RadiansToDegreesInput): {
  isValid: boolean;
  errors: RadiansToDegreesFieldErrors;
} {
  const errors: RadiansToDegreesFieldErrors = {};
  const state = finiteProblem(input.value);
  const field = input.source;

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[field] = 'Enter a valid finite angle.';
  } else if (state === 'large') {
    errors[field] = 'Enter a smaller finite value.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
