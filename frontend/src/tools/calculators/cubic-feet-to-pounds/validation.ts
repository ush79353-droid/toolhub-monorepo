import { resolveDensityLbPerFt3 } from './calculation';
import {
  MAX_ABS_VALUE,
  type CubicFeetToPoundsFieldErrors,
  type CubicFeetToPoundsInput,
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

export function validateCubicFeetToPounds(input: CubicFeetToPoundsInput): {
  isValid: boolean;
  errors: CubicFeetToPoundsFieldErrors;
} {
  const errors: CubicFeetToPoundsFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityValue, { requirePositive: true });
  if (d === 'blank') {
    blank = true;
    errors.densityValue = 'Density is required to convert cubic feet and pounds.';
  } else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityValue = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

  if (!blank && !errors.densityValue) {
    const factor = resolveDensityLbPerFt3(input);
    if (factor === null || !(factor > 0)) {
      errors.densityValue = 'Density is required to convert cubic feet and pounds.';
    }
  }

  if (input.source === 'cubicFeet') {
    const v = numProblem(input.cubicFeet);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.cubicFeet = 'Enter a valid volume in cubic feet.';
    else if (v === 'negative') errors.cubicFeet = 'Volume cannot be negative.';
    else if (v === 'large') errors.cubicFeet = 'Enter a smaller volume.';
  } else {
    const m = numProblem(input.pounds);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.pounds = 'Enter a valid mass in pounds.';
    else if (m === 'negative') errors.pounds = 'Mass cannot be negative.';
    else if (m === 'large') errors.pounds = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
