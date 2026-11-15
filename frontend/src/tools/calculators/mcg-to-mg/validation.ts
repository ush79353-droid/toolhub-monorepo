import { MAX_ABS_VALUE, type McgToMgFieldErrors, type McgToMgInput } from './types';

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

function massProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateMcgToMg(input: McgToMgInput): {
  isValid: boolean;
  errors: McgToMgFieldErrors;
} {
  const errors: McgToMgFieldErrors = {};
  let blank = false;

  if (input.source === 'mcg') {
    const state = massProblem(input.mcg);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.mcg = 'Enter a valid number of micrograms.';
    else if (state === 'negative') errors.mcg = 'Mass cannot be negative.';
    else if (state === 'large') errors.mcg = 'Enter a smaller value.';
  } else {
    const state = massProblem(input.mg);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.mg = 'Enter a valid number of milligrams.';
    else if (state === 'negative') errors.mg = 'Mass cannot be negative.';
    else if (state === 'large') errors.mg = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
