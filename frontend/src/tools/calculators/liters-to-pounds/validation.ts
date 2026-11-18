import { resolveDensityKgPerL } from './calculation';
import {
  MAX_ABS_VALUE,
  type LitersToPoundsFieldErrors,
  type LitersToPoundsInput,
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

/** Blank and incomplete drafts become null. Any other non-number becomes NaN. */
export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function numProblem(
  value: number | null,
  opts: { requirePositive?: boolean } = {},
): 'blank' | 'bad' | 'negative' | 'zero' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (opts.requirePositive && value === 0) return 'zero';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateLitersToPounds(input: LitersToPoundsInput): {
  isValid: boolean;
  errors: LitersToPoundsFieldErrors;
} {
  const errors: LitersToPoundsFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityValue, { requirePositive: true });
  if (d === 'blank') {
    blank = true;
    errors.densityValue = 'Density is required to convert liters and pounds.';
  } else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityValue = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

  if (!blank && !errors.densityValue) {
    const factor = resolveDensityKgPerL(input);
    if (factor === null || !(factor > 0)) {
      errors.densityValue = 'Density is required to convert liters and pounds.';
    }
  }

  if (input.source === 'liters') {
    const v = numProblem(input.liters);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.liters = 'Enter a valid volume in liters.';
    else if (v === 'negative') errors.liters = 'Volume cannot be negative.';
    else if (v === 'large') errors.liters = 'Enter a smaller volume.';
  } else {
    const m = numProblem(input.pounds);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.pounds = 'Enter a valid mass in pounds.';
    else if (m === 'negative') errors.pounds = 'Mass cannot be negative.';
    else if (m === 'large') errors.pounds = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
