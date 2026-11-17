import { resolveDensityKgPerL } from './calculation';
import { MAX_ABS_VALUE, type GalToKgFieldErrors, type GalToKgInput } from './types';

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
  opts: { requirePositive?: boolean } = {},
): 'blank' | 'bad' | 'negative' | 'zero' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (opts.requirePositive && value === 0) return 'zero';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateGalToKg(input: GalToKgInput): {
  isValid: boolean;
  errors: GalToKgFieldErrors;
} {
  const errors: GalToKgFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityValue, { requirePositive: true });
  if (d === 'blank') blank = true;
  else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityValue = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

  if (!blank && Object.keys(errors).length === 0) {
    const density = resolveDensityKgPerL(input);
    if (density === null || !(density > 0)) {
      errors.densityValue = 'Enter a valid density greater than zero.';
    }
  }

  if (input.source === 'gallons') {
    const v = numProblem(input.gallons);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.gallons = 'Enter a valid volume.';
    else if (v === 'negative') errors.gallons = 'Volume cannot be negative.';
    else if (v === 'large') errors.gallons = 'Enter a smaller volume.';
  } else if (input.source === 'kg') {
    const m = numProblem(input.kg);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.kg = 'Enter a valid mass.';
    else if (m === 'negative') errors.kg = 'Mass cannot be negative.';
    else if (m === 'large') errors.kg = 'Enter a smaller mass.';
  } else {
    const m = numProblem(input.otherMass);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.otherMass = 'Enter a valid mass.';
    else if (m === 'negative') errors.otherMass = 'Mass cannot be negative.';
    else if (m === 'large') errors.otherMass = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
