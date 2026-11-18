import { resolveDensityKgPerM3 } from './calculation';
import { MAX_ABS_VALUE, type MlToKgFieldErrors, type MlToKgInput } from './types';

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

export function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (isIncompleteNumber(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

function numProblem(
  value: number | null,
  opts?: { requirePositive?: boolean },
): 'blank' | 'bad' | 'negative' | 'zero' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (opts?.requirePositive && value === 0) return 'zero';
  if (Math.abs(value) > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateMlToKg(input: MlToKgInput): {
  isValid: boolean;
  errors: MlToKgFieldErrors;
} {
  const errors: MlToKgFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityValue, { requirePositive: true });
  if (d === 'blank') {
    blank = true;
    errors.densityValue = 'Density is required to convert milliliters and kilograms.';
  } else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityValue = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

  if (!blank && !errors.densityValue && resolveDensityKgPerM3(input) == null) {
    errors.densityValue = 'Density is required to convert milliliters and kilograms.';
  }

  if (input.source === 'volume') {
    const v = numProblem(input.volumeValue);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volumeValue = 'Enter a valid volume.';
    else if (v === 'negative') errors.volumeValue = 'Volume cannot be negative.';
    else if (v === 'large') errors.volumeValue = 'Enter a smaller volume.';
  } else {
    const m = numProblem(input.massValue);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massValue = 'Enter a valid mass.';
    else if (m === 'negative') errors.massValue = 'Mass cannot be negative.';
    else if (m === 'large') errors.massValue = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
