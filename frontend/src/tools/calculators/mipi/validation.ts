import { calculateMipi, parseNumber } from './calculation';
import type { MipiFieldErrors, MipiInput, MipiResult } from './types';

export interface MipiValidation {
  isValid: boolean;
  errors: MipiFieldErrors;
  result: MipiResult | null;
}

export function validateMipiInput(input: MipiInput): MipiValidation {
  const errors: MipiFieldErrors = {};

  const age = parseNumber(input.ageYearsText);
  if (input.ageYearsText.trim() !== '' && age === null) {
    errors.ageYearsText = 'Enter a valid age in years.';
  } else if (age !== null && !(age >= 0 && age <= 120)) {
    errors.ageYearsText = 'Age must be between 0 and 120 years.';
  }

  const ldh = parseNumber(input.serumLdhText);
  if (input.serumLdhText.trim() !== '' && ldh === null) {
    errors.serumLdhText = 'Enter a valid serum LDH.';
  } else if (ldh !== null && !(ldh > 0)) {
    errors.serumLdhText = 'Serum LDH must be greater than 0.';
  }

  const uln = parseNumber(input.ldhUlnText);
  if (input.ldhUlnText.trim() !== '' && uln === null) {
    errors.ldhUlnText = 'Enter a valid LDH upper normal limit.';
  } else if (uln !== null && !(uln > 0)) {
    errors.ldhUlnText = 'ULN must be greater than 0.';
  }

  const wbc = parseNumber(input.wbcThousandPerUlText);
  if (input.wbcThousandPerUlText.trim() !== '' && wbc === null) {
    errors.wbcThousandPerUlText = 'Enter a valid WBC (×1000/µL).';
  } else if (wbc !== null && !(wbc > 0)) {
    errors.wbcThousandPerUlText = 'WBC must be greater than 0.';
  }

  if (input.knowKi67) {
    const ki67 = parseNumber(input.ki67PercentText);
    if (input.ki67PercentText.trim() !== '' && ki67 === null) {
      errors.ki67PercentText = 'Enter a valid Ki-67 percentage.';
    } else if (ki67 !== null && !(ki67 >= 0 && ki67 <= 100)) {
      errors.ki67PercentText = 'Ki-67 must be between 0 and 100%.';
    }
  }

  const result = calculateMipi(input);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    result,
  };
}
