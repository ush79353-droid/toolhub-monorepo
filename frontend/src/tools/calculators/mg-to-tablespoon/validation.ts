import { resolveDensityGPerMl } from './calculation';
import { MAX_ABS_VALUE, type MgToTablespoonFieldErrors, type MgToTablespoonInput } from './types';

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

export function validateMgToTablespoon(input: MgToTablespoonInput): {
  isValid: boolean;
  errors: MgToTablespoonFieldErrors;
} {
  const errors: MgToTablespoonFieldErrors = {};
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

  if (input.source === 'milligrams') {
    const m = numProblem(input.milligrams);
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.milligrams = 'Enter a valid mass in milligrams.';
    else if (m === 'negative') errors.milligrams = 'Mass cannot be negative.';
    else if (m === 'large') errors.milligrams = 'Enter a smaller mass.';
  } else {
    const v = numProblem(input.tablespoons);
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.tablespoons = 'Enter a valid volume in tablespoons.';
    else if (v === 'negative') errors.tablespoons = 'Volume cannot be negative.';
    else if (v === 'large') errors.tablespoons = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
