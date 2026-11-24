import { calculateFena, parseNumber } from './calculation';
import type { FenaFieldErrors, FenaInput, FenaResult } from './types';

export interface FenaValidation {
  errors: FenaFieldErrors;
  result: FenaResult | null;
}

function checkNonNeg(
  raw: string,
  label: string,
): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label} value.`;
  if (n < 0) return `${label} must be non-negative.`;
  return undefined;
}

export function validateFenaInput(input: FenaInput): FenaValidation {
  const errors: FenaFieldErrors = {};

  const scr = checkNonNeg(input.serumCreatinineText, 'serum creatinine');
  if (scr) errors.serumCreatinineText = scr;
  const sna = checkNonNeg(input.serumSodiumText, 'serum sodium');
  if (sna) errors.serumSodiumText = sna;
  const ucr = checkNonNeg(input.urineCreatinineText, 'urine creatinine');
  if (ucr) errors.urineCreatinineText = ucr;
  const una = checkNonNeg(input.urineSodiumText, 'urine sodium');
  if (una) errors.urineSodiumText = una;

  const serumSodium = parseNumber(input.serumSodiumText);
  const urineCreatinine = parseNumber(input.urineCreatinineText);
  if (
    input.serumSodiumText.trim() !== '' &&
    serumSodium !== null &&
    !errors.serumSodiumText &&
    !(serumSodium > 0)
  ) {
    errors.serumSodiumText = 'Serum sodium must be greater than zero.';
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

  return { errors: {}, result: calculateFena(input) };
}
