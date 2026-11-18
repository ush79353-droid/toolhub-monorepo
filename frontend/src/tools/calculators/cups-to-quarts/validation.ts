import { MAX_ABS_VALUE, type CupsToQuartsFieldErrors, type CupsToQuartsInput } from './types';

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

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function volumeProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateCupsToQuarts(input: CupsToQuartsInput): {
  isValid: boolean;
  errors: CupsToQuartsFieldErrors;
} {
  const errors: CupsToQuartsFieldErrors = {};
  const key = input.source === 'cups' ? 'cups' : 'quarts';
  const state = volumeProblem(input.value);

  if (state === 'blank') {
    return { isValid: false, errors };
  }
  if (state === 'bad') {
    errors[key] =
      input.source === 'cups'
        ? 'Enter a valid volume in cups.'
        : 'Enter a valid volume in quarts.';
  } else if (state === 'negative') {
    errors[key] = 'Volume cannot be negative.';
  } else if (state === 'large') {
    errors[key] = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
