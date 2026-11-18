import { resolveDensityKgPerM3 } from './calculation';
import {
  MAX_ABS_VALUE,
  type CubicMeterToTonFieldErrors,
  type CubicMeterToTonInput,
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

export function validateCubicMeterToTon(input: CubicMeterToTonInput): {
  isValid: boolean;
  errors: CubicMeterToTonFieldErrors;
} {
  const errors: CubicMeterToTonFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityValue, { requirePositive: true });
  if (d === 'blank') {
    blank = true;
    errors.densityValue = 'Density is required to convert cubic meters and tons.';
  } else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityValue = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

  if (!blank && !errors.densityValue) {
    const factor = resolveDensityKgPerM3(input);
    if (factor === null || !(factor > 0)) {
      errors.densityValue = 'Density is required to convert cubic meters and tons.';
    }
  }

  if (input.source === 'volume') {
    const v = numProblem(input.volumeM3);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volumeM3 = 'Enter a valid volume in cubic meters.';
    else if (v === 'negative') errors.volumeM3 = 'Volume cannot be negative.';
    else if (v === 'large') errors.volumeM3 = 'Enter a smaller volume.';
  } else {
    const m = numProblem(input.massTons);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massTons = 'Enter a valid mass in tons.';
    else if (m === 'negative') errors.massTons = 'Mass cannot be negative.';
    else if (m === 'large') errors.massTons = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
