import {
  MAX_ABS_VALUE,
  type YardsToAcresFieldErrors,
  type YardsToAcresInput,
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

function areaProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateYardsToAcres(input: YardsToAcresInput): {
  isValid: boolean;
  errors: YardsToAcresFieldErrors;
} {
  const errors: YardsToAcresFieldErrors = {};
  let blank = false;

  if (input.source === 'squareYards') {
    const state = areaProblem(input.squareYards);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.squareYards = 'Enter a valid number of square yards.';
    else if (state === 'negative') errors.squareYards = 'Area cannot be negative.';
    else if (state === 'large') errors.squareYards = 'Enter a smaller value.';
  } else {
    const state = areaProblem(input.acres);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.acres = 'Enter a valid number of acres.';
    else if (state === 'negative') errors.acres = 'Area cannot be negative.';
    else if (state === 'large') errors.acres = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
