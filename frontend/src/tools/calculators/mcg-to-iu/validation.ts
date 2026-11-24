import { calculateMcgToIu, getSubstanceOption } from './calculation';
import { MAX_ABS_VALUE, type McgToIuFieldErrors, type McgToIuInput, type McgToIuResult } from './types';

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

function quantityProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateMcgToIu(input: McgToIuInput): {
  isValid: boolean;
  errors: McgToIuFieldErrors;
  result: McgToIuResult | null;
} {
  const errors: McgToIuFieldErrors = {};

  try {
    getSubstanceOption(input.substance);
  } catch {
    errors.substance = 'Select a supported substance.';
    return { isValid: false, errors, result: null };
  }

  let blank = false;

  if (input.source === 'mass') {
    const state = quantityProblem(input.massMcg);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.massMcg = 'Enter a valid mass.';
    else if (state === 'negative') errors.massMcg = 'Mass cannot be negative.';
    else if (state === 'large') errors.massMcg = 'Enter a smaller value.';
  } else {
    const state = quantityProblem(input.iu);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.iu = 'Enter a valid IU amount.';
    else if (state === 'negative') errors.iu = 'IU cannot be negative.';
    else if (state === 'large') errors.iu = 'Enter a smaller value.';
  }

  const isValid = Object.keys(errors).length === 0 && !blank;
  return {
    isValid,
    errors,
    result: isValid ? calculateMcgToIu(input) : null,
  };
}
