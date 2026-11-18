import { resolveDensityKgPerL } from './calculation';
import { MAX_ABS_VALUE, type KgToLiterFieldErrors, type KgToLiterInput } from './types';

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

export function validateKgToLiter(input: KgToLiterInput): {
  isValid: boolean;
  errors: KgToLiterFieldErrors;
} {
  const errors: KgToLiterFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityValue, { requirePositive: true });
  if (d === 'blank') {
    blank = true;
    errors.densityValue = 'Density is required to convert kilograms and liters.';
  } else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityValue = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

  if (!blank && !errors.densityValue) {
    const factor = resolveDensityKgPerL(input);
    if (factor === null || !(factor > 0)) {
      errors.densityValue = 'Density is required to convert kilograms and liters.';
    }
  }

  if (input.source === 'mass') {
    const m = numProblem(input.massKg);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massKg = 'Enter a valid mass in kilograms.';
    else if (m === 'negative') errors.massKg = 'Mass cannot be negative.';
    else if (m === 'large') errors.massKg = 'Enter a smaller mass.';
  } else {
    const v = numProblem(input.volumeL);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volumeL = 'Enter a valid volume in liters.';
    else if (v === 'negative') errors.volumeL = 'Volume cannot be negative.';
    else if (v === 'large') errors.volumeL = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
