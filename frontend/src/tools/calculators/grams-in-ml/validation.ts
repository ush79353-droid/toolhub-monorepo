import { resolveDensityGPerMl } from './calculation';
import { MAX_ABS_VALUE, type GramsInMlFieldErrors, type GramsInMlInput } from './types';

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

export function validateGramsInMl(input: GramsInMlInput): {
  isValid: boolean;
  errors: GramsInMlFieldErrors;
} {
  const errors: GramsInMlFieldErrors = {};
  let blank = false;

  const d = numProblem(input.densityValue, { requirePositive: true });
  if (d === 'blank') blank = true;
  else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
  else if (d === 'negative' || d === 'zero') {
    errors.densityValue = 'Density must be greater than zero.';
  } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';

  if (!blank && Object.keys(errors).length === 0) {
    const density = resolveDensityGPerMl(input);
    if (density === null || !(density > 0)) {
      errors.densityValue = 'Enter a valid density greater than zero.';
    }
  }

  if (input.source === 'mass') {
    const m = numProblem(input.mass);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.mass = 'Enter a valid mass.';
    else if (m === 'negative') errors.mass = 'Mass cannot be negative.';
    else if (m === 'large') errors.mass = 'Enter a smaller mass.';
  } else {
    const v = numProblem(input.volume);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volume = 'Enter a valid volume.';
    else if (v === 'negative') errors.volume = 'Volume cannot be negative.';
    else if (v === 'large') errors.volume = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
