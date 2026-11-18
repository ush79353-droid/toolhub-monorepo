import {
  MAX_ABS_VALUE,
  type LbsToStoneFieldErrors,
  type LbsToStoneInput,
} from './types';

/** Half-typed values such as `1.` stay incomplete so the source field is not overwritten. */
export function isIncompleteNumber(raw: string): boolean {
  const cleaned = raw.trim();
  return (
    cleaned === '' ||
    cleaned === '.' ||
    cleaned === '-' ||
    cleaned === '-.' ||
    cleaned.endsWith('.')
  );
}

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function weightProblem(value: number | null): 'blank' | 'bad' | 'negative' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateLbsToStone(input: LbsToStoneInput): {
  isValid: boolean;
  errors: LbsToStoneFieldErrors;
} {
  const errors: LbsToStoneFieldErrors = {};
  let blank = false;

  if (input.source === 'pounds') {
    const state = weightProblem(input.pounds);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.pounds = 'Enter a valid number of pounds.';
    else if (state === 'negative') errors.pounds = 'Weight cannot be negative.';
    else if (state === 'large') errors.pounds = 'Enter a smaller value.';
  } else {
    const state = weightProblem(input.stones);
    if (state === 'blank') blank = true;
    else if (state === 'bad') errors.stones = 'Enter a valid number of stones.';
    else if (state === 'negative') errors.stones = 'Weight cannot be negative.';
    else if (state === 'large') errors.stones = 'Enter a smaller value.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
