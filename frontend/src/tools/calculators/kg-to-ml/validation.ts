import { resolveDensityKgPerM3 } from './calculation';
import { MAX_ABS_VALUE, type KgToMlFieldErrors, type KgToMlInput } from './types';

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

export function validateKgToMl(input: KgToMlInput): {
  isValid: boolean;
  errors: KgToMlFieldErrors;
} {
  const errors: KgToMlFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityValue, { requirePositive: true });
  if (d === 'blank') {
    blank = true;
    errors.densityValue = 'Density is required to convert kilograms and milliliters.';
  } else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityValue = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

  if (!blank && !errors.densityValue) {
    const factor = resolveDensityKgPerM3(input);
    if (factor === null || !(factor > 0)) {
      errors.densityValue = 'Density is required to convert kilograms and milliliters.';
    }
  }

  if (input.source === 'mass') {
    const m = numProblem(input.massKg);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massKg = 'Enter a valid mass in kilograms.';
    else if (m === 'negative') errors.massKg = 'Mass cannot be negative.';
    else if (m === 'large') errors.massKg = 'Enter a smaller mass.';
  } else {
    const v = numProblem(input.volumeMl);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volumeMl = 'Enter a valid volume in milliliters.';
    else if (v === 'negative') errors.volumeMl = 'Volume cannot be negative.';
    else if (v === 'large') errors.volumeMl = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
