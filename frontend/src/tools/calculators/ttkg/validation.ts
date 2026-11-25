import { calculateTtkg, parseNumber } from './calculation';
import type { TtkgFieldErrors, TtkgInput, TtkgResult } from './types';

export interface TtkgValidation {
  errors: TtkgFieldErrors;
  result: TtkgResult | null;
}

function checkNonNeg(raw: string, label: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = parseNumber(raw);
  if (n === null) return `Enter a valid ${label} value.`;
  if (n < 0) return `${label} must be non-negative.`;
  return undefined;
}

export function validateTtkgInput(input: TtkgInput): TtkgValidation {
  const errors: TtkgFieldErrors = {};

  const serumK = checkNonNeg(input.serumPotassiumText, 'serum potassium');
  if (serumK) errors.serumPotassiumText = serumK;
  const urineK = checkNonNeg(input.urinePotassiumText, 'urine potassium');
  if (urineK) errors.urinePotassiumText = urineK;
  const serumOsm = checkNonNeg(input.serumOsmolalityText, 'serum osmolality');
  if (serumOsm) errors.serumOsmolalityText = serumOsm;
  const urineOsm = checkNonNeg(input.urineOsmolalityText, 'urine osmolality');
  if (urineOsm) errors.urineOsmolalityText = urineOsm;

  const serumKVal = parseNumber(input.serumPotassiumText);
  const serumOsmVal = parseNumber(input.serumOsmolalityText);
  const urineOsmVal = parseNumber(input.urineOsmolalityText);

  if (
    input.serumPotassiumText.trim() !== '' &&
    serumKVal !== null &&
    !errors.serumPotassiumText &&
    !(serumKVal > 0)
  ) {
    errors.serumPotassiumText = 'Serum potassium must be greater than zero.';
  }
  if (
    input.serumOsmolalityText.trim() !== '' &&
    serumOsmVal !== null &&
    !errors.serumOsmolalityText &&
    !(serumOsmVal > 0)
  ) {
    errors.serumOsmolalityText = 'Serum osmolality must be greater than zero.';
  }
  if (
    input.urineOsmolalityText.trim() !== '' &&
    urineOsmVal !== null &&
    !errors.urineOsmolalityText &&
    !(urineOsmVal > 0)
  ) {
    errors.urineOsmolalityText = 'Urine osmolality must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  return { errors: {}, result: calculateTtkg(input) };
}