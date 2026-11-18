import { resolveFactorMgPerMl } from './calculation';
import { MAX_ABS_VALUE, type MgToCcFieldErrors, type MgToCcInput } from './types';

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
  opts: { allowZero: boolean; requirePositive?: boolean } = { allowZero: true },
): 'blank' | 'bad' | 'negative' | 'zero' | 'large' | 'ok' {
  if (value === null) return 'blank';
  if (!Number.isFinite(value)) return 'bad';
  if (value < 0) return 'negative';
  if (opts.requirePositive && value === 0) return 'zero';
  if (!opts.allowZero && value === 0) return 'zero';
  if (value > MAX_ABS_VALUE) return 'large';
  return 'ok';
}

export function validateMgToCc(input: MgToCcInput): {
  isValid: boolean;
  errors: MgToCcFieldErrors;
} {
  const errors: MgToCcFieldErrors = {};
  let blank = false;

  if (input.mode === 'substance') {
    if (input.substance === 'custom') {
      const d = numProblem(input.densityValue, { allowZero: false, requirePositive: true });
      if (d === 'blank') blank = true;
      else if (d === 'bad') errors.densityValue = 'Enter a valid density.';
      else if (d === 'negative' || d === 'zero') {
        errors.densityValue = 'Enter a density greater than zero.';
      } else if (d === 'large') errors.densityValue = 'Enter a smaller density.';
    }
  } else {
    const c = numProblem(input.concentrationValue, {
      allowZero: false,
      requirePositive: true,
    });
    if (c === 'blank') blank = true;
    else if (c === 'bad') errors.concentrationValue = 'Enter a valid concentration.';
    else if (c === 'negative' || c === 'zero') {
      errors.concentrationValue = 'Enter a concentration greater than zero.';
    } else if (c === 'large') errors.concentrationValue = 'Enter a smaller concentration.';
  }

  if (!blank && Object.keys(errors).length === 0) {
    const factor = resolveFactorMgPerMl(input);
    if (factor === null || !(factor > 0)) {
      if (input.mode === 'substance') {
        errors.densityValue = 'Density is required to convert mg and cc.';
      } else {
        errors.concentrationValue = 'Concentration is required to convert mg and cc.';
      }
    }
  }

  if (input.source === 'mass') {
    const m = numProblem(input.massMg, { allowZero: true });
    if (m === 'blank') blank = true;
    else if (m === 'bad') errors.massMg = 'Enter a valid mass in milligrams.';
    else if (m === 'negative') errors.massMg = 'Mass and volume cannot be negative.';
    else if (m === 'large') errors.massMg = 'Enter a smaller mass.';
  } else {
    const v = numProblem(input.volumeCc, { allowZero: true });
    if (v === 'blank') blank = true;
    else if (v === 'bad') errors.volumeCc = 'Enter a valid volume in cubic centimeters.';
    else if (v === 'negative') errors.volumeCc = 'Mass and volume cannot be negative.';
    else if (v === 'large') errors.volumeCc = 'Enter a smaller volume.';
  }

  return { isValid: Object.keys(errors).length === 0 && !blank, errors };
}
