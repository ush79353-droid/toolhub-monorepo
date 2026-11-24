import { calculateFeurea, parseNumber } from './calculation';
import type { FeureaFieldErrors, FeureaInput, FeureaResult } from './types';

export interface FeureaValidation {
  errors: FeureaFieldErrors;
  result: FeureaResult | null;
}

function checkNonNeg(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label} value.`;
  if (n < 0) return `${label} must be non-negative.`;
  return undefined;
}

export function validateFeureaInput(input: FeureaInput): FeureaValidation {
  const errors: FeureaFieldErrors = {};

  const scr = checkNonNeg(input.serumCreatinineText, 'serum creatinine');
  if (scr) errors.serumCreatinineText = scr;
  const surea = checkNonNeg(input.serumUreaText, 'serum urea / BUN');
  if (surea) errors.serumUreaText = surea;
  const ucr = checkNonNeg(input.urineCreatinineText, 'urine creatinine');
  if (ucr) errors.urineCreatinineText = ucr;
  const uurea = checkNonNeg(input.urineUreaText, 'urine urea');
  if (uurea) errors.urineUreaText = uurea;

  const serumUrea = parseNumber(input.serumUreaText);
  const urineCreatinine = parseNumber(input.urineCreatinineText);
  if (
    input.serumUreaText.trim() !== '' &&
    serumUrea !== null &&
    !errors.serumUreaText &&
    !(serumUrea > 0)
  ) {
    errors.serumUreaText = 'Serum urea / BUN must be greater than zero.';
  }
  if (
    input.urineCreatinineText.trim() !== '' &&
    urineCreatinine !== null &&
    !errors.urineCreatinineText &&
    !(urineCreatinine > 0)
  ) {
    errors.urineCreatinineText = 'Urine creatinine must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateFeurea(input) };
}
