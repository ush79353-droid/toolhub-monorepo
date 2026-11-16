import { MAX_ABS_VALUE, type BarToPsiFieldErrors, type BarToPsiInput } from './types';

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

function pressureProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateBarToPsi(input: BarToPsiInput): {
  isValid: boolean;
  errors: BarToPsiFieldErrors;
} {
  const errors: BarToPsiFieldErrors = {};
  let blank = false;

  if (input.source === 'primary') {
    const state = pressureProblem(input.primary);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.primary = 'Enter a valid pressure.';
    else if (state === 'negative') {
      errors.primary =
        'Absolute pressure cannot be negative. Negative values are gauge differentials — use a dedicated gauge workflow.';
    } else if (state === 'large') errors.primary = 'Enter a smaller value.';
  } else {
    const state = pressureProblem(input.secondary);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.secondary = 'Enter a valid pressure.';
    else if (state === 'negative') {
      errors.secondary =
        'Absolute pressure cannot be negative. Negative values are gauge differentials — use a dedicated gauge workflow.';
    } else if (state === 'large') errors.secondary = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
