import { resolveDensityGPerCm3 } from './calculation';
import { MAX_ABS_VALUE, type CcToGramsFieldErrors, type CcToGramsInput } from './types';

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

export function validateCcToGrams(input: CcToGramsInput): {
  isValid: boolean;
  errors: CcToGramsFieldErrors;
} {
  const errors: CcToGramsFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityValue, { requirePositive: true });
  if (d === 'blank') blank = true;
  else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityValue = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

  if (!blank && Object.keys(errors).length === 0) {
    const density = resolveDensityGPerCm3(input);
    if (density === null || !(density > 0)) {
      errors.densityValue = 'Enter a valid density greater than zero.';
    }
  }

  if (input.source === 'volume') {
    const v = numProblem(input.volumeCc);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volumeCc = 'Enter a valid volume.';
    else if (v === 'negative') errors.volumeCc = 'Volume cannot be negative.';
    else if (v === 'large') errors.volumeCc = 'Enter a smaller volume.';
  } else {
    const m = numProblem(input.massG);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massG = 'Enter a valid mass.';
    else if (m === 'negative') errors.massG = 'Mass cannot be negative.';
    else if (m === 'large') errors.massG = 'Enter a smaller mass.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
